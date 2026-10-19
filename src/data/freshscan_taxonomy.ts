/**
 * FreshScan Marine™ — Scientific Quality Index Method (QIM) Taxonomy
 * 
 * Based on:
 * - FAO Fisheries Technical Paper No. 348 (Quality and quality changes in fresh fish)
 * - European QIM Foundation (Quality Index Method for marine species)
 * - Thai Agricultural Standards: TAS 7001-2550 (Fresh Fish), TAS 7002-2550 (Fresh Shrimp)
 * - Codex Alimentarius Standards for Fresh Seafood (CODEX STAN 165, 190, 311)
 */

export type SeafoodTypeId = "fish" | "shrimp" | "shellfish" | "squid";
export type FreshnessGrade = "A" | "B" | "C" | "D";

export interface FreshnessGradeInfo {
  id: FreshnessGrade;
  code: string;
  labelTh: string;
  labelEn: string;
  scoreRange: [number, number];
  qimDemeritRange: [number, number]; // out of 20
  actionTh: string;
  actionEn: string;
  riskTh: string;
  riskEn: string;
  culinaryUseTh: string;
  storageRecommendationTh: string;
  colorHex: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const FRESHNESS_GRADES: readonly FreshnessGradeInfo[] = [
  {
    id: "A",
    code: "GRADE_A",
    labelTh: "สดระดับพรีเมียม (Premium Fresh)",
    labelEn: "Extra / Premium Fresh",
    scoreRange: [85, 100],
    qimDemeritRange: [0, 4],
    actionTh: "ความสดสมบูรณ์แบบ เหมาะสำหรับบริโภคสด (Sashimi grade) นึ่ง ต้ม หรือปรุงอาหารทุกประเภท",
    actionEn: "Optimal freshness. Suitable for sashimi, raw consumption, or delicate culinary preparation.",
    riskTh: "ปลอดภัยสูงสุด (Histamine & Pathogen Risk: Minimal)",
    riskEn: "Minimal risk",
    culinaryUseTh: "ซาชิมิ, นึ่งมะนาว, ปลาดิบ, ลวกจิ้ม, ซูชิ",
    storageRecommendationTh: "เก็บรักษาบนน้ำแข็งบดละเอียดที่อุณหภูมิ 0°C ถึง 2°C บริโภคภายใน 48-72 ชั่วโมง",
    colorHex: "#0ea5e9",
    badgeBg: "bg-sky-500/10 text-sky-400",
    badgeBorder: "border-sky-500/30",
    badgeText: "text-sky-400",
  },
  {
    id: "B",
    code: "GRADE_B",
    labelTh: "สดดีตามเกณฑ์ (Good Quality)",
    labelEn: "Good / Standard Quality",
    scoreRange: [65, 84],
    qimDemeritRange: [5, 9],
    actionTh: "วัตถุดิบคุณภาพดี เนื้อแน่น เหมาะสำหรับปรุงสุกด้วยความร้อน เช่น ทอด ต้มยำ ผัดฉ่า ย่าง",
    actionEn: "Good freshness. High quality for standard cooked culinary dishes.",
    riskTh: "ความเสี่ยงต่ำเมื่อปรุงสุกทั่วถึง (Low Risk)",
    riskEn: "Low risk (cook thoroughly)",
    culinaryUseTh: "ทอดน้ำปลา, ต้มยำ, ผัดพริกไทยดำ, นึ่งซีอิ๊ว, ย่างถ่าน",
    storageRecommendationTh: "เก็บในช่องแช่เย็น (Chiller) อุณหภูมิไม่เกิน 4°C ปรุงสุกภายใน 24-36 ชั่วโมง",
    colorHex: "#10b981",
    badgeBg: "bg-emerald-500/10 text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
  },
  {
    id: "C",
    code: "GRADE_C",
    labelTh: "เริ่มเสื่อมสภาพ (Acceptable / Marginal)",
    labelEn: "Marginal / Commercial Limit",
    scoreRange: [40, 64],
    qimDemeritRange: [10, 14],
    actionTh: "คุณภาพอยู่ในเกณฑ์เริ่มลดลง ต้องล้างด้วยน้ำเกลือสะอาดและปรุงสุกด้วยความร้อนสูงทันที ไม่ควรเก็บข้ามวัน",
    actionEn: "Marginal freshness near retail shelf-life limit. Must be cooked thoroughly immediately.",
    riskTh: "ความเสี่ยงปานกลาง (Medium Risk - ห้ามบริโภคดิบเด็ดขาด)",
    riskEn: "Medium risk (do not eat raw)",
    culinaryUseTh: "แกงเผ็ด, ทอดกรอบจัด, ผัดเผ็ดเครื่องแกงเข้มข้น (ปรุงผ่านความร้อน 100°C+)",
    storageRecommendationTh: "ต้องปรุงอาหารทันที ไม่แนะนำให้เก็บรักษาต่อในตู้เย็น",
    colorHex: "#f59e0b",
    badgeBg: "bg-amber-500/10 text-amber-400",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
  },
  {
    id: "D",
    code: "GRADE_D",
    labelTh: "เสื่อมคุณภาพ ไม่ปลอดภัย (Spoiled / Reject)",
    labelEn: "Spoiled / Unfit for Consumption",
    scoreRange: [0, 39],
    qimDemeritRange: [15, 20],
    actionTh: "พบสัญญาณการย่อยสลายของจุลินทรีย์และการสะสมของสารชีวภาพอันตราย (Histamine/Amine) ห้ามรับประทาน",
    actionEn: "Spoilage indicators detected. High bacterial activity. Unfit for human consumption.",
    riskTh: "อันตรายสูง (High Risk - เสี่ยงอาหารเป็นพิษรุนแรง)",
    riskEn: "High food safety hazard",
    culinaryUseTh: "ไม่ควรนำมาปรุงอาหารทุกกรณี แนะนำให้คัดทิ้ง",
    storageRecommendationTh: "คัดแยกทิ้งทันที เพื่อป้องกันการปนเปื้อนข้ามไปยังวัตถุดิบอื่น",
    colorHex: "#f43f5e",
    badgeBg: "bg-rose-500/10 text-rose-400",
    badgeBorder: "border-rose-500/30",
    badgeText: "text-rose-400",
  },
];

export interface QimCriterionLevel {
  demeritMin: number;
  demeritMax: number;
  labelTh: string;
  descTh: string;
}

export interface QimCriterion {
  id: string;
  labelTh: string;
  labelEn: string;
  maxDemerit: number;
  weight: number; // importance weight (0..1)
  anatomicalRegion: string;
  biomarker: string;
  levels: QimCriterionLevel[];
}

export interface SeafoodTypeDefinition {
  id: SeafoodTypeId;
  labelTh: string;
  labelEn: string;
  scientificFamily: string;
  standardDoc: string;
  iconName: string;
  supportedSpecies: {
    commonTh: string;
    commonEn: string;
    scientific: string;
    habitat: string;
  }[];
  qimCriteria: QimCriterion[];
  criticalSafetyThresholds: {
    metric: string;
    limitValue: number;
    hazardDescription: string;
  }[];
}

export const SEAFOOD_TYPES: readonly SeafoodTypeDefinition[] = [
  {
    id: "fish",
    labelTh: "ปลาทะเลและปลาน้ำจืด",
    labelEn: "Fin Fish",
    scientificFamily: "Teleostei / Perciformes",
    standardDoc: "TAS 7001-2550 & FAO TP 348",
    iconName: "Fish",
    supportedSpecies: [
      { commonTh: "ปลากะพงขาว", commonEn: "Barramundi / Asian Seabass", scientific: "Lates calcarifer", habitat: "กร่อย/ทะเล" },
      { commonTh: "ปลาทู / ปลาลัง", commonEn: "Short Mackerel", scientific: "Rastrelliger brachysoma", habitat: "อ่าวไทย/อันดามัน" },
      { commonTh: "ปลาเก๋า", commonEn: "Grouper", scientific: "Epinephelus coioides", habitat: "แนวปะการัง" },
      { commonTh: "ปลาจะละเม็ดขาว", commonEn: "Silver Pomfret", scientific: "Pampus argenteus", habitat: "ทะเลเปิด" },
      { commonTh: "ปลานิล", commonEn: "Nile Tilapia", scientific: "Oreochromis niloticus", habitat: "น้ำจืด" },
    ],
    qimCriteria: [
      {
        id: "cornea_pupil",
        labelTh: "ความใสของดวงตาและกระจกตา",
        labelEn: "Cornea & Pupil Clarity",
        maxDemerit: 5,
        weight: 0.28,
        anatomicalRegion: "eye",
        biomarker: "Corneal hydration & intraocular lens protein degradation",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "กระจกตาใสแจ๋ว นูนเต่ง", descTh: "ตานูนเด่น รูม่านตาดำสนิทเป็นประกาย กระจกตาใสโปร่งแสง ไม่พบฝ้าขุ่นหรือรอยบุบ" },
          { demeritMin: 2, demeritMax: 3, labelTh: "กระจกตาเริ่มมีฝ้าบาง", descTh: "ดวงตาเริ่มแบนราบ ขอบตามีฝ้าสีเทาจาง รูม่านตาสีดำหม่นลงเล็กน้อย" },
          { demeritMin: 4, demeritMax: 5, labelTh: "ตาขุ่นมัว หรือยุบตัวลึก", descTh: "กระจกตาขุ่นขาวทึบแสง เบ้าตายุบตัวบุ๋ม หรือมีรอยตกเลือดสีคล้ำในดวงตา" },
        ],
      },
      {
        id: "gill_erythema",
        labelTh: "สีเหงือกและความสะอาดของเมือก",
        labelEn: "Gill Color & Mucus Translucency",
        maxDemerit: 6,
        weight: 0.32,
        anatomicalRegion: "gill",
        biomarker: "Oxyhemoglobin to methemoglobin conversion & microbial slime clotting",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "สีแดงสดเหมือนเลือดใหม่", descTh: "ซี่เหงือกเรียงตัวสวย สีแดงสดประกายชมพู เมือกใสบาง ไม่มีกลิ่นคาวผิดปกติ" },
          { demeritMin: 2, demeritMax: 4, labelTh: "สีแดงคล้ำหรือชมพูซีด", descTh: "เหงือกเริ่มเปลี่ยนเป็นสีแดงอมน้ำตาล เมือกเริ่มขุ่นเล็กน้อย แต่ยังไม่จับตัวเป็นก้อน" },
          { demeritMin: 5, demeritMax: 6, labelTh: "สีน้ำตาลเทาซีด เมือกขุ่นข้น", descTh: "เหงือกซีดขาวอมเทาหรือเหลืองคล้ำ เมือกขุ่นจับตัวเป็นคราบหนา มีกลิ่นแอมโมเนีย" },
        ],
      },
      {
        id: "skin_luster",
        labelTh: "ความแวววาวของเกล็ดและเมือกเคลือบผิว",
        labelEn: "Skin Luster & Mucus Integrity",
        maxDemerit: 4,
        weight: 0.20,
        anatomicalRegion: "skin",
        biomarker: "Guanine crystal iridescence & epidermal mucus transparency",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "ประกายสีรุ้ง เงางามสดใส", descTh: "เกล็ดเรียบแน่นติดหนัง แวววาวสะท้อนแสง เมือกใสปกคลุมสม่ำเสมอ" },
          { demeritMin: 2, demeritMax: 3, labelTh: "ความเงาลดลง เกล็ดหลุดง่าย", descTh: "สีผิวเริ่มด้าน สีคล้ำลงเล็กน้อย เกล็ดเริ่มหลุดลอกเมื่อสัมผัส" },
          { demeritMin: 4, demeritMax: 4, labelTh: "ผิวด้าน เมือกเหลืองเหนียว", descTh: "ผิวซีดไร้ประกาย เมือกเคลือบสีเหลืองขุ่นหรือเป็นเมือกเหนียว เกล็ดหลุดร่วงง่ายมาก" },
        ],
      },
      {
        id: "flesh_elasticity",
        labelTh: "ความแน่นและคืนตัวของเนื้อกล้ามเนื้อ",
        labelEn: "Flesh Firmness & Belly Cavity",
        maxDemerit: 5,
        weight: 0.20,
        anatomicalRegion: "flesh",
        biomarker: "Myofibrillar actin-myosin autolysis & belly wall enzymatic integrity",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "แน่นสปริง คืนตัวทันที", descTh: "กล้ามเนื้อแข็งแน่น ยืดหยุ่นดีเยี่ยม ช่องท้องไม่แตก แน่นตึง" },
          { demeritMin: 2, demeritMax: 3, labelTh: "เริ่มนิ่ม คืนตัวช้า", descTh: "กล้ามเนื้อนิ่มลงเล็กน้อย เมื่อใช้นิ้วกดจะคืนตัวอย่างช้า ๆ ช่องท้องเริ่มอ่อนตัว" },
          { demeritMin: 4, demeritMax: 5, labelTh: "เนื้อเละ บุ๋มค้าง ท้องแตก", descTh: "เนื้อเละยุ่ย ยุบตัวบุ๋มไม่คืนตัว ผนังช่องท้องแตก อวัยวะภายในทะลักออก" },
        ],
      },
    ],
    criticalSafetyThresholds: [
      { metric: "gill_erythema", limitValue: 5, hazardDescription: "พบการสลายตัวของฮีโมโกลบินรุนแรง เสี่ยงการสะสมสารฮิสตามีน (Scombroid poisoning)" },
      { metric: "flesh_elasticity", limitValue: 4, hazardDescription: "เกิดการย่อยสลายของเนื้อเยื่อจากเอนไซม์และแบคทีเรียสูง เสี่ยงต่อการติดเชื้อทางเดินอาหาร" },
    ],
  },
  {
    id: "shrimp",
    labelTh: "กุ้งสดและกุ้งทะเล",
    labelEn: "Shrimp & Prawns",
    scientificFamily: "Penaeidae",
    standardDoc: "TAS 7002-2550",
    iconName: "Shrimp",
    supportedSpecies: [
      { commonTh: "กุ้งขาวแวนนาไม", commonEn: "Pacific White Shrimp", scientific: "Litopenaeus vannamei", habitat: "ฟาร์มเพาะเลี้ยง" },
      { commonTh: "กุ้งกุลาดำ", commonEn: "Black Tiger Shrimp", scientific: "Penaeus monodon", habitat: "ทะเล/กร่อย" },
      { commonTh: "กุ้งแม่น้ำ / ก้ามกราม", commonEn: "Giant Freshwater Prawn", scientific: "Macrobrachium rosenbergii", habitat: "น้ำจืด" },
      { commonTh: "กุ้งแชบ๊วย", commonEn: "Banana Prawn", scientific: "Fenneropenaeus merguiensis", habitat: "ทะเลธรรมชาติ" },
    ],
    qimCriteria: [
      {
        id: "melanosis_index",
        labelTh: "ดัชนีการเกิดจุดดำ (Melanosis Index)",
        labelEn: "Black Spot / Melanosis Coverage",
        maxDemerit: 7,
        weight: 0.35,
        anatomicalRegion: "joints",
        biomarker: "Polyphenol oxidase (PPO) enzymatic blackening on cuticle and pleopods",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "ไม่มีจุดดำเลย เปลือกใสบริสุทธิ์", descTh: "ไม่มีรอยจุดดำ (Black spots) ที่หัว รอยต่อปล้อง หรือระยางค์ว่ายน้ำ" },
          { demeritMin: 2, demeritMax: 4, labelTh: "พบจุดดำประปรายบริเวณขา", descTh: "เริ่มพบจุดดำเล็ก ๆ กระจายบริเวณขาเดินหรือขอบปลายเปลือก แต่ลำตัวยังใส" },
          { demeritMin: 5, demeritMax: 7, labelTh: "จุดดำลุกลามทั่วตัว เปลือกดำคล้ำ", descTh: "รอยดำลามทั่วหัว ข้อปล้อง และหาง สีเปลือกเปลี่ยนเป็นสีคล้ำหรือส้มอมชมพูผิดปกติ" },
        ],
      },
      {
        id: "head_adhesion",
        labelTh: "ความแน่นหนาของการยึดเกาะหัวกุ้ง",
        labelEn: "Cephalothorax Adhesion",
        maxDemerit: 5,
        weight: 0.25,
        anatomicalRegion: "head",
        biomarker: "Hepatopancreatic enzyme autolysis & neck tissue detachment",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "หัวติดแน่นกับลำตัว", descTh: "รอยต่อระหว่างส่วนหัวและลำตัวติดสนิท ไม่โยกคลอน ไม่พบเมือกหรือน้ำเยิ้มสีดำ" },
          { demeritMin: 2, demeritMax: 3, labelTh: "หัวเริ่มหลวม แต่ยังไม่หลุด", descTh: "รอยต่อเริ่มมีช่องว่างเล็กน้อย โยกได้เล็กน้อย ไม่พบน้ำเยิ้มผิดปกติ" },
          { demeritMin: 4, demeritMax: 5, labelTh: "หัวหลุด คอหัก มีน้ำสีดำเยิ้ม", descTh: "หัวกุ้งเกือบหลุดหรือหลุดออกจากลำตัว พบของเหลวสีดำหรือสีส้มคล้ำไหลเยิ้ม" },
        ],
      },
      {
        id: "shell_translucency",
        labelTh: "ความโปร่งแสงและเงางามของเปลือก",
        labelEn: "Cuticle Translucency & Gloss",
        maxDemerit: 4,
        weight: 0.20,
        anatomicalRegion: "shell",
        biomarker: "Chitin layer hydration and astaxanthin oxidation",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "เปลือกใสแวววาว สีธรรมชาติ", descTh: "เปลือกกุ้งโปร่งแสง มันวาว สีเทาฟ้าหรือลายดำชัดเจนตามธรรมชาติ" },
          { demeritMin: 2, demeritMax: 3, labelTh: "เปลือกเริ่มทึบแสง ด้านลง", descTh: "ความโปร่งแสงลดลง เปลือกเริ่มมีสีขาวขุ่นหรือชมพูจาง ๆ" },
          { demeritMin: 4, demeritMax: 4, labelTh: "เปลือกขุ่นส้มแดง ยวบยาบ", descTh: "เปลือกเปลี่ยนเป็นสีแดงส้มเหมือนต้มสุก เปลือกนิ่มยวบแยกตัวออกจากเนื้อ" },
        ],
      },
      {
        id: "meat_firmness",
        labelTh: "ความแน่นและเหนียวสปริงของเนื้อกุ้ง",
        labelEn: "Muscle Texture & Tail Flexion",
        maxDemerit: 4,
        weight: 0.20,
        anatomicalRegion: "flesh",
        biomarker: "Proteolysis of shrimp tail muscle fibres",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "ตัวงอเป็นรูปเกือกม้า เนื้อแน่นเด้ง", descTh: "ลำตัวโค้งงออย่างธรรมชาติ เนื้อแน่น สปริงตัวคืนรูปได้ดีเมื่อสัมผัส" },
          { demeritMin: 2, demeritMax: 3, labelTh: "ลำตัวตรง เนื้อนิ่มลงเล็กน้อย", descTh: "ลำตัวเริ่มตรง ไม่โค้งงอ เนื้อนิ่มลง แต่ยังคงทรงรูปได้" },
          { demeritMin: 4, demeritMax: 4, labelTh: "เนื้อเละ ยวบ ลื่นมือ หลุดร่อน", descTh: "เนื้อกุ้งเละเหลว หลุดร่อนออกจากเปลือก จับแล้วลื่นมือ มีกลิ่นแอมโมเนียฉุน" },
        ],
      },
    ],
    criticalSafetyThresholds: [
      { metric: "head_adhesion", limitValue: 4, hazardDescription: "เอนไซม์จากตับและตับอ่อนย่อยสลายเนื้อกุ้ง เชื้อแบคทีเรีย Vibrio parahaemolyticus เจริญเติบโตรวดเร็ว" },
      { metric: "melanosis_index", limitValue: 6, hazardDescription: "เกิดกระบวนการออกซิเดชันและย่อยสลายระดับสูง ไม่ปลอดภัยสำหรับการบริโภค" },
    ],
  },
  {
    id: "squid",
    labelTh: "หมึกกล้วย หมึกหอม และหมึกสาย",
    labelEn: "Squid & Cuttlefish",
    scientificFamily: "Cephalopoda / Loliginidae",
    standardDoc: "TAS 7004-2550",
    iconName: "Squid",
    supportedSpecies: [
      { commonTh: "หมึกกล้วย", commonEn: "Splendid Squid", scientific: "Uroteuthis duvaucelii", habitat: "อ่าวไทย" },
      { commonTh: "หมึกหอม", commonEn: "Broadclub Cuttlefish / Bigfin Reef", scientific: "Sepioteuthis lessoniana", habitat: "ชายฝั่ง/แนวหิน" },
      { commonTh: "หมึกกระดอง", commonEn: "Pharaoh Cuttlefish", scientific: "Sepia pharaonis", habitat: "ทะเลลึก" },
      { commonTh: "หมึกสาย / หมึกยักษ์", commonEn: "Common Octopus", scientific: "Octopus vulgaris", habitat: "พื้นทะเล" },
    ],
    qimCriteria: [
      {
        id: "chromatophore_clarity",
        labelTh: "ความคมชัดของจุดสีโครมาโตฟอร์ (Chromatophores)",
        labelEn: "Chromatophore Granule Definition",
        maxDemerit: 7,
        weight: 0.35,
        anatomicalRegion: "mantle_skin",
        biomarker: "Dermal chromatophore cyto-architecture & pigment dispersion",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "จุดสีน้ำตาลอมม่วง คมชัดเด่นชัด", descTh: "เม็ดสีโครมาโตฟอร์เรียงเป็นจุดถี่ละเอียด คมชัด ตัดกับพื้นผิวลำตัวสีขาวใสเป็นประกาย" },
          { demeritMin: 2, demeritMax: 4, labelTh: "จุดสีเริ่มละลาย กลายเป็นปื้นม่วง", descTh: "จุดสีเริ่มแตกกระจาย ลำตัวเริ่มกลายเป็นสีชมพูเรื่อ ๆ จุดสีเบลอกลืนเข้าด้วยกัน" },
          { demeritMin: 5, demeritMax: 7, labelTh: "ผิวซีดขาวด้าน หรือแดงส้มช้ำ", descTh: "จุดสีสลายตัวหมด ผิวซีดด่าง หรือเปลี่ยนเป็นสีแดงคล้ำช้ำ มีเมือกเหนียวเคลือบหนา" },
        ],
      },
      {
        id: "mantle_firmness",
        labelTh: "ความตึงแน่นและความยืดหยุ่นของลำตัว",
        labelEn: "Mantle Turgor & Elasticity",
        maxDemerit: 5,
        weight: 0.25,
        anatomicalRegion: "mantle",
        biomarker: "Mantle muscular collagen degradation and water-holding capacity loss",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "ลำตัวกลมทรงกระบอก แน่นเด้ง", descTh: "ลำตัวกลมเต่ง แน่นหนา ไม่แบนแฟบ เมื่อกดจะเด้งสู้มือทันที" },
          { demeritMin: 2, demeritMax: 3, labelTh: "ลำตัวเริ่มแบน อ่อนตัวลง", descTh: "ลำตัวเริ่มยุบตัวแบนเล็กน้อย ความยืดหยุ่นลดลง แต่เนื้อยังไม่เละ" },
          { demeritMin: 4, demeritMax: 5, labelTh: "ลำตัวแบนแฟบ ย้วยเละ ฉีกขาดง่าย", descTh: "ลำตัวแบนราบ ย้วยเหลว ปริแตกง่าย เนื้อสูญเสียความกระชับอย่างสิ้นเชิง" },
        ],
      },
      {
        id: "skin_adhesion",
        labelTh: "การยึดติดของหนังชั้นนอกกับตัวหมึก",
        labelEn: "Epidermal Skin Adhesion",
        maxDemerit: 4,
        weight: 0.20,
        anatomicalRegion: "skin",
        biomarker: "Basement membrane collagenase autolysis",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "หนังเรียบเนียน ยึดติดแน่นสนิท", descTh: "หนังชั้นนอกเคลือบติดลำตัวสนิท ไม่มีรอยถลอกหรือลอกล่อน" },
          { demeritMin: 2, demeritMax: 3, labelTh: "หนังเริ่มถลอกบริเวณปลายครีบ", descTh: "ขอบครีบหรือปลายลำตัวเริ่มมีรอยลอกบาง ๆ แต่ส่วนใหญ่ยังคงอยู่" },
          { demeritMin: 4, demeritMax: 4, labelTh: "หนังลอกร่อนออกเป็นแผ่น หลุดง่าย", descTh: "หนังหลุดร่อนออกจากลำตัวเกือบหมด จับแล้วลื่นหลุดคามือ ผิวเนื้อข้างใต้เปื่อยยุ่ย" },
        ],
      },
      {
        id: "eye_tentacle_integrity",
        labelTh: "ความใสของตาและความสมบูรณ์ของหนวด",
        labelEn: "Eye Cornea & Tentacle Suction",
        maxDemerit: 4,
        weight: 0.20,
        anatomicalRegion: "head",
        biomarker: "Cephalopod optic clarity and tentacle suckers chitinous ring integrity",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "ตาใสแจ๋ว ถ้วยดูดที่หนวดสมบูรณ์", descTh: "ดวงตาใสเป็นประกาย ตาดำเข้ม หนวดครบถ้วน ปุ่มดูดยังคงรูปทรงกลมแข็งแรง" },
          { demeritMin: 2, demeritMax: 3, labelTh: "ตาเริ่มขุ่น ถ้วยดูดเริ่มหลุดบางจุด", descTh: "ดวงตามีฝ้าขาวหม่น หนวดอ่อนตัวลง ถ้วยดูดเริ่มหลุดร่วงเล็กน้อย" },
          { demeritMin: 4, demeritMax: 4, labelTh: "ตาขุ่นทึบ หนวดเปื่อยขาด หลุดง่าย", descTh: "ดวงตาขุ่นขาวหรือบุ๋มแตก หนวดเปื่อยยุ่ย ถ้วยดูดหลุดหมด มีกลิ่นคาวรุนแรง" },
        ],
      },
    ],
    criticalSafetyThresholds: [
      { metric: "chromatophore_clarity", limitValue: 6, hazardDescription: "เกิดการสะสมสารไตรเมทิลเอมีน (TMA) และจุลินทรีย์ก่อโรคระดับสูง" },
      { metric: "mantle_firmness", limitValue: 4, hazardDescription: "เนื้อหมึกผ่านการเน่าสลายของโปรตีน เสี่ยงต่อการเกิดสารพิษก่อโรคกระเพาะอาหารอักเสบ" },
    ],
  },
  {
    id: "shellfish",
    labelTh: "หอยสองฝาและหอยนางรม",
    labelEn: "Bivalves & Shellfish",
    scientificFamily: "Bivalvia",
    standardDoc: "TAS 7003-2550",
    iconName: "Shell",
    supportedSpecies: [
      { commonTh: "หอยแมลงภู่", commonEn: "Asian Green Mussel", scientific: "Perna viridis", habitat: "ฟาร์มหลัก/เสาหอย" },
      { commonTh: "หอยนางรม", commonEn: "Pacific / Belcher's Oyster", scientific: "Crassostrea belcheri", habitat: "อ่าวสุราษฎร์/จันทบุรี" },
      { commonTh: "หอยแครง", commonEn: "Blood Cockle", scientific: "Tegillarca granosa", habitat: "หาดโคลนชายเลน" },
      { commonTh: "หอยลาย", commonEn: "Undulated Surf Clam", scientific: "Paphia undulata", habitat: "พื้นทรายปนโคลน" },
    ],
    qimCriteria: [
      {
        id: "valve_closure_reflex",
        labelTh: "การประกบปิดของฝาหอย (Valve Reflex)",
        labelEn: "Valve Closure & Viability Reflex",
        maxDemerit: 8,
        weight: 0.40,
        anatomicalRegion: "shell_valves",
        biomarker: "Adductor muscle tone and neuromuscular response in live bivalves",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "ฝาปิดสนิท หรือดีดปิดทันทีเมื่อเคาะ", descTh: "ฝาทั้งสองประกบสนิท หากอ้าอยู่เล็กน้อยจะหุบปิดทันทีเมื่อเคาะสัมผัส (หอยยังมีชีวิต)" },
          { demeritMin: 2, demeritMax: 4, labelTh: "ฝาอ้าเล็กน้อย ดีดปิดช้ามาก", descTh: "ฝาอ้าค้างเล็กน้อย เมื่อเคาะจะขยับปิดอย่างเชื่องช้า บ่งชี้ว่าหอยอ่อนแอหรือขาดน้ำ" },
          { demeritMin: 5, demeritMax: 8, labelTh: "ฝาอ้ากว้าง ไม่ตอบสนองเลย (ตายแล้ว)", descTh: "ฝาอ้าอ้ากว้าง ไม่มีการตอบสนองต่อการสัมผัส หอยตายแล้ว ไม่ปลอดภัยอย่างยิ่ง" },
        ],
      },
      {
        id: "mantle_fluid_clarity",
        labelTh: "ความใสและกลิ่นของน้ำเลี้ยงในตัวหอย",
        labelEn: "Intravalvular Fluid Clarity & Scent",
        maxDemerit: 5,
        weight: 0.25,
        anatomicalRegion: "mantle_liquid",
        biomarker: "Intravalvular fluid microbial count and volatile sulfur compounds",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "น้ำใสสะอาด กลิ่นไอทะเลสดชื่น", descTh: "น้ำในฝาหอยใส โปร่งแสง มีกลิ่นหอมไอทะเลสะอาด ไม่มีกลิ่นคาวเน่า" },
          { demeritMin: 2, demeritMax: 3, labelTh: "น้ำเริ่มขุ่นเล็กน้อย กลิ่นคาวขึ้น", descTh: "น้ำในฝาเริ่มมีตะกอนสีขุ่น กลิ่นคาวเริ่มชัดเจนขึ้นแต่ยังไม่เน่าเหม็น" },
          { demeritMin: 4, demeritMax: 5, labelTh: "น้ำขุ่นคล้ำ กลิ่นกำมะถัน/แก๊สไข่เน่า", descTh: "น้ำในฝาขุ่นข้นสีเทาดำ มีกลิ่นแก๊สไข่เน่า (Hydrogen sulfide) หรือกลิ่นเปรี้ยวรุนแรง" },
        ],
      },
      {
        id: "meat_plumpness",
        labelTh: "ความเต่งตึงและปริมาณน้ำในเนื้อหอย",
        labelEn: "Mantle Flesh Plumpness & Hydration",
        maxDemerit: 4,
        weight: 0.20,
        anatomicalRegion: "flesh",
        biomarker: "Glycogen reserves and cellular water retention in shellfish meat",
        levels: [
          { demeritMin: 0, demeritMax: 1, labelTh: "เนื้อเต่งตึง อวบอิ่ม ชุ่มน้ำ", descTh: "เนื้อหอยเต็มฝา นูนเต่ง สีสันสดใสตามชนิด มีประกายความชุ่มชื้นเต็มเปี่ยม" },
          { demeritMin: 2, demeritMax: 3, labelTh: "เนื้อเริ่มแฟบลง สีหมองเล็กน้อย", descTh: "เนื้อหอยเริ่มหดตัว ขอบเนื้อเริ่มแห้ง ขาดความเปล่งปลั่ง" },
          { demeritMin: 4, demeritMax: 4, labelTh: "เนื้อเหี่ยวแห้ง ลีบแฟบ เปื่อยยุ่ย", descTh: "เนื้อหอยลีบติดฝา เปื่อยยุ่ย สีซีดจางหรือมีคราบเมือกเกาะผิดปกติ" },
        ],
      },
      {
        id: "shell_exterior_luster",
        labelTh: "ความชุ่มชื้นและความเงางามของเปลือกนอก",
        labelEn: "Shell Exterior Moisture & Luster",
        maxDemerit: 3,
        weight: 0.15,
        anatomicalRegion: "shell_surface",
        biomarker: "Periostracum integrity and surface moisture retention",
        levels: [
          { demeritMin: 0, demeritMax: 0, labelTh: "เปลือกชุ่มชื้น สะอาด สีสดใส", descTh: "เปลือกนอกมีความชื้นฉ่ำน้ำ สีสันสดใสตามธรรมชาติ ไม่มีคราบแห้งกรัง" },
          { demeritMin: 1, demeritMax: 2, labelTh: "เปลือกแห้ง ด้าน สีซีดลง", descTh: "ผิวเปลือกเริ่มแห้งกรัง ขาดความเงางาม" },
          { demeritMin: 3, demeritMax: 3, labelTh: "เปลือกแห้งแตก มีตะกอนสีดำหรือคราบเน่า", descTh: "เปลือกแห้งกรอบ หลุดร่อน มีคราบของเหลวเน่าเสียเกาะติดภายนอก" },
        ],
      },
    ],
    criticalSafetyThresholds: [
      { metric: "valve_closure_reflex", limitValue: 5, hazardDescription: "หอยตายแล้ว (Open/unresponsive bivalve) เสี่ยงต่อสารพิษจากแบคทีเรียและสาหร่ายพิษ (PSP/DSP) รุนแรงถึงแก่ชีวิต" },
      { metric: "mantle_fluid_clarity", limitValue: 4, hazardDescription: "ตรวจพบสารระเหยไฮโดรเจนซัลไฟด์และแบคทีเรียย่อยสลาย ห้ามบริโภคโดยเด็ดขาด" },
    ],
  },
];

/**
 * Maps a total QIM demerit point score (0..20) onto the standard Freshness Grade
 */
export function gradeFromQimDemerit(demeritPoints: number): FreshnessGrade {
  if (demeritPoints <= 4.5) return "A";
  if (demeritPoints <= 9.5) return "B";
  if (demeritPoints <= 14.5) return "C";
  return "D";
}

/**
 * Converts a 0..20 QIM Demerit score into a 0..100 Freshness Index (FI)
 * Demerit 0 => 100% (Perfect)
 * Demerit 20 => 0% (Spoiled)
 */
export function calculateFreshnessIndex(demeritPoints: number): number {
  const clamped = Math.max(0, Math.min(20, demeritPoints));
  return Math.round(100 - (clamped / 20) * 100);
}

/**
 * Returns complete grade metadata for a given grade
 */
export function getGradeInfo(grade: FreshnessGrade): FreshnessGradeInfo {
  return FRESHNESS_GRADES.find((g) => g.id === grade) ?? FRESHNESS_GRADES[0];
}
