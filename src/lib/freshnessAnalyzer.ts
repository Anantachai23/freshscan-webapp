import {
  SEAFOOD_TYPES,
  FRESHNESS_GRADES,
  gradeFromScore20,
  type SeafoodTypeId,
  type FreshnessGrade,
} from "@/data/freshscan_taxonomy";
import { extractImageFeatures, FEATURE_KEYS, type ImageFeatures } from "@/lib/imageFeatures";
import calibrationData from "@/data/calibration.json";

export interface CriterionScore {
  id: string;
  labelTh: string;
  labelEn: string;
  score: number; // 0..max
  max: number; // 10
  note: string;
}

export interface AnalyzeResult {
  seafoodType: SeafoodTypeId;
  seafoodTypeTh: string;
  grade: FreshnessGrade;
  gradeTh: string;
  confidence: number; // 0..1
  freshnessScore: number; // 0..100
  score20: number;
  score20Max: number;
  criteriaScores: CriterionScore[];
  cues: string[];
  recommendation: string;
  safetyWarning?: string;
  perGrade: { grade: FreshnessGrade; prob: number }[];
  speciesGuess: string;
  xaiRegions: readonly string[];
  imageWasResized?: boolean;
  usedCalibration?: boolean;
}

/**
 * Real image analyzer — reads actual pixel data from the uploaded photo
 * (see src/lib/imageFeatures.ts) instead of deriving a score from file
 * size/name. It is an explainable heuristic, not a trained deep-learning
 * model: it looks at brightness, color saturation, dark-blotch coverage,
 * dull yellow/brown discoloration, color uniformity, and texture sharpness —
 * documented visual proxies used in manual food-quality inspection.
 *
 * Run `npm run calibrate` after adding real labeled photos to
 * /Datasetimage to blend in a small nudge based on how close the photo's
 * features are to your real fresh/not-fresh reference averages for that
 * seafood type (see calibration.json).
 */

type Calibration = {
  categories: Record<string, { count: number; mean: Record<keyof ImageFeatures, number> }>;
};

const calibration = calibrationData as unknown as Calibration;

function calibrationScoreNudge(
  seafoodType: SeafoodTypeId,
  features: ImageFeatures,
): { nudge: number; used: boolean } {
  const grades: FreshnessGrade[] = ["A", "B", "C"];
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
  const centerFor: Record<FreshnessGrade, number> = { A: 18, B: 13, C: 5 };
  const nudge = Math.max(-2.5, Math.min(2.5, (centerFor[nearest] - 13) * 0.25));
  return { nudge, used: true };
}

function featureScore(features: ImageFeatures): number {
  const {
    brightness,
    saturation,
    darkSpotRatio,
    dullYellowBrownRatio,
    colorUniformity,
    edgeSharpness,
  } = features;
  let s = 0.5;
  s += (brightness - 0.45) * 0.55;
  s += (saturation - 0.25) * 0.65;
  s += (colorUniformity - 0.5) * 0.35;
  s += (edgeSharpness - 0.3) * 0.32;
  s -= darkSpotRatio * 1.15;
  s -= dullYellowBrownRatio * 1.3;
  return Math.max(0, Math.min(1, s));
}

export async function analyzeImage(
  seafoodType: SeafoodTypeId,
  file: File,
  opts?: { imageWasResized?: boolean },
): Promise<AnalyzeResult> {
  const type = SEAFOOD_TYPES.find((t) => t.id === seafoodType)!;
  const features = await extractImageFeatures(file);
  const signal = featureScore(features);

  const criteriaScores: CriterionScore[] = type.scoreCriteria.map((c, i) => {
    const colorLeaning =
      0.6 * signal + 0.4 * (1 - features.dullYellowBrownRatio) * 0.5 + 0.4 * features.saturation;
    const textureLeaning =
      0.6 * signal + 0.4 * features.edgeSharpness * 0.6 + 0.4 * (1 - features.darkSpotRatio) * 0.5;
    const blended = i % 2 === 0 ? colorLeaning : textureLeaning;
    const norm = Math.max(0, Math.min(1, blended));
    const score = Math.round(norm * c.max * 10) / 10;
    const level =
      c.levels.find((lv) => score >= lv.scoreMin && score <= lv.scoreMax) ??
      c.levels[c.levels.length - 1];
    const note = `${level.labelTh} — ${level.descTh}`;
    return { id: c.id, labelTh: c.labelTh, labelEn: c.labelEn, score, max: c.max, note };
  });

  const score20Max = type.scoreCriteria.reduce((sum, c) => sum + c.max, 0);
  let score20Raw = criteriaScores.reduce((sum, c) => sum + c.score, 0);

  const { nudge, used: usedCalibration } = calibrationScoreNudge(seafoodType, features);
  score20Raw = Math.max(0, Math.min(score20Max, score20Raw + nudge));

  const score20 = Math.round(score20Raw * 10) / 10;
  const grade = gradeFromScore20(score20);

  const grades: FreshnessGrade[] = ["A", "B", "C"];
  const gradeCenter: Record<FreshnessGrade, number> = { A: 18, B: 13, C: 5 };
  const raw = grades.map((g) => 1 / (1 + Math.abs(score20 - gradeCenter[g])));
  const sum = raw.reduce((a, b) => a + b, 0);
  const probs = raw.map((x) => x / sum);
  const confidence = probs[grades.indexOf(grade)];

  const gradeMeta = FRESHNESS_GRADES.find((g) => g.id === grade)!;
  const cuesData = type.cuesByGrade[grade];
  const cues = [
    ...criteriaScores.map((c) => `${c.labelTh}: ${c.score}/${c.max} คะแนน — ${c.note}`),
    `จุดสังเกตเพิ่มเติม: ${cuesData.reject}`,
  ];
  if (features.darkSpotRatio > 0.08) {
    cues.push(
      "ตรวจพบบริเวณสีเข้ม/รอยดำในภาพมากกว่าปกติ (วิเคราะห์จากพิกเซลจริง) อาจเป็นรอยช้ำหรือการเสื่อมคุณภาพ",
    );
  }
  if (features.dullYellowBrownRatio > 0.08) {
    cues.push(
      "ตรวจพบโทนสีเหลือง/น้ำตาลหม่นในภาพ (วิเคราะห์จากพิกเซลจริง) ซึ่งมักพบเมื่อคุณภาพเริ่มลดลง",
    );
  }
  if (usedCalibration) {
    cues.push("ผลลัพธ์นี้ปรับเทียบเพิ่มเติมด้วยชุดภาพอ้างอิงจริงใน Datasetimage");
  }

  const freshnessScore = Math.round((score20 / score20Max) * 100);
  const species =
    type.supportedSpeciesTh[
      Math.min(
        type.supportedSpeciesTh.length - 1,
        Math.round(signal * (type.supportedSpeciesTh.length - 1)),
      )
    ];

  return {
    seafoodType,
    seafoodTypeTh: type.labelTh,
    grade,
    gradeTh: gradeMeta.label_th,
    confidence,
    freshnessScore,
    score20,
    score20Max,
    criteriaScores,
    cues,
    recommendation: gradeMeta.action,
    safetyWarning:
      grade === "C"
        ? "⚠ ตรวจพบสัญญาณเสื่อมคุณภาพ ไม่แนะนำให้บริโภค โดยเฉพาะหากมีกลิ่นผิดปกติหรือเนื้อเละ ควรทิ้งเพื่อความปลอดภัย"
        : undefined,
    perGrade: grades.map((g, i) => ({ grade: g, prob: probs[i] })),
    speciesGuess: species,
    xaiRegions: type.xaiRegions,
    imageWasResized: opts?.imageWasResized,
    usedCalibration,
  };
}

export const LOW_CONFIDENCE_THRESHOLD = 0.7;
