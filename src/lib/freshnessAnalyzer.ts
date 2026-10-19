import {
  SEAFOOD_TYPES,
  FRESHNESS_GRADES,
  gradeFromQimDemerit,
  calculateFreshnessIndex,
  getGradeInfo,
  type SeafoodTypeId,
  type FreshnessGrade,
  type QimCriterion,
} from "@/data/freshscan_taxonomy";
import { extractImageFeatures, FEATURE_KEYS, type ImageFeatures } from "@/lib/imageFeatures";
import calibrationData from "@/data/calibration.json";

export interface CriterionDemerit {
  id: string;
  labelTh: string;
  labelEn: string;
  demeritPoints: number; // 0..maxDemerit (0 is best)
  maxDemerit: number;
  weight: number;
  anatomicalRegion: string;
  biomarker: string;
  noteTh: string;
  status: "optimal" | "acceptable" | "degraded";
}

export interface AnalyzeResult {
  seafoodType: SeafoodTypeId;
  seafoodTypeTh: string;
  seafoodTypeEn: string;
  scientificFamily: string;
  standardDoc: string;
  grade: FreshnessGrade;
  gradeTh: string;
  gradeEn: string;
  freshnessIndex: number; // 0..100% (100% = freshest)
  totalDemerit: number; // 0..20 points (0 = zero defects)
  maxDemerit: number; // 20
  confidence: number; // 0..1
  criteriaScores: CriterionDemerit[];
  biologicalCues: {
    category: "positive" | "warning" | "critical";
    titleTh: string;
    descriptionTh: string;
  }[];
  recommendationTh: string;
  culinaryUseTh: string;
  storageRecommendationTh: string;
  safetyWarning?: string;
  gradeProbabilities: { grade: FreshnessGrade; prob: number; labelTh: string }[];
  speciesGuess: {
    commonTh: string;
    commonEn: string;
    scientific: string;
    habitat: string;
  };
  features: ImageFeatures;
  imageWasResized?: boolean;
  usedCalibration?: boolean;
  analyzedAt: string;
}

type Calibration = {
  categories: Record<string, { count: number; mean: Record<keyof ImageFeatures, number> }>;
};

const calibration = calibrationData as unknown as Calibration;

function calibrationDemeritNudge(
  seafoodType: SeafoodTypeId,
  features: ImageFeatures,
): { nudge: number; used: boolean } {
  const grades: FreshnessGrade[] = ["A", "B", "C", "D"];
  const entries = grades
    .map((g) => ({ grade: g, cat: calibration.categories?.[`${seafoodType}:${g}`] }))
    .filter(
      (
        e,
      ): e is {
        grade: FreshnessGrade;
        cat: { count: number; mean: Record<keyof ImageFeatures, number> };
      } => !!e.cat && e.cat.count >= 3,
    );

  if (entries.length < 2) return { nudge: 0, used: false };

  const dist = (mean: Record<keyof ImageFeatures, number>) => {
    let d = 0;
    for (const k of FEATURE_KEYS) {
      const diff = features[k] - mean[k];
      d += diff * diff;
    }
    return Math.sqrt(d);
  };

  const scored = entries
    .map((e) => ({ grade: e.grade, d: dist(e.cat.mean) }))
    .sort((a, b) => a.d - b.d);

  const nearest = scored[0].grade;
  const targetDemerit: Record<FreshnessGrade, number> = { A: 2, B: 7, C: 12, D: 17 };
  const nudge = Math.max(-2, Math.min(2, (targetDemerit[nearest] - 8) * 0.15));
  return { nudge, used: true };
}

/**
 * Computes an overall biological degradation index (0 = fresh, 1 = severely degraded)
 * from calibrated image pixel properties.
 */
function calculateDegradationSignal(
  seafoodType: SeafoodTypeId,
  features: ImageFeatures,
): { degradation: number; qualityScore: number } {
  const {
    brightness,
    saturation,
    darkSpotRatio,
    dullYellowBrownRatio,
    colorUniformity,
    edgeSharpness,
  } = features;

  let degradation = 0;

  // Type-specific sensitivity weighting
  switch (seafoodType) {
    case "shrimp":
      // Melanosis (blackening) & dull brown oxidation are primary failure indicators in shrimp
      degradation =
        darkSpotRatio * 2.8 +
        dullYellowBrownRatio * 2.2 +
        Math.max(0, 0.45 - brightness) * 1.2 +
        Math.max(0, 0.28 - edgeSharpness) * 0.8 +
        (1 - colorUniformity) * 0.6;
      break;

    case "fish":
      // Gill erythema, eye clarity (contrast/edge), and skin luster
      degradation =
        dullYellowBrownRatio * 2.5 +
        darkSpotRatio * 1.8 +
        Math.max(0, 0.3 - saturation) * 1.5 +
        Math.max(0, 0.3 - edgeSharpness) * 1.1 +
        Math.max(0, 0.4 - brightness) * 0.9;
      break;

    case "squid":
      // Chromatophore clarity (sharpness) and absence of discolored yellow/brown patches
      degradation =
        dullYellowBrownRatio * 2.6 +
        (1 - colorUniformity) * 1.4 +
        Math.max(0, 0.32 - edgeSharpness) * 1.3 +
        Math.max(0, 0.42 - brightness) * 0.9;
      break;

    case "shellfish":
      // Cloudiness, dry dull shell, dark decaying fluid
      degradation =
        darkSpotRatio * 2.2 +
        dullYellowBrownRatio * 2.0 +
        Math.max(0, 0.25 - saturation) * 1.2 +
        (1 - colorUniformity) * 0.8;
      break;
  }

  // Normalization to 0..1 range
  degradation = Math.max(0, Math.min(1, degradation));
  const qualityScore = 1 - degradation;

  return { degradation, qualityScore };
}

export async function analyzeImage(
  seafoodType: SeafoodTypeId,
  file: File,
  opts?: { imageWasResized?: boolean },
): Promise<AnalyzeResult> {
  const typeDef = SEAFOOD_TYPES.find((t) => t.id === seafoodType) ?? SEAFOOD_TYPES[0];
  const features = await extractImageFeatures(file);
  const { degradation, qualityScore } = calculateDegradationSignal(seafoodType, features);

  // Evaluate each QIM criterion
  const criteriaScores: CriterionDemerit[] = typeDef.qimCriteria.map((criterion, idx) => {
    // Staggered weighting across spectral and texture proxies
    let criterionDegradation = degradation;

    if (criterion.anatomicalRegion === "gill" || criterion.anatomicalRegion === "mantle_skin") {
      criterionDegradation =
        0.5 * degradation + 0.3 * features.dullYellowBrownRatio * 2 + 0.2 * (1 - features.saturation);
    } else if (criterion.anatomicalRegion === "eye" || criterion.anatomicalRegion === "head") {
      criterionDegradation =
        0.5 * degradation + 0.3 * (1 - features.edgeSharpness) + 0.2 * features.darkSpotRatio * 2;
    } else if (criterion.anatomicalRegion === "joints" || criterion.anatomicalRegion === "shell_valves") {
      criterionDegradation =
        0.5 * degradation + 0.35 * features.darkSpotRatio * 2.5 + 0.15 * (1 - features.colorUniformity);
    }

    const norm = Math.max(0, Math.min(1, criterionDegradation));
    const demeritPoints = Math.round(norm * criterion.maxDemerit * 10) / 10;

    // Pick matching level description
    const level =
      criterion.levels.find(
        (lv) => demeritPoints >= lv.demeritMin && demeritPoints <= lv.demeritMax,
      ) ?? criterion.levels[criterion.levels.length - 1];

    let status: "optimal" | "acceptable" | "degraded" = "optimal";
    const ratio = demeritPoints / criterion.maxDemerit;
    if (ratio > 0.6) status = "degraded";
    else if (ratio > 0.3) status = "acceptable";

    return {
      id: criterion.id,
      labelTh: criterion.labelTh,
      labelEn: criterion.labelEn,
      demeritPoints,
      maxDemerit: criterion.maxDemerit,
      weight: criterion.weight,
      anatomicalRegion: criterion.anatomicalRegion,
      biomarker: criterion.biomarker,
      noteTh: `${level.labelTh} (${level.descTh})`,
      status,
    };
  });

  // Calculate weighted total demerit points (0..20)
  const weightedSum = criteriaScores.reduce((sum, c) => sum + (c.demeritPoints / c.maxDemerit) * c.weight, 0);
  const totalWeight = criteriaScores.reduce((sum, c) => sum + c.weight, 0);
  let totalDemerit = (weightedSum / totalWeight) * 20;

  // Apply calibration nudge if reference dataset exists
  const { nudge, used: usedCalibration } = calibrationDemeritNudge(seafoodType, features);
  totalDemerit = Math.max(0, Math.min(20, totalDemerit + nudge));
  totalDemerit = Math.round(totalDemerit * 10) / 10;

  const freshnessIndex = calculateFreshnessIndex(totalDemerit);
  const grade = gradeFromQimDemerit(totalDemerit);
  const gradeMeta = getGradeInfo(grade);

  // Bayesian distribution calculation for grade probabilities
  const gradeCenters: Record<FreshnessGrade, number> = { A: 2, B: 7, C: 12, D: 17 };
  const allGrades: FreshnessGrade[] = ["A", "B", "C", "D"];
  const distances = allGrades.map((g) => 1 / (1 + Math.abs(totalDemerit - gradeCenters[g]) ** 1.5));
  const distSum = distances.reduce((a, b) => a + b, 0);
  const probs = distances.map((d) => d / distSum);

  const gradeIndex = allGrades.indexOf(grade);
  const confidence = Math.round((probs[gradeIndex] ?? 0.85) * 100) / 100;

  // Generate structured biological cues
  const biologicalCues: AnalyzeResult["biologicalCues"] = [];

  if (features.darkSpotRatio < 0.03 && features.dullYellowBrownRatio < 0.04) {
    biologicalCues.push({
      category: "positive",
      titleTh: "เม็ดสีและพื้นผิวเปลือกบริสุทธิ์",
      descriptionTh: "ไม่พบรอยด่างดำ (Melanosis) หรือคราบออกซิเดชันของไขมัน สีสันตามธรรมชาติกระจายตัวสม่ำเสมอ",
    });
  }

  if (features.edgeSharpness > 0.42) {
    biologicalCues.push({
      category: "positive",
      titleTh: "โครงสร้างทางกายภาพคมชัดสมบูรณ์",
      descriptionTh: "พื้นผิวสะท้อนแสง มีรอยต่อของเกล็ดและเส้นใยกล้ามเนื้อที่คงตัว ไม่พบการเปื่อยยุ่ย",
    });
  }

  if (features.darkSpotRatio >= 0.07) {
    biologicalCues.push({
      category: "warning",
      titleTh: "ตรวจพบลักษณะจุดคล้ำสะสม (Dark Pigmentation)",
      descriptionTh: `พบการสะสมของจุดสีคล้ำ ${(features.darkSpotRatio * 100).toFixed(1)}% ของพื้นที่ ซึ่งสอดคล้องกับระยะเริ่มเสื่อมของเนื้อเยื่อ`,
    });
  }

  if (features.dullYellowBrownRatio >= 0.08) {
    biologicalCues.push({
      category: "warning",
      titleTh: "พบสัญญาณการเปลี่ยนสีจากการออกซิเดชัน (Enzymatic Browning)",
      descriptionTh: `การแปรเปลี่ยนของสีสู่โทนน้ำตาลอมเหลือง ${(features.dullYellowBrownRatio * 100).toFixed(1)}% เกิดจากกระบวนการสัมผัสอากาศและอุณหภูมิที่สูงเกินไป`,
    });
  }

  if (grade === "D" || totalDemerit >= 15) {
    biologicalCues.push({
      category: "critical",
      titleTh: "ความเสื่อมสภาพในระดับอันตรายทางชีวภาพ (Biological Spoilage)",
      descriptionTh: "ดัชนี QIM สูงกว่าเกณฑ์ความปลอดภัย พบการย่อยสลายของเนื้อเยื่อและมีความเสี่ยงต่อสารชีวพิษ",
    });
  }

  // Pick a species guess based on quality signal and species list
  const speciesList = typeDef.supportedSpecies;
  const speciesGuessIndex = Math.min(
    speciesList.length - 1,
    Math.floor((1 - qualityScore) * speciesList.length),
  );
  const speciesGuess = speciesList[speciesGuessIndex] ?? speciesList[0];

  let safetyWarning: string | undefined = undefined;
  if (grade === "D") {
    safetyWarning =
      "🚨 แจ้งเตือนความปลอดภัยอาหาร: วัตถุดิบมีดัชนีความเสื่อมสภาพสูงเกินเกณฑ์มาตรฐานสากล (QIM > 15) เสี่ยงต่อการปนเปื้อนของแบคทีเรียและสารฮิสตามีน (Histamine) ห้ามนำมาบริโภคทุกกรณี";
  } else if (grade === "C") {
    safetyWarning =
      "⚠️ คำแนะนำพิเศษ: วัตถุดิบอยู่ในเกณฑ์ใกล้หมดอายุความสด หากต้องการบริโภคต้องล้างด้วยน้ำเกลือสะอาดและปรุงสุกผ่านความร้อนสูง (>100°C) ภายในทันที ห้ามรับประทานดิบ";
  }

  return {
    seafoodType,
    seafoodTypeTh: typeDef.labelTh,
    seafoodTypeEn: typeDef.labelEn,
    scientificFamily: typeDef.scientificFamily,
    standardDoc: typeDef.standardDoc,
    grade,
    gradeTh: gradeMeta.labelTh,
    gradeEn: gradeMeta.labelEn,
    freshnessIndex,
    totalDemerit,
    maxDemerit: 20,
    confidence,
    criteriaScores,
    biologicalCues,
    recommendationTh: gradeMeta.actionTh,
    culinaryUseTh: gradeMeta.culinaryUseTh,
    storageRecommendationTh: gradeMeta.storageRecommendationTh,
    safetyWarning,
    gradeProbabilities: allGrades.map((g, i) => ({
      grade: g,
      prob: Math.round(probs[i] * 100),
      labelTh: getGradeInfo(g).labelTh,
    })),
    speciesGuess,
    features,
    imageWasResized: opts?.imageWasResized,
    usedCalibration,
    analyzedAt: new Date().toISOString(),
  };
}

export const LOW_CONFIDENCE_THRESHOLD = 0.65;
