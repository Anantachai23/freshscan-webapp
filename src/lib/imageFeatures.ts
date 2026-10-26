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
  // Advanced biological biomarkers for marine freshness:
  gillHemeIndex: number; // 0..1, oxyhemoglobin redness proxy (high = vibrant fresh blood/flesh)
  corneaClarityScore: number; // 0..1, pupil contrast and specular highlight sharpness (high = clear eye)
  skinGlossSheen: number; // 0..1, specular gloss reflections from mucus/scales (high = moist fresh sheen)
  melanosisCoverage: number; // 0..1, localized enzymatic blackspot coverage (high = degraded shrimp/spoilage)
}

export interface SeafoodValidation {
  isValid: boolean;
  errorTitle?: string;
  errorMessage?: string;
  seafoodRatio: number;
  detectedTypeGuess?: "fish" | "shrimp" | "squid" | "shellfish";
  confidenceScore?: number;
}

export const FEATURE_KEYS: (keyof ImageFeatures)[] = [
  "brightness",
  "saturation",
  "darkSpotRatio",
  "dullYellowBrownRatio",
  "colorUniformity",
  "edgeSharpness",
  "gillHemeIndex",
  "corneaClarityScore",
  "skinGlossSheen",
  "melanosisCoverage",
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
  if (brightness < 0.04) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ภาพมืดเกินไป ไม่สามารถมองเห็นหรือตรวจสอบอาหารทะเลได้ กรุณาถ่ายภาพในบริเวณที่มีแสงสว่างเพียงพอ",
      seafoodRatio: 0,
    };
  }
  if (brightness > 0.95 && edgeSharpness < 0.08) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ภาพสว่างจ้าเกินไปหรือเป็นเอกสารสีขาว ไม่พบวัตถุอาหารทะเลที่ต้องการตรวจวัด",
      seafoodRatio: 0,
    };
  }

  // 2. Completely flat solid surfaces (wall, monochrome screen, blank paper)
  if (colorUniformity > 0.96 && edgeSharpness < 0.035) {
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

  // Species-specific spectral accumulators
  let fishScore = 0;
  let shrimpScore = 0;
  let squidScore = 0;
  let shellfishScore = 0;

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
    if (r > 0.93 && g > 0.93 && b > 0.93) pureWhiteCount++;
    // Unnatural foliage/forest/neon green
    if (g > r + 0.16 && g > b + 0.16 && sat > 0.38) pureGreenCount++;
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

    // Accumulate species signatures
    if (isShrimpTone && sat > 0.22) shrimpScore += 1.4;
    if (isSquidTone && l > 0.60 && sat < 0.20) squidScore += 1.3;
    if (isDarkShell && l < 0.25) shellfishScore += 1.2;
    if (isSilverOrGrey && sat < 0.24) fishScore += 1.1;
    if (isRedGillOrFlesh) {
      fishScore += 1.5;
      shrimpScore += 0.8;
    }
  }

  const whiteRatio = pureWhiteCount / totalPixels;
  const greenRatio = pureGreenCount / totalPixels;
  const blueRatio = pureBlueCount / totalPixels;
  const seafoodRatio = organicSeafoodCount / totalPixels;

  // Document/text screenshot: reject if mostly white and lacks seafood presence
  if (whiteRatio > 0.84 || (whiteRatio > 0.68 && seafoodRatio < 0.12)) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ภาพที่อัปโหลดดูคล้ายเอกสารหรือข้อความ โปรดถ่ายภาพอาหารทะเลจริงที่ต้องการประเมิน",
      seafoodRatio,
    };
  }

  // Plant / lawn / foliage
  if (greenRatio > 0.38 && seafoodRatio < 0.18) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ตรวจพบต้นไม้ พืช หรือทิวทัศน์ธรรมชาติ โปรดถ่ายภาพอาหารทะเลที่ต้องการประเมิน",
      seafoodRatio,
    };
  }

  // Clear blue sky / digital blue graphic
  if (blueRatio > 0.42 && seafoodRatio < 0.18) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ตรวจพบภาพท้องฟ้าหรือกราฟิกดิจิทัล โปรดถ่ายภาพอาหารทะเลที่ต้องการประเมิน",
      seafoodRatio,
    };
  }

  // Minimum organic seafood tone presence
  if (seafoodRatio < 0.14) {
    return {
      isValid: false,
      errorTitle: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
      errorMessage: "ระบบไม่สามารถตรวจจับคุณลักษณะของอาหารทะเล (ปลา, กุ้ง, หมึก, หอย) ในภาพนี้ได้ กรุณาถ่ายภาพหรืออัปโหลดภาพอาหารทะเลที่ถูกต้อง",
      seafoodRatio,
    };
  }

  // Determine most likely seafood species group
  const scores = [
    { type: "fish" as const, score: fishScore },
    { type: "shrimp" as const, score: shrimpScore },
    { type: "squid" as const, score: squidScore },
    { type: "shellfish" as const, score: shellfishScore },
  ].sort((a, b) => b.score - a.score);

  const topSpecies = scores[0];
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0) || 1;
  const confidenceScore = Math.min(0.98, Math.max(0.65, topSpecies.score / totalScore));

  return {
    isValid: true,
    seafoodRatio,
    detectedTypeGuess: topSpecies.type,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
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
  let corneaGlints = 0;
  let specularGlints = 0;
  let freshHemePixels = 0;
  let oxidizedBrownPixels = 0;
  let melanosisClusterWeight = 0;

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const p = y * SIZE + x;
      const w = weights[p];
      const i = p * 4;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const l = luminances[p];

      // Biological Biomarker: Oxyhemoglobin (fresh red/pink) vs Metmyoglobin (oxidized brown)
      if (r > 0.35 && r > g + 0.08 && r > b + 0.08) {
        freshHemePixels += w;
      } else if (r > 0.26 && g > 0.18 && r > b + 0.04 && l < 0.45) {
        oxidizedBrownPixels += w;
      }

      // Specular sheen / moisture glint (smooth scales / moist cuticle reflection)
      if (l > 0.82 && r > 0.75 && g > 0.75 && b > 0.75) {
        specularGlints += w;
      }

      if (x < SIZE - 1) {
        const diffX = Math.abs(luminances[p] - luminances[p + 1]);
        gradSum += diffX * w;
        gradWeight += w;

        // Cornea / Pupil contrast edge (black pupil next to bright corneal specular reflection)
        if (
          (luminances[p] < 0.22 && luminances[p + 1] > 0.65) ||
          (luminances[p] > 0.65 && luminances[p + 1] < 0.22)
        ) {
          corneaGlints += w;
        }

        // Melanosis sharp dark boundary
        if (
          (luminances[p] < 0.16 && luminances[p + 1] > 0.42) ||
          (luminances[p] > 0.42 && luminances[p + 1] < 0.16)
        ) {
          melanosisClusterWeight += w;
        }
      }
      if (y < SIZE - 1) {
        const diffY = Math.abs(luminances[p] - luminances[p + SIZE]);
        gradSum += diffY * w;
        gradWeight += w;
      }
    }
  }

  const edgeSharpness = Math.min(1, (gradSum / gradWeight) * 8);

  // Normalized Biomarkers
  const totalHeme = freshHemePixels + oxidizedBrownPixels;
  const gillHemeIndex = totalHeme > 15 ? Math.min(1, (freshHemePixels / totalHeme) * 1.35) : 0.65;
  const corneaClarityScore = Math.min(1, (corneaGlints / (sumWeight * 0.035)) * 1.2);
  const skinGlossSheen = Math.min(1, (specularGlints / (sumWeight * 0.04)) * 1.1);
  const melanosisCoverage = Math.min(1, (melanosisClusterWeight / (sumWeight * 0.05)) * 1.4);

  return {
    brightness,
    saturation,
    darkSpotRatio,
    dullYellowBrownRatio,
    colorUniformity,
    edgeSharpness,
    gillHemeIndex: Math.round(gillHemeIndex * 100) / 100,
    corneaClarityScore: Math.round(corneaClarityScore * 100) / 100,
    skinGlossSheen: Math.round(skinGlossSheen * 100) / 100,
    melanosisCoverage: Math.round(melanosisCoverage * 100) / 100,
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
