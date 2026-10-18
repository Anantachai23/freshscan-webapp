/**
 * บีบอัด/ย่อขนาดภาพฝั่ง client ก่อนส่งให้ AI วิเคราะห์
 * - ย่อด้านที่ยาวที่สุดให้ไม่เกิน maxDimension (px)
 * - บีบคุณภาพ JPEG ลงจนกว่าไฟล์จะมีขนาด ≤ maxBytes (ถ้ายังใหญ่อยู่)
 * - คงอัตราส่วนภาพเดิมเสมอ เพื่อไม่ให้ตัดส่วนสำคัญของภาพ (ตา/เหงือก/เปลือก) หายไป
 */

export const MAX_IMAGE_DIMENSION = 1600; // px ด้านที่ยาวที่สุด
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB
export const TARGET_JPEG_QUALITY = 0.86;

export interface ResizeOutcome {
  file: File;
  dataUrl: string;
  wasResized: boolean;
  originalSize: number;
  finalSize: number;
  originalDimensions: { width: number; height: number };
  finalDimensions: { width: number; height: number };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("แปลงภาพไม่สำเร็จ"))),
      "image/jpeg",
      quality,
    );
  });
}

/**
 * ย่อ/บีบอัดภาพให้พอดีสำหรับส่งเข้าโมเดล AI:
 * - ถ้าภาพเล็กกว่าเกณฑ์อยู่แล้ว จะคืนไฟล์เดิมโดยไม่แตะต้อง
 * - ถ้าภาพใหญ่กว่ากำหนด จะ resize ผ่าน canvas แล้ว re-encode เป็น JPEG คุณภาพสูง
 *   เพื่อให้ AI เห็นภาพรวมทั้งภาพ (ตา/เหงือก/เปลือก/เนื้อ) ได้ครบโดยไม่เสียรายละเอียดสำคัญ
 */
export async function prepareImageForAnalysis(file: File): Promise<ResizeOutcome> {
  const originalDataUrl = await readAsDataUrl(file);
  const img = await loadImage(originalDataUrl);
  const originalDimensions = { width: img.naturalWidth, height: img.naturalHeight };

  const longestSide = Math.max(img.naturalWidth, img.naturalHeight);
  const needsResize = longestSide > MAX_IMAGE_DIMENSION || file.size > MAX_IMAGE_BYTES;

  if (!needsResize) {
    return {
      file,
      dataUrl: originalDataUrl,
      wasResized: false,
      originalSize: file.size,
      finalSize: file.size,
      originalDimensions,
      finalDimensions: originalDimensions,
    };
  }

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / longestSide);
  const targetWidth = Math.round(img.naturalWidth * scale);
  const targetHeight = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("ไม่สามารถประมวลผลภาพในเบราว์เซอร์นี้ได้");
  // วาดภาพทั้งใบลงบน canvas ใหม่ (ไม่ครอป) เพื่อให้ AI เห็นทุกส่วนของภาพครบถ้วน
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // ลดคุณภาพ JPEG ลงทีละขั้นจนกว่าจะได้ไฟล์ขนาดไม่เกิน MAX_IMAGE_BYTES
  let quality = TARGET_JPEG_QUALITY;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > MAX_IMAGE_BYTES && quality > 0.4) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }

  const resizedFile = new File([blob], file.name.replace(/\.\w+$/, "") + "-optimized.jpg", {
    type: "image/jpeg",
  });
  const dataUrl = await readAsDataUrl(resizedFile);

  return {
    file: resizedFile,
    dataUrl,
    wasResized: true,
    originalSize: file.size,
    finalSize: resizedFile.size,
    originalDimensions,
    finalDimensions: { width: targetWidth, height: targetHeight },
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
