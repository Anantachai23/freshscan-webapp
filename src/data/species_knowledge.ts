/**
 * FreshScan — ฐานความรู้ชนิดอาหารทะเล (Species Knowledge Base)
 *
 * รวบรวมข้อมูลชนิดปลา/อาหารทะเลที่ระบบรองรับ พร้อมช่วงอุณหภูมิที่แนะนำ
 * ลักษณะเด่นเมื่อสด และแหล่งอ้างอิงจาก dataset สาธารณะ / คู่มือทางประมง
 */

export type SpeciesInfo = {
  id: string;
  type: "fish" | "shrimp" | "shellfish" | "squid";
  nameTh: string;
  nameEn: string;
  scientific: string;
  habitat: string;
  keyIndicators: string[];
  storageTempC: string;
  shelfLifeDays: string;
  peakSeasonTh: string;
  nutrition: string;
};

export const SPECIES: SpeciesInfo[] = [
  {
    id: "seabass",
    type: "fish",
    nameTh: "ปลากะพงขาว",
    nameEn: "Asian Sea Bass",
    scientific: "Lates calcarifer",
    habitat: "น้ำกร่อย/ชายฝั่งไทย",
    keyIndicators: ["ตากลมใส", "เหงือกแดงสด", "เกล็ดแน่นเป็นเงา"],
    storageTempC: "0–2°C",
    shelfLifeDays: "3–5 วันบนน้ำแข็ง",
    peakSeasonTh: "ตลอดปี (ฟาร์ม)",
    nutrition: "โปรตีนสูง · โอเมก้า-3 ปานกลาง",
  },
  {
    id: "mackerel",
    type: "fish",
    nameTh: "ปลาทู",
    nameEn: "Short-bodied Mackerel",
    scientific: "Rastrelliger brachysoma",
    habitat: "อ่าวไทย/อันดามัน",
    keyIndicators: ["ลำตัวเป็นเงาสีเงิน", "เหงือกแดงเข้ม", "เนื้อแน่นเด้ง"],
    storageTempC: "0–2°C",
    shelfLifeDays: "2–3 วันบนน้ำแข็ง",
    peakSeasonTh: "พ.ย.–ก.พ.",
    nutrition: "โอเมก้า-3 สูงมาก · วิตามิน B12",
  },
  {
    id: "tilapia",
    type: "fish",
    nameTh: "ปลานิล",
    nameEn: "Nile Tilapia",
    scientific: "Oreochromis niloticus",
    habitat: "น้ำจืด (ฟาร์ม)",
    keyIndicators: ["ตาไม่ขุ่น", "เมือกใส", "ท้องไม่บวม"],
    storageTempC: "0–4°C",
    shelfLifeDays: "3–4 วันบนน้ำแข็ง",
    peakSeasonTh: "ตลอดปี",
    nutrition: "โปรตีนสูง · ไขมันต่ำ",
  },
  {
    id: "whiteshrimp",
    type: "shrimp",
    nameTh: "กุ้งขาวแวนนาไม",
    nameEn: "Pacific White Shrimp",
    scientific: "Litopenaeus vannamei",
    habitat: "ฟาร์มน้ำกร่อยชายฝั่ง",
    keyIndicators: ["เปลือกใสเป็นเงา", "หัวติดแน่น", "ไม่มีจุดดำที่ข้อต่อ"],
    storageTempC: "0–2°C",
    shelfLifeDays: "2–3 วันบนน้ำแข็ง",
    peakSeasonTh: "ตลอดปี",
    nutrition: "โปรตีนสูง · แอสตาแซนธิน",
  },
  {
    id: "mussel",
    type: "shellfish",
    nameTh: "หอยแมลงภู่",
    nameEn: "Green Mussel",
    scientific: "Perna viridis",
    habitat: "ชายฝั่งอ่าวไทย",
    keyIndicators: ["เปลือกปิดแน่น/ปิดเมื่อแตะ", "น้ำในเปลือกใส", "เนื้อสีส้มสด"],
    storageTempC: "2–5°C",
    shelfLifeDays: "1–2 วันเป็น ๆ",
    peakSeasonTh: "ต.ค.–มี.ค.",
    nutrition: "ธาตุเหล็ก · วิตามิน B12 สูง",
  },
  {
    id: "shortneckclam",
    type: "shellfish",
    nameTh: "หอยลาย",
    nameEn: "Short-neck Clam",
    scientific: "Paphia undulata",
    habitat: "อ่าวไทยตอนบน",
    keyIndicators: ["เปลือกไม่แตก", "ทรายในตัวน้อย", "เปิดปากเมื่อโดนความร้อน"],
    storageTempC: "2–5°C",
    shelfLifeDays: "1–2 วันเป็น ๆ",
    peakSeasonTh: "พ.ย.–เม.ย.",
    nutrition: "โปรตีน · ไอโอดีน",
  },
  {
    id: "squidbanana",
    type: "squid",
    nameTh: "ปลาหมึกกล้วย",
    nameEn: "Indian Squid",
    scientific: "Uroteuthis duvaucelii",
    habitat: "อ่าวไทย/อันดามัน",
    keyIndicators: ["ผิวมีลายจุดสด", "เนื้อขาวใส", "หนวดครบ"],
    storageTempC: "0–2°C",
    shelfLifeDays: "2–3 วันบนน้ำแข็ง",
    peakSeasonTh: "ม.ค.–พ.ค.",
    nutrition: "โปรตีนสูง · ทอรีน",
  },
  {
    id: "cuttlefish",
    type: "squid",
    nameTh: "ปลาหมึกกระดอง",
    nameEn: "Cuttlefish",
    scientific: "Sepia pharaonis",
    habitat: "ชายฝั่งอ่าวไทย",
    keyIndicators: ["ผิวลายทางชัด", "กระดองแข็ง", "ตาดำสนิท"],
    storageTempC: "0–2°C",
    shelfLifeDays: "2–3 วันบนน้ำแข็ง",
    peakSeasonTh: "ธ.ค.–เม.ย.",
    nutrition: "โปรตีนสูง · แคลเซียม",
  },
  {
    id: "grouper",
    type: "fish",
    nameTh: "ปลาเก๋า",
    nameEn: "Grouper",
    scientific: "Epinephelus spp.",
    habitat: "แนวปะการัง/ชายฝั่งหินอันดามัน-อ่าวไทย",
    keyIndicators: ["ตาใสนูน", "เหงือกแดงสด", "ลำตัวมีลายจุดชัดเจน"],
    storageTempC: "0–2°C",
    shelfLifeDays: "3–5 วันบนน้ำแข็ง",
    peakSeasonTh: "ตลอดปี (เลี้ยง/จับ)",
    nutrition: "โปรตีนสูง · ไขมันต่ำ · ซีลีเนียม",
  },
  {
    id: "pomfret",
    type: "fish",
    nameTh: "ปลาจะละเม็ดขาว",
    nameEn: "Silver Pomfret",
    scientific: "Pampus argenteus",
    habitat: "อ่าวไทย/ทะเลอันดามัน",
    keyIndicators: ["ผิวเงินเงาไม่หมองคล้ำ", "ตาใส", "ครีบไม่ฉีกขาด"],
    storageTempC: "0–2°C",
    shelfLifeDays: "2–4 วันบนน้ำแข็ง",
    peakSeasonTh: "ก.ย.–ธ.ค.",
    nutrition: "โอเมก้า-3 สูง · โปรตีนสูง",
  },
  {
    id: "bluecrab",
    type: "shellfish",
    nameTh: "ปูม้า",
    nameEn: "Blue Swimming Crab",
    scientific: "Portunus pelagicus",
    habitat: "ชายฝั่งทรายโคลนทั่วประเทศ",
    keyIndicators: ["ขาและก้ามครบ", "เปลือกแข็งไม่นิ่ม", "ไม่มีกลิ่นแอมโมเนีย"],
    storageTempC: "2–4°C",
    shelfLifeDays: "1–2 วันเป็น ๆ / แช่แข็งได้นานขึ้น",
    peakSeasonTh: "ก.ค.–ก.ย. (ช่วงห้ามจับปูไข่)",
    nutrition: "โปรตีนสูง · สังกะสี",
  },
  {
    id: "oyster",
    type: "shellfish",
    nameTh: "หอยนางรม",
    nameEn: "Oyster",
    scientific: "Crassostrea belcheri",
    habitat: "ปากแม่น้ำ/ฟาร์มชายฝั่งภาคใต้",
    keyIndicators: ["เปลือกปิดสนิทหรือหุบเมื่อสัมผัส", "เนื้อครีมนวลไม่ซีด", "น้ำในเปลือกใส"],
    storageTempC: "2–5°C",
    shelfLifeDays: "1–2 วันเป็น ๆ",
    peakSeasonTh: "ต.ค.–ก.พ.",
    nutrition: "สังกะสีสูงมาก · ธาตุเหล็ก · วิตามิน B12",
  },
];

export type DatasetRef = {
  name: string;
  desc: string;
  url: string;
  usage: string;
};

/**
 * แหล่งข้อมูลสาธารณะที่ใช้อ้างอิงในการออกแบบ taxonomy / cue
 * และเตรียม open dataset ตามเป้าหมาย 2,000+ ภาพในโครงการ
 */
export const DATASET_REFERENCES: DatasetRef[] = [
  {
    name: "Fish Freshness Grading Dataset (Kaggle)",
    desc: "ภาพปลาน้ำเค็มหลายชนิดพร้อมป้ายกำกับ Fresh / Not-Fresh ใช้อ้างอิงเกณฑ์ตา-เหงือก",
    url: "https://www.kaggle.com/datasets",
    usage: "reference cues (eye, gill)",
  },
  {
    name: "Freshwater Fish Disease Aquaculture (Mendeley Data)",
    desc: "ภาพปลาน้ำจืดพร้อม metadata ด้านสุขภาพ ใช้อ้างอิงลักษณะผิวและเมือก",
    url: "https://data.mendeley.com/",
    usage: "reference skin/mucus",
  },
  {
    name: "Shrimp Freshness / Black-Spot Dataset (Roboflow Universe)",
    desc: "ภาพกุ้งขาวและกุ้งกุลาดำ พร้อม bbox จุดดำที่หัว/ข้อต่อ",
    url: "https://universe.roboflow.com/",
    usage: "reference shrimp head/joint",
  },
  {
    name: "Seafood Image Dataset — FAO/INFOFISH Field Guides",
    desc: "คู่มือภาพประกอบเกณฑ์คุณภาพอาหารทะเลจาก FAO เพื่อยืนยันเกรด A/B/C",
    url: "https://www.fao.org/fishery/",
    usage: "taxonomy validation",
  },
  {
    name: "กรมประมง — คู่มือคุณภาพสัตว์น้ำ",
    desc: "เอกสารเกณฑ์ความสดจากกรมประมง กระทรวงเกษตรและสหกรณ์",
    url: "https://www4.fisheries.go.th/",
    usage: "ground truth (TH)",
  },
  {
    name: "In-house Field Collection (28P23W01274)",
    desc: "ภาพถ่ายจากตลาดสด/แพปลาชายฝั่งไทย ที่ทีมงานจัดเก็บและติดป้ายโดยผู้เชี่ยวชาญ",
    url: "#",
    usage: "primary training set",
  },
];
