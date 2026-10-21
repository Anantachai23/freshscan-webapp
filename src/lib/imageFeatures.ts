/**
 * Real pixel-based feature extraction and biological validation from a seafood photo.
 *
 * This evaluates real pixel data from the uploaded image — brightness, color
 * saturation, dark-blotch coverage, dull yellow/brown discoloration, color
 * uniformity, surface texture sharpness, and biological marine spectral proxies.
 *
 * It also includes automated non-seafood detection to ensure users upload
 * appropriate seafood images (fish, shrimp, squid, shellfish) rather than
 * unrelated objects, screenshots, documents, or scenery.
 */

export interface ImageFeatures {
  brightness: number; // 0..1
  saturation: number; // 0..1
  darkSpotRatio: number; // 0..1, blob-based
  dullYellowBrownRatio: number; // 0..1, blob-based
  colorUniformity: number; // 0..1 (1 = very uniform)
  edgeSharpness: number; // 0..1
}

export interface SeafoodValidation {
  isValid: boolean;
  errorTitle?: string;
  errorMessage?: string;
  seafoodRatio: number;
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
 * Validates whether the image contains characteristic marine/seafood features
 * (fish scales, gills, shrimp shells, squid mantle, bivalves) rather than
 * documents, vehicles, landscapes, clear skies, or blank monochrome surfaces.
 */
export function validateSeafoodFromRGBA(
  data: Uint8ClampedArray | Uint8Array,
  features: ImageFeatures,
): SeafoodValidation {
  const { brightness, saturation, colorUniformity, edgeSharpness } = features;

  // 1. Extreme Darkness or Overexposure
  if (brightness < 0.05) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ภาพมืดเกินไป ไม่สามารถมองเห็นหรือตรวจสอบอาหารทะเลได้ กรุณาถ่ายภาพในบริเวณที่มีแสงสว่างเพียงพอ",
      seafoodRatio: 0,
    };
  }
  if (brightness > 0.94 && edgeSharpness < 0.12) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ภาพสว่างจ้าเกินไปหรือเป็นเอกสารสีขาว ไม่พบวัตถุอาหารทะเลที่ต้องการตรวจวัด",
      seafoodRatio: 0,
    };
  }

  // 2. Completely flat solid surfaces (wall, monochrome screen, blank paper)
  if (colorUniformity > 0.95 && edgeSharpness < 0.04) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ภาพเป็นพื้นผิวเรียบสีเดียว ไม่พบโครงสร้างทางกายภาพของอาหารทะเล (ปลา, กุ้ง, หมึก, หอย)",
      seafoodRatio: 0,
    };
  }

  let pureWhiteCount = 0;
  let pureGreenCount = 0;
  let pureBlueCount = 0;
  let organicSeafoodCount = 0;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1) || 1);

    // Document / pure white background
    if (r > 0.92 && g > 0.92 && b > 0.92) pureWhiteCount++;
    // Unnatural foliage/forest/neon green
    if (g > r + 0.14 && g > b + 0.14 && sat > 0.38) pureGreenCount++;
    // Unnatural sky or digital interface blue
    if (b > r + 0.22 && b > g + 0.14 && sat > 0.48) pureBlueCount++;

    // Typical seafood tones:
    // - Silvery fish skin / grey / white reflections:
    const isSilverOrGrey = sat < 0.35 && l >= 0.10 && l <= 0.90;
    // - Red/pink fresh gills or dark pink muscle:
    const isRedGillOrFlesh = r > g && r > b && (r - Math.max(g, b)) > 0.07 && sat > 0.14;
    // - Shrimp/crab orange-pink-brown tones:
    const isShrimpTone = r > 0.28 && g > 0.15 && r > b + 0.06;
    // - Squid pearlescent translucent mantle:
    const isSquidTone = l >= 0.40 && l <= 0.92 && sat < 0.28;
    // - Shellfish dark bivalve shells:
    const isDarkShell = l < 0.34;

    if (isSilverOrGrey || isRedGillOrFlesh || isShrimpTone || isSquidTone || isDarkShell) {
      organicSeafoodCount++;
    }
  }

  const whiteRatio = pureWhiteCount / totalPixels;
  const greenRatio = pureGreenCount / totalPixels;
  const blueRatio = pureBlueCount / totalPixels;
  const seafoodRatio = organicSeafoodCount / totalPixels;

  // Document/text screenshot
  if (whiteRatio > 0.68) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ภาพที่อัปโหลดดูคล้ายเอกสารหรือข้อความ โปรดถ่ายภาพอาหารทะเลจริงที่ต้องการประเมิน",
      seafoodRatio,
    };
  }

  // Plant / lawn / foliage
  if (greenRatio > 0.38) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ตรวจพบต้นไม้ พืช หรือทิวทัศน์ธรรมชาติ โปรดถ่ายภาพอาหารทะเลที่ต้องการประเมิน",
      seafoodRatio,
    };
  }

  // Clear blue sky / digital blue graphic
  if (blueRatio > 0.42) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ตรวจพบภาพท้องฟ้าหรือกราฟิกดิจิทัล โปรดถ่ายภาพอาหารทะเลที่ต้องการประเมิน",
      seafoodRatio,
    };
  }

  // Minimum organic seafood tone presence
  if (seafoodRatio < 0.18) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ระบบไม่สามารถตรวจจับคุณลักษณะของอาหารทะเล (ปลา, กุ้ง, หมึก, หอย) ในภาพนี้ได้ กรุณาถ่ายภาพหรืออัปโหลดภาพอาหารทะเลที่ถูกต้อง",
      seafoodRatio,
    };
  }

  return {
    isValid: true,
    seafoodRatio,
  };
}

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

export type ImageInputSource = File | Blob | HTMLImageElement | string;

/** Draws any input source onto an offscreen canvas at SIZE x SIZE and returns RGBA pixel data. */
export async function loadSourceToRGBA(source: ImageInputSource): Promise<Uint8ClampedArray> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  if (typeof source === "string") {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image source"));
      img.src = source;
    });
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
  } else if (source instanceof HTMLImageElement) {
    ctx.drawImage(source, 0, 0, SIZE, SIZE);
  } else if (source instanceof Blob) {
    const bitmap = await createImageBitmap(source);
    ctx.drawImage(bitmap, 0, 0, SIZE, SIZE);
    bitmap.close?.();
  } else {
    throw new Error("Unsupported image input source");
  }

  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  return data;
}

/** Extracts features and runs seafood validation on any image source. */
export async function extractImageFeaturesAndValidation(
  source: ImageInputSource,
): Promise<{ features: ImageFeatures; validation: SeafoodValidation }> {
  const data = await loadSourceToRGBA(source);
  const features = extractFeaturesFromRGBA(data);
  const validation = validateSeafoodFromRGBA(data, features);
  return { features, validation };
}

/** Browser entry point: backward-compatible signature. */
export async function extractImageFeatures(source: ImageInputSource): Promise<ImageFeatures> {
  const { features } = await extractImageFeaturesAndValidation(source);
  return features;
}

export const IMAGE_FEATURE_SAMPLE_SIZE = SIZE;
