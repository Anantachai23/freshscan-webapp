/**
 * Real pixel-based feature extraction from an actual seafood photo.
 *
 * This is a transparent, explainable heuristic (NOT a trained neural network).
 * It reads real pixel data from the uploaded image — brightness, color
 * saturation, dark-blotch coverage, dull yellow/brown discoloration, color
 * uniformity, and surface texture sharpness — all of which are genuine,
 * well-known visual proxies used in food-quality inspection:
 *   - Dark blotches / black patches  -> bruising, black gill/head discoloration
 *   - Dull yellow/brown, low-saturation tone -> oxidation, spoilage discoloration
 *   - Low color uniformity (blotchy) -> uneven decay across the surface
 *   - Low edge/texture sharpness -> flat, mushy, decaying flesh vs. crisp scales/shell
 *
 * It intentionally does NOT claim to be a deep-learning model trained on a
 * labeled dataset. If you want the scoring to be calibrated against real
 * reference photos, see `scripts/calibrate.mjs` and `src/data/calibration.json`.
 */

export interface ImageFeatures {
  brightness: number; // 0..1
  saturation: number; // 0..1
  darkSpotRatio: number; // 0..1, blob-based
  dullYellowBrownRatio: number; // 0..1, blob-based
  colorUniformity: number; // 0..1 (1 = very uniform)
  edgeSharpness: number; // 0..1
}

export const FEATURE_KEYS: (keyof ImageFeatures)[] = [
  "brightness",
  "saturation",
  "darkSpotRatio",
  "dullYellowBrownRatio",
  "colorUniformity",
  "edgeSharpness",
];

const SIZE = 160; // sample resolution
const CELLS = 20; // grid for blob detection => 8px cells

/**
 * Core feature extraction from raw RGBA pixel bytes already resized to
 * SIZE x SIZE. Shared by the browser (canvas ImageData) and Node
 * (sharp raw buffer) code paths so both compute identical features.
 */
export function extractFeaturesFromRGBA(data: Uint8ClampedArray | Uint8Array): ImageFeatures {
  const n = SIZE * SIZE;

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  const weightAt = (x: number, y: number) => {
    const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
    return d < 0.55 ? 1 : Math.max(0.25, 1 - (d - 0.55) * 1.6);
  };

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
      cellSat /= count;
      const cellYellowRatio = cellYellowish / count;
      totalCellWeight += w;

      if (cellL < 0.24) darkCells += w;
      if (cellYellowRatio > 0.5 && cellSat < 0.35) yellowBrownCells += w;
    }
  }

  const darkSpotRatio = darkCells / totalCellWeight;
  const dullYellowBrownRatio = yellowBrownCells / totalCellWeight;

  let variance = 0;
  for (let p = 0; p < n; p++) variance += weights[p] * (luminances[p] - brightness) ** 2;
  variance /= sumWeight;
  const stdDev = Math.sqrt(variance);
  const colorUniformity = Math.max(0, 1 - stdDev * 2.2);

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

/** Browser entry point: draws the file onto an offscreen canvas at SIZE x SIZE and extracts features. */
export async function extractImageFeatures(file: File): Promise<ImageFeatures> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    bitmap.close?.();
    throw new Error("Canvas 2D context unavailable");
  }
  ctx.drawImage(bitmap, 0, 0, SIZE, SIZE);
  bitmap.close?.();
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  return extractFeaturesFromRGBA(data);
}

export const IMAGE_FEATURE_SAMPLE_SIZE = SIZE;
