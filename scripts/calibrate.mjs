#!/usr/bin/env node
/**
 * Reads real labeled photos from /Datasetimage and computes per-category
 * average pixel features, saved to src/data/calibration.json.
 *
 * This mirrors the exact feature-extraction math used client-side in
 * src/lib/imageFeatures.ts so the calibration numbers are directly
 * comparable to what the browser computes at analysis time.
 *
 * Usage: npm run calibrate
 * Requires: npm install (installs `sharp`, used only by this script).
 */
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SIZE = 160;
const CELLS = 20;
const ROOT = path.resolve(process.cwd(), "Datasetimage");
const OUT = path.resolve(process.cwd(), "src/data/calibration.json");

const SPECIES = ["fish", "shrimp", "shellfish", "squid"];
const FRESHNESS_DIRS = { fresh: "A", not_fresh: "C" };
const FEATURE_KEYS = [
  "brightness",
  "saturation",
  "darkSpotRatio",
  "dullYellowBrownRatio",
  "colorUniformity",
  "edgeSharpness",
];

function weightAt(x, y) {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
  return d < 0.55 ? 1 : Math.max(0.25, 1 - (d - 0.55) * 1.6);
}

function extractFeatures(data) {
  const n = SIZE * SIZE;
  let sumBrightness = 0;
  let sumSaturation = 0;
  let sumWeight = 0;
  const luminances = new Float32Array(n);
  const weights = new Float32Array(n);

  for (let y = 0, p = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++, p++) {
      const i = p * 4;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1) || 1);
      const w = weightAt(x, y);
      luminances[p] = l;
      weights[p] = w;
      sumBrightness += l * w;
      sumSaturation += sat * w;
      sumWeight += w;
    }
  }

  const brightness = sumBrightness / sumWeight;
  const saturation = sumSaturation / sumWeight;

  const cellSize = SIZE / CELLS;
  let darkCells = 0;
  let yellowBrownCells = 0;
  let totalCellWeight = 0;

  for (let cy2 = 0; cy2 < CELLS; cy2++) {
    for (let cx2 = 0; cx2 < CELLS; cx2++) {
      let cellL = 0;
      let cellYellowish = 0;
      let cellSat = 0;
      let count = 0;
      const x0 = Math.floor(cx2 * cellSize);
      const y0 = Math.floor(cy2 * cellSize);
      const x1 = Math.floor((cx2 + 1) * cellSize);
      const y1 = Math.floor((cy2 + 1) * cellSize);

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const p = y * SIZE + x;
          const i = p * 4;
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 2;
          const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1) || 1);
          cellL += l;
          cellSat += sat;
          if (r > 0.3 && g > 0.25 && r - b > 0.06 && g - b > 0.02) cellYellowish++;
          count++;
        }
      }

      const w = weightAt((x0 + x1) / 2, (y0 + y1) / 2);
      cellL /= count;
      const cellYellowRatio = cellYellowish / count;
      totalCellWeight += w;
      if (cellL < 0.24) darkCells += w;
      if (cellYellowRatio > 0.5 && cellSat / count < 0.35) yellowBrownCells += w;
    }
  }

  const darkSpotRatio = darkCells / totalCellWeight;
  const dullYellowBrownRatio = yellowBrownCells / totalCellWeight;

  let variance = 0;
  for (let p = 0; p < n; p++) variance += weights[p] * (luminances[p] - brightness) ** 2;
  variance /= sumWeight;
  const colorUniformity = Math.max(0, 1 - Math.sqrt(variance) * 2.2);

  let gradSum = 0;
  let gradWeight = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const p = y * SIZE + x;
      const w = weights[p];
      if (x < SIZE - 1) {
        gradSum += Math.abs(luminances[p] - luminances[p + 1]) * w;
        gradWeight += w;
      }
      if (y < SIZE - 1) {
        gradSum += Math.abs(luminances[p] - luminances[p + SIZE]) * w;
        gradWeight += w;
      }
    }
  }
  const edgeSharpness = Math.min(1, (gradSum / gradWeight) * 8);

  return {
    brightness,
    saturation,
    darkSpotRatio,
    dullYellowBrownRatio,
    colorUniformity,
    edgeSharpness,
  };
}

async function featuresForFile(file) {
  const { data } = await sharp(file)
    .resize(SIZE, SIZE, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return extractFeatures(data);
}

async function main() {
  if (!existsSync(ROOT)) {
    console.error(`ไม่พบโฟลเดอร์ ${ROOT} — ดู Datasetimage/README.md`);
    process.exit(1);
  }

  const categories = {};
  let totalImages = 0;

  for (const [dirName, grade] of Object.entries(FRESHNESS_DIRS)) {
    for (const species of SPECIES) {
      const dir = path.join(ROOT, dirName, species);
      if (!existsSync(dir)) continue;
      const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
      if (files.length === 0) continue;

      console.log(`กำลังประมวลผล ${species}/${dirName}: ${files.length} รูป...`);
      const sumFeat = Object.fromEntries(FEATURE_KEYS.map((k) => [k, 0]));
      let ok = 0;

      for (const f of files) {
        try {
          const feat = await featuresForFile(path.join(dir, f));
          for (const k of FEATURE_KEYS) sumFeat[k] += feat[k];
          ok++;
        } catch (err) {
          console.warn(`  ข้ามไฟล์ที่อ่านไม่ได้: ${f} (${err.message})`);
        }
      }

      if (ok === 0) continue;
      const mean = Object.fromEntries(FEATURE_KEYS.map((k) => [k, sumFeat[k] / ok]));
      categories[`${species}:${grade}`] = { count: ok, mean };
      totalImages += ok;
    }
  }

  const out = {
    note: "Auto-generated by `npm run calibrate` from real photos in /Datasetimage. Regenerate any time you add more photos.",
    generatedAt: new Date().toISOString(),
    totalImages,
    categories,
  };

  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n", "utf-8");

  if (totalImages === 0) {
    console.log(
      "\nยังไม่พบรูปภาพเลย — ใส่รูปใน Datasetimage/<fresh|not_fresh>/<ชนิด>/ แล้วรันใหม่",
    );
  } else {
    console.log(`\nเสร็จแล้ว: ประมวลผล ${totalImages} รูป, ${Object.keys(categories).length} หมวด`);
    console.log(`บันทึกที่ ${OUT}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
