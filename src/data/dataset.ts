/**
 * ============================================================
 *  FreshScan — Dataset Configuration (Editable)
 * ============================================================
 *
 *  ไฟล์นี้คือ "ฐานข้อมูลหลังบ้าน" สำหรับหน้า /scan
 *  คุณสามารถแก้ไขข้อมูลต่อไปนี้ได้ตามสะดวก เช่น
 *    - เพิ่ม / ลบประเภทสินค้า (ปลาทู, กุ้ง, ปลาหมึก ฯลฯ)
 *    - แก้ค่าคะแนนความสด, confidence, features
 *    - เปลี่ยนคำอธิบาย (reason) ของแต่ละเกรด
 *    - เพิ่มเกรดใหม่ หรือปรับเกณฑ์การให้คะแนน
 *
 *  เมื่อบันทึกไฟล์ หน้า /scan จะอัปเดตอัตโนมัติ
 *  ไม่ต้องแก้ไขโค้ดส่วน UI เลย
 * ============================================================
 */

export type Grade = "A" | "B" | "C";

export type Feature = {
  /** ชื่อคุณลักษณะ เช่น "ตาใส", "เหงือกสีแดง" */
  name: string;
  /** คะแนน 0-100 */
  score: number;
};

export type SeafoodResult = {
  grade: Grade;
  /** ป้ายผลลัพธ์ เช่น "สดมาก" */
  label: string;
  /** ความมั่นใจของโมเดล 0-100 */
  confidence: number;
  /** ลักษณะที่ตรวจพบ (แสดงเป็น cards + กราฟ radar/bar) */
  features: Feature[];
  /** คำอธิบายผลลัพธ์ */
  reason: string;
  /** คะแนนละเอียดสำหรับกราฟแท่ง (Composition) */
  composition: {
    freshness: number; // ความสดโดยรวม
    texture: number;   // ลักษณะเนื้อ
    color: number;     // สีและลักษณะภายนอก
    odor: number;      // กลิ่น
    moisture: number;  // ความชุ่มชื้น
  };
};

/** ประเภทสินค้าที่รองรับ — เพิ่ม/ลบได้ตามต้องการ */
export type ProductType = {
  /** id ใช้สำหรับเลือกใน dropdown */
  id: string;
  /** ชื่อแสดงผล */
  name: string;
  /** ผลลัพธ์ที่เป็นไปได้สำหรับสินค้าชนิดนี้ (random 1 รายการเมื่อสแกน) */
  results: SeafoodResult[];
};

export const PRODUCT_TYPES: ProductType[] = [
  {
    id: "mackerel",
    name: "ปลาทู",
    results: [
      {
        grade: "A",
        label: "สดมาก",
        confidence: 94,
        features: [
          { name: "ตาใส", score: 96 },
          { name: "เหงือกสีแดงสด", score: 92 },
          { name: "ผิวเป็นมันวาว", score: 93 },
          { name: "เนื้อยืดหยุ่น", score: 90 },
        ],
        composition: { freshness: 94, texture: 90, color: 92, odor: 95, moisture: 88 },
        reason:
          "ปลาทูสดใหม่ พบลักษณะของอาหารทะเลคุณภาพดีครบทุกองค์ประกอบ ตาใสไม่ขุ่น เหงือกสีแดงสด เหมาะสำหรับการบริโภคและปรุงอาหารทุกรูปแบบ",
      },
      {
        grade: "B",
        label: "พอใช้ ควรปรุงทันที",
        confidence: 76,
        features: [
          { name: "ตาเริ่มขุ่น", score: 60 },
          { name: "เหงือกซีดลง", score: 58 },
          { name: "ผิวเริ่มหมอง", score: 65 },
          { name: "เนื้อยังแน่น", score: 72 },
        ],
        composition: { freshness: 62, texture: 70, color: 60, odor: 65, moisture: 68 },
        reason: "ปลาทูเริ่มเสื่อมคุณภาพเล็กน้อย ควรนำไปปรุงทันที ไม่แนะนำให้เก็บต่อในตู้เย็น",
      },
    ],
  },
  {
    id: "shrimp",
    name: "กุ้งขาว",
    results: [
      {
        grade: "A",
        label: "สดมาก",
        confidence: 91,
        features: [
          { name: "เปลือกใสมีประกาย", score: 93 },
          { name: "หัวติดแน่นกับลำตัว", score: 94 },
          { name: "เนื้อแน่นยืดหยุ่น", score: 89 },
          { name: "กลิ่นทะเลธรรมชาติ", score: 92 },
        ],
        composition: { freshness: 92, texture: 90, color: 91, odor: 94, moisture: 87 },
        reason: "กุ้งขาวสดมาก เปลือกใส หัวไม่หลุดจากลำตัว เหมาะสำหรับเมนูซาชิมิและปรุงอาหารทุกรูปแบบ",
      },
      {
        grade: "B",
        label: "พอใช้ ควรปรุงทันที",
        confidence: 80,
        features: [
          { name: "เปลือกเริ่มซีด", score: 62 },
          { name: "หัวยังติดแน่น", score: 74 },
          { name: "เนื้อยังแน่น", score: 70 },
          { name: "กลิ่นปกติ", score: 78 },
        ],
        composition: { freshness: 65, texture: 68, color: 60, odor: 72, moisture: 64 },
        reason: "กุ้งเริ่มเสื่อมคุณภาพเล็กน้อย ยังบริโภคได้แต่ควรปรุงสุกทันที",
      },
      {
        grade: "C",
        label: "ไม่แนะนำให้บริโภค",
        confidence: 88,
        features: [
          { name: "เปลือกหมองคล้ำ", score: 22 },
          { name: "หัวหลุดง่าย", score: 18 },
          { name: "เนื้อนิ่มเละ", score: 25 },
          { name: "กลิ่นแอมโมเนีย", score: 15 },
        ],
        composition: { freshness: 18, texture: 22, color: 20, odor: 12, moisture: 30 },
        reason: "กุ้งเสื่อมสภาพชัดเจน ไม่ควรบริโภค มีความเสี่ยงต่อสุขภาพจากแบคทีเรียที่สะสม",
      },
    ],
  },
  {
    id: "tuna",
    name: "ปลาทูน่า",
    results: [
      {
        grade: "A",
        label: "สดมาก",
        confidence: 93,
        features: [
          { name: "เนื้อสีแดงสด", score: 95 },
          { name: "ผิวเรียบเป็นมัน", score: 91 },
          { name: "เนื้อแน่น", score: 92 },
          { name: "ไม่มีกลิ่นคาว", score: 94 },
        ],
        composition: { freshness: 93, texture: 92, color: 95, odor: 94, moisture: 89 },
        reason: "ปลาทูน่าสดมาก เนื้อสีแดงสดเหมือนทับทิม เหมาะสำหรับซาชิมิและสเต๊ก",
      },
      {
        grade: "C",
        label: "ไม่แนะนำให้บริโภค",
        confidence: 86,
        features: [
          { name: "เนื้อสีน้ำตาล", score: 20 },
          { name: "ผิวแห้ง", score: 28 },
          { name: "เนื้อนิ่ม", score: 30 },
          { name: "กลิ่นแรง", score: 22 },
        ],
        composition: { freshness: 22, texture: 28, color: 18, odor: 20, moisture: 35 },
        reason: "ปลาทูน่าออกซิไดซ์และเสื่อมสภาพ ไม่ควรบริโภคดิบ",
      },
    ],
  },
  {
    id: "squid",
    name: "ปลาหมึก",
    results: [
      {
        grade: "A",
        label: "สดมาก",
        confidence: 90,
        features: [
          { name: "ผิวมันวาว", score: 92 },
          { name: "ตาดำใส", score: 90 },
          { name: "เนื้อยืดหยุ่น", score: 88 },
          { name: "หนวดสมบูรณ์", score: 91 },
        ],
        composition: { freshness: 90, texture: 88, color: 92, odor: 89, moisture: 86 },
        reason: "ปลาหมึกสดมาก ผิวเงา ตาดำใส เหมาะกับการย่าง ผัด หรือทำสลัด",
      },
      {
        grade: "B",
        label: "พอใช้ ควรปรุงทันที",
        confidence: 74,
        features: [
          { name: "ผิวเริ่มซีด", score: 60 },
          { name: "ตายังใส", score: 70 },
          { name: "เนื้อยังแน่น", score: 68 },
          { name: "กลิ่นปกติ", score: 72 },
        ],
        composition: { freshness: 65, texture: 70, color: 62, odor: 70, moisture: 64 },
        reason: "ปลาหมึกเริ่มเสื่อม ควรปรุงให้สุกทันที",
      },
    ],
  },
  {
    id: "salmon",
    name: "ปลาแซลมอน",
    results: [
      {
        grade: "A",
        label: "สดมาก",
        confidence: 95,
        features: [
          { name: "เนื้อสีส้มสด", score: 96 },
          { name: "ลายไขมันชัด", score: 94 },
          { name: "เนื้อแน่นยืดหยุ่น", score: 92 },
          { name: "กลิ่นหอมธรรมชาติ", score: 93 },
        ],
        composition: { freshness: 95, texture: 93, color: 96, odor: 94, moisture: 90 },
        reason: "แซลมอนคุณภาพสูง เหมาะกับซาชิมิและซูชิ",
      },
      {
        grade: "B",
        label: "พอใช้ ควรปรุงทันที",
        confidence: 78,
        features: [
          { name: "เนื้อสีจางลง", score: 64 },
          { name: "ลายไขมันยังชัด", score: 72 },
          { name: "เนื้อนิ่มลงเล็กน้อย", score: 65 },
          { name: "กลิ่นเริ่มเปลี่ยน", score: 60 },
        ],
        composition: { freshness: 64, texture: 66, color: 62, odor: 60, moisture: 68 },
        reason: "ควรนำไปปรุงสุก เช่น ย่างหรืออบ ไม่แนะนำให้บริโภคดิบ",
      },
    ],
  },
];

/** สีของแต่ละเกรด สำหรับ UI */
export const GRADE_META: Record<Grade, { label: string; color: string }> = {
  A: { label: "เกรด A — สดมาก", color: "hsl(160 75% 42%)" },
  B: { label: "เกรด B — พอใช้", color: "hsl(38 92% 55%)" },
  C: { label: "เกรด C — ไม่แนะนำ", color: "hsl(0 78% 58%)" },
};
