import manifestRaw from "@/data/dataset/sample_manifest.csv?raw";
import targetsRaw from "@/data/dataset/target_counts.csv?raw";
import qualityRules from "@/data/dataset/quality_rules.json";
import { SEAFOOD_TYPES, type SeafoodTypeId, type FreshnessGrade } from "@/data/freshscan_taxonomy";

export type Split = "train" | "val" | "test";

export interface ManifestRow {
  image_id: string;
  split: Split;
  image_path: string;
  seafood_type_id: SeafoodTypeId;
  species_th: string;
  grade: FreshnessGrade;
  freshness_score: number;
  source_market: string;
  province: string;
  lighting: string;
  camera_angle: string;
  expert_1_grade: FreshnessGrade;
  expert_2_grade: FreshnessGrade;
  label_status: string;
  visible_regions: string;
  notes: string;
}

export interface TargetRow {
  seafood_type_id: SeafoodTypeId;
  grade: FreshnessGrade;
  original_target: number;
  train: number;
  val: number;
  test: number;
  after_aug: number;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuote = false;
      } else field += c;
    } else {
      if (c === '"') inQuote = true;
      else if (c === ",") {
        cur.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (field.length || cur.length) {
          cur.push(field);
          rows.push(cur);
          cur = [];
          field = "";
        }
        if (c === "\r" && text[i + 1] === "\n") i++;
      } else field += c;
    }
  }
  if (field.length || cur.length) {
    cur.push(field);
    rows.push(cur);
  }
  return rows;
}

export function toRecords(csv: string): Record<string, string>[] {
  const rows = parseCSV(csv);
  if (!rows.length) return [];
  const header = rows[0];
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, i) => (obj[h] = r[i] ?? ""));
    return obj;
  });
}

export function parseManifestCSV(csv: string): ManifestRow[] {
  return toRecords(csv).map((r) => ({
    image_id: r.image_id,
    split: r.split as Split,
    image_path: r.image_path,
    seafood_type_id: r.seafood_type_id as SeafoodTypeId,
    species_th: r.species_th,
    grade: r.grade as FreshnessGrade,
    freshness_score: Number(r.freshness_score),
    source_market: r.source_market,
    province: r.province,
    lighting: r.lighting,
    camera_angle: r.camera_angle,
    expert_1_grade: r.expert_1_grade as FreshnessGrade,
    expert_2_grade: r.expert_2_grade as FreshnessGrade,
    label_status: r.label_status,
    visible_regions: r.visible_regions,
    notes: r.notes,
  }));
}


export const MANIFEST: ManifestRow[] = toRecords(manifestRaw).map((r) => ({
  image_id: r.image_id,
  split: r.split as Split,
  image_path: r.image_path,
  seafood_type_id: r.seafood_type_id as SeafoodTypeId,
  species_th: r.species_th,
  grade: r.grade as FreshnessGrade,
  freshness_score: Number(r.freshness_score),
  source_market: r.source_market,
  province: r.province,
  lighting: r.lighting,
  camera_angle: r.camera_angle,
  expert_1_grade: r.expert_1_grade as FreshnessGrade,
  expert_2_grade: r.expert_2_grade as FreshnessGrade,
  label_status: r.label_status,
  visible_regions: r.visible_regions,
  notes: r.notes,
}));

export const TARGETS: TargetRow[] = toRecords(targetsRaw).map((r) => ({
  seafood_type_id: r.seafood_type_id as SeafoodTypeId,
  grade: r.grade as FreshnessGrade,
  original_target: Number(r.original_target_images_before_augmentation),
  train: Number(r.train_images),
  val: Number(r.validation_images),
  test: Number(r.test_images),
  after_aug: Number(r.expected_images_after_augmentation),
}));

export const QUALITY_RULES = qualityRules;

export interface ValidationIssue {
  level: "error" | "warning" | "info";
  message: string;
}

export function validateManifest(rows: ManifestRow[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const validTypes = new Set(SEAFOOD_TYPES.map((s) => s.id));
  const validGrades = new Set(["A", "B", "C"]);
  const validSplits = new Set(["train", "val", "test"]);

  // duplicates
  const ids = new Set<string>();
  for (const r of rows) {
    if (ids.has(r.image_id)) issues.push({ level: "error", message: `image_id ซ้ำ: ${r.image_id}` });
    ids.add(r.image_id);

    if (!validTypes.has(r.seafood_type_id))
      issues.push({ level: "error", message: `${r.image_id}: seafood_type_id ไม่ถูกต้อง (${r.seafood_type_id})` });
    if (!validGrades.has(r.grade))
      issues.push({ level: "error", message: `${r.image_id}: grade ต้องเป็น A/B/C` });
    if (!validSplits.has(r.split))
      issues.push({ level: "error", message: `${r.image_id}: split ต้องเป็น train/val/test` });

    if (r.freshness_score < 0 || r.freshness_score > 100)
      issues.push({ level: "error", message: `${r.image_id}: freshness_score ต้องอยู่ระหว่าง 0–100` });

    // Grade vs score range
    const inRange =
      (r.grade === "A" && r.freshness_score >= 80) ||
      (r.grade === "B" && r.freshness_score >= 55 && r.freshness_score < 80) ||
      (r.grade === "C" && r.freshness_score < 55);
    if (!inRange)
      issues.push({
        level: "warning",
        message: `${r.image_id}: freshness_score (${r.freshness_score}) ไม่ตรงกับช่วงของ grade ${r.grade}`,
      });

    // expert agreement
    if (r.expert_1_grade !== r.expert_2_grade && r.label_status !== "needs_review")
      issues.push({
        level: "warning",
        message: `${r.image_id}: ผู้เชี่ยวชาญให้คะแนนไม่ตรงกัน ต้องระบุ label_status = needs_review`,
      });
  }

  // split ratio (informational against target)
  const total = rows.length;
  if (total > 0) {
    const train = rows.filter((r) => r.split === "train").length / total;
    const val = rows.filter((r) => r.split === "val").length / total;
    const test = rows.filter((r) => r.split === "test").length / total;
    const r = qualityRules.required_splits;
    const tol = 0.05;
    if (Math.abs(train - r.train) > tol)
      issues.push({ level: "info", message: `สัดส่วน train = ${(train * 100).toFixed(1)}% (เป้า ${r.train * 100}%)` });
    if (Math.abs(val - r.validation) > tol)
      issues.push({ level: "info", message: `สัดส่วน val = ${(val * 100).toFixed(1)}% (เป้า ${r.validation * 100}%)` });
    if (Math.abs(test - r.test) > tol)
      issues.push({ level: "info", message: `สัดส่วน test = ${(test * 100).toFixed(1)}% (เป้า ${r.test * 100}%)` });
  }

  if (total < qualityRules.min_original_images_before_augmentation)
    issues.push({
      level: "warning",
      message: `จำนวนภาพต้นฉบับรวม ${total} ภาพ ยังไม่ถึงเป้า ${qualityRules.min_original_images_before_augmentation} ภาพ`,
    });

  return issues;
}
