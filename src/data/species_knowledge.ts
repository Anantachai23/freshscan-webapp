/**
 * FreshScan Marine™ — Scientific Species Knowledge Hub
 * 
 * Comprehensive biological and quality specifications for primary commercial species
 * in Thai and Indo-Pacific marine waters, conforming to Department of Fisheries & FAO guidelines.
 */

export interface SpeciesQualityProfile {
  id: string;
  category: "fish" | "shrimp" | "shellfish" | "squid";
  categoryTh: string;
  nameTh: string;
  nameEn: string;
  scientific: string;
  family: string;
  commercialStatus: string;
  habitat: string;
  optimalTempC: string;
  shelfLifeIcedDays: string;
  peakSeasonTh: string;
  culinaryProfileTh: string;
  qimAnatomyGuide: {
    region: string;
    freshIndicatorTh: string;
    spoilageIndicatorTh: string;
  }[];
  biochemicalRisks: string[];
}

export const SPECIES_CATALOG: readonly SpeciesQualityProfile[] = [
  // --- FINFISH ---
  {
    id: "seabass",
    category: "fish",
    categoryTh: "ปลา",
    nameTh: "ปลากะพงขาว",
    nameEn: "Asian Sea Bass / Barramundi",
    scientific: "Lates calcarifer",
    family: "Latidae",
    commercialStatus: "สัตว์น้ำเศรษฐกิจมูลค่าสูง (เพาะเลี้ยง & ประมงชายฝั่ง)",
    habitat: "น้ำกร่อย ชายฝั่งทะเล และปากแม่น้ำ",
    optimalTempC: "0°C ถึง 2°C (บนน้ำแข็งเกล็ด)",
    shelfLifeIcedDays: "4–6 วัน ในน้ำแข็งบด",
    peakSeasonTh: "ตลอดทั้งปี (ผลผลิตฟาร์มเพาะเลี้ยง)",
    culinaryProfileTh: "เนื้อขาว นุ่ม ละเอียด ไขมันดี เหมาะสำหรับนึ่งมะนาว ทอดน้ำปลา และลวกจิ้ม",
    qimAnatomyGuide: [
      {
        region: "กระจกตาและม่านตา",
        freshIndicatorTh: "ตานูนเด่น ใสสะท้อนแสง รูม่านตาดำสนิท",
        spoilageIndicatorTh: "ตายุบตัว แบนราบ มีฝ้าสีเทาขาวบดบัง",
      },
      {
        region: "แผ่นปิดเหงือกและซี่เหงือก",
        freshIndicatorTh: "เหงือกสีแดงเลือดนก เมือกใสบาง ไม่คาว",
        spoilageIndicatorTh: "เหงือกสีน้ำตาลซีด เมือกขุ่นข้นเกาะเป็นก้อน",
      },
      {
        region: "เกล็ดและเยื่อเมือก",
        freshIndicatorTh: "เกล็ดสีเงินสะท้อนประกาย ติดแน่นกับหนัง",
        spoilageIndicatorTh: "เกล็ดหลุดร่อนง่าย ผิวแห้งด้านหรือมีเมือกเหลืองเหนียว",
      },
      {
        region: "กล้ามเนื้อช่องท้อง",
        freshIndicatorTh: "ท้องแน่นตึง กดแล้วเด้งคืนตัวทันที",
        spoilageIndicatorTh: "ท้องนิ่มยุบ ผนังท้องแตก (Belly burst) ไส้ทะลัก",
      },
    ],
    biochemicalRisks: ["Vibrio vulnificus (หากเก็บในอุณหภูมิห้อง)", "Pseudomonas autolysis"],
  },
  {
    id: "mackerel",
    category: "fish",
    categoryTh: "ปลา",
    nameTh: "ปลาทูสั้น (ปลาทูไทย)",
    nameEn: "Short-bodied Mackerel",
    scientific: "Rastrelliger brachysoma",
    family: "Scombridae",
    commercialStatus: "ปลาเศรษฐกิจหลักของอ่าวไทย",
    habitat: "ทะเลเปิดระดับผิวน้ำ อ่าวไทยและทะเลอันดามัน",
    optimalTempC: "-1°C ถึง 1°C (Chilled Sea Water / Ice slurry)",
    shelfLifeIcedDays: "2–3 วัน (ปลาเนื้อแดงสลายตัวเร็วมาก)",
    peakSeasonTh: "พฤศจิกายน – กุมภาพันธ์ (ฤดูปลาทูแม่กลอง)",
    culinaryProfileTh: "เนื้อแน่นมัน หอมหวานตามธรรมชาติ โปรตีนและโอเมก้า-3 สูงมาก นิยมต้มส้ม ทอด ย่างเกลือ",
    qimAnatomyGuide: [
      {
        region: "แถบลายข้างลำตัว",
        freshIndicatorTh: "ลำตัวสีเขียวแกมน้ำเงินประกายเงินแวววาว",
        spoilageIndicatorTh: "สีซีดหมอง ลายข้างตัวจางลง ผิวสีเทาอมเหลือง",
      },
      {
        region: "ดวงตา",
        freshIndicatorTh: "ตากลมใส นูนเต่ง ไม่แดงช้ำ",
        spoilageIndicatorTh: "ขอบตาแดงก่ำ ตายุบบุ๋ม เลนส์ตาขุ่นทึบ",
      },
      {
        region: "เหงือกและกลิ่น",
        freshIndicatorTh: "เหงือกแดงฉ่ำ กลิ่นไอทะเลบริสุทธิ์",
        spoilageIndicatorTh: "เหงือกคล้ำ มีกลิ่นคาวเปรี้ยวหรือแอมโมเนีย",
      },
    ],
    biochemicalRisks: ["การสะสมฮิสตามีน (Histamine / Scombroid poisoning)", "Oxidative rancidity ของไขมัน"],
  },
  {
    id: "grouper",
    category: "fish",
    categoryTh: "ปลา",
    nameTh: "ปลาเก๋าดอกแดง / ปลาเก๋าเสือ",
    nameEn: "Orange-spotted Grouper",
    scientific: "Epinephelus coioides",
    family: "Serranidae",
    commercialStatus: "ปลาภัตตาคารเกรดส่งออก",
    habitat: "แนวปะการังและโขดหินชายฝั่ง",
    optimalTempC: "0°C ถึง 2°C",
    shelfLifeIcedDays: "5–7 วัน (เนื้อแน่นคงทน)",
    peakSeasonTh: "ตลอดปี",
    culinaryProfileTh: "เนื้อสัมผัสแน่นเด้ง หนังหนานุ่มด้วยคอลลาเจน นิยมนึ่งซีอิ๊ว ต้มยำน้ำใส ผัดฉ่า",
    qimAnatomyGuide: [
      {
        region: "จุดลายบนลำตัว",
        freshIndicatorTh: "จุดสีส้มอมน้ำตาลตัดกับสีผิวชัดเจน ผิวมันวาว",
        spoilageIndicatorTh: "จุดสีซีดจาง ผิวคล้ำด้าน เมือกเหนียวปกคลุม",
      },
      {
        region: "ความแน่นของเนื้อ",
        freshIndicatorTh: "เนื้อสปริงตัวแข็งแรง ไม่บุ๋มตามรอยกด",
        spoilageIndicatorTh: "เนื้อยุบยวบ ยางเมือกเหนียวติดตามมือ",
      },
    ],
    biochemicalRisks: ["Ciguatera toxin (เฉพาะปลาธรรมชาติขนาดใหญ่ผิดปกติ)", "Bacterial spoilage"],
  },
  {
    id: "pomfret",
    category: "fish",
    categoryTh: "ปลา",
    nameTh: "ปลาจะละเม็ดขาว",
    nameEn: "Silver Pomfret",
    scientific: "Pampus argenteus",
    family: "Stromateidae",
    commercialStatus: "ปลาพรีเมียมราคาสูง",
    habitat: "ทะเลลึกพื้นทราย",
    optimalTempC: "0°C ถึง 2°C",
    shelfLifeIcedDays: "3–4 วัน",
    peakSeasonTh: "ธันวาคม – มีนาคม",
    culinaryProfileTh: "เนื้อขาวเนียน ละลายในปาก กลิ่นหอมสะอาด นิยมนึ่งบ๊วย ทอดราดพริก",
    qimAnatomyGuide: [
      {
        region: "ผิวกายสีเงิน",
        freshIndicatorTh: "เงาเงินสว่างเจิดจ้าดั่งกระจกเงา",
        spoilageIndicatorTh: "เกล็ดสีเงินหลุดล่อน ผิวเปลี่ยนเป็นสีเทาอมเหลือง",
      },
      {
        region: "ความยืดหยุ่นของแผ่นตัว",
        freshIndicatorTh: "แผ่นตัวโค้งกระชับ แข็งตรง ไม่หักพับ",
        spoilageIndicatorTh: "แผ่นตัวอ่อนปวกเปียก หักพับงอได้ง่าย",
      },
    ],
    biochemicalRisks: ["Autolytic tissue softening"],
  },

  // --- SHRIMP ---
  {
    id: "vannamei",
    category: "shrimp",
    categoryTh: "กุ้ง",
    nameTh: "กุ้งขาวแวนนาไม",
    nameEn: "Pacific White Shrimp",
    scientific: "Litopenaeus vannamei",
    family: "Penaeidae",
    commercialStatus: "ผลผลิตกุ้งเศรษฐกิจอันดับ 1 ของไทย",
    habitat: "ฟาร์มเพาะเลี้ยงระบบปิดและพัฒนา",
    optimalTempC: "-1°C ถึง 1°C (Slush ice)",
    shelfLifeIcedDays: "3–4 วัน",
    peakSeasonTh: "ตลอดปี",
    culinaryProfileTh: "รสหวานธรรมชาติ เปลือกบาง แกะง่าย เนื้อเด้งกรอบ เหมาะกับทุกเมนู",
    qimAnatomyGuide: [
      {
        region: "ข้อต่อหัวและลำตัว (Cephalothorax)",
        freshIndicatorTh: "หัวยึดติดแน่นสนิท ไม่คลอน ไม่เยิ้ม",
        spoilageIndicatorTh: "คอหัก หัวหลวม พบของเหลวสีคล้ำไหลออกมา",
      },
      {
        region: "ดัชนีจุดดำ (Melanosis)",
        freshIndicatorTh: "เปลือกใส ไร้จุดดำที่ขาและข้อปล้อง",
        spoilageIndicatorTh: "จุดดำลุกลามทั่วขอบเปลือกและระยางค์",
      },
      {
        region: "ความโปร่งแสงของเปลือก",
        freshIndicatorTh: "เปลือกสีเทาโปร่งแสง แวววาว",
        spoilageIndicatorTh: "เปลือกขุ่นขาวหรือเริ่มแดงส้มเหมือนสุก",
      },
    ],
    biochemicalRisks: ["PPO (Polyphenol oxidase) enzymatic browning", "Vibrio parahaemolyticus"],
  },
  {
    id: "black_tiger",
    category: "shrimp",
    categoryTh: "กุ้ง",
    nameTh: "กุ้งกุลาดำ",
    nameEn: "Black Tiger Shrimp",
    scientific: "Penaeus monodon",
    family: "Penaeidae",
    commercialStatus: "กุ้งยักษ์พรีเมียมเพื่อการส่งออก",
    habitat: "ทะเล ชายฝั่ง และบ่อธรรมชาติ",
    optimalTempC: "-1°C ถึง 1°C",
    shelfLifeIcedDays: "4–5 วัน",
    peakSeasonTh: "ตุลาคม – มกราคม",
    culinaryProfileTh: "เนื้อแน่น ลายสวย รสหวานเข้มข้น นิยมเผา ต้มยำ หรืออบชีส",
    qimAnatomyGuide: [
      {
        region: "ลายแถบขวางลำตัว",
        freshIndicatorTh: "ลายแถบสีดำ-น้ำเงินเข้มตัดกับสีเนื้อชัดเจน",
        spoilageIndicatorTh: "ลายแถบเบลอจาง สีเปลือกเปลี่ยนเป็นสีแดงคล้ำช้ำ",
      },
      {
        region: "ความแน่นของหาง",
        freshIndicatorTh: "หางแผ่สวย กรีแหลมคม ไม่หักรุ่งริ่ง",
        spoilageIndicatorTh: "ปลายหางดำช้ำ กรีอ่อนหักง่าย",
      },
    ],
    biochemicalRisks: ["Melanosis degradation", "Microbial proteolytic softening"],
  },

  // --- SQUID ---
  {
    id: "splendid_squid",
    category: "squid",
    categoryTh: "หมึก",
    nameTh: "หมึกกล้วย",
    nameEn: "Splendid Squid",
    scientific: "Uroteuthis duvaucelii",
    family: "Loliginidae",
    commercialStatus: "หมึกยอดนิยมของคนไทย",
    habitat: "อ่าวไทยและทะเลอันดามัน",
    optimalTempC: "0°C ถึง 2°C (บนน้ำแข็งสะอาด)",
    shelfLifeIcedDays: "2–4 วัน",
    peakSeasonTh: "กันยายน – ธันวาคม",
    culinaryProfileTh: "เนื้อกรอบหวาน ผิวสัมผัสนุ่มเด้ง ไม่เหนียว ลวก ย่าง ยัดไส้",
    qimAnatomyGuide: [
      {
        region: "เม็ดสีโครมาโตฟอร์",
        freshIndicatorTh: "จุดสีน้ำตาลเข้ม คมชัดดั่งเม็ดทรายบนผิวขาวใส",
        spoilageIndicatorTh: "จุดสีละลายกลายเป็นสีชมพูเรื่อ หรือผิวขาวซีดด้าน",
      },
      {
        region: "ความตึงแน่นของลำตัว",
        freshIndicatorTh: "ลำตัวกลมเต่ง ทรงกระบอก แข็งสปริง",
        spoilageIndicatorTh: "ลำตัวแบนแฟบ เหลวย้วย ฉีกขาดง่าย",
      },
      {
        region: "ตาและหนวด",
        freshIndicatorTh: "ตาใสแจ๋ว ถ้วยดูดเกาะแน่นครบถ้วน",
        spoilageIndicatorTh: "ตาขุ่นมัว ถ้วยดูดหลุดร่วง หนวดเปื่อย",
      },
    ],
    biochemicalRisks: ["Trimethylamine (TMA) emission", "Rapid autolysis from squid digestive enzymes"],
  },

  // --- SHELLFISH ---
  {
    id: "green_mussel",
    category: "shellfish",
    categoryTh: "หอย",
    nameTh: "หอยแมลงภู่",
    nameEn: "Asian Green Mussel",
    scientific: "Perna viridis",
    family: "Mytilidae",
    commercialStatus: "หอยสองฝาเศรษฐกิจหลัก",
    habitat: "เสาเพาะเลี้ยงชายฝั่งอ่าวไทย",
    optimalTempC: "2°C ถึง 5°C (ต้องรักษาความชื้น ห้ามแช่น้ำจืด)",
    shelfLifeIcedDays: "2–3 วัน (ต้องมีชีวิตก่อนนำมาปรุง)",
    peakSeasonTh: "พฤษภาคม – สิงหาคม",
    culinaryProfileTh: "เนื้ออวบแน่น หวานฉ่ำ กลิ่นหอมสมุนไพร นิยมนึ่งใบโหระพา อบ หรือผัดกะเพรา",
    qimAnatomyGuide: [
      {
        region: "การปิดของฝาหอย (Valve closure)",
        freshIndicatorTh: "ฝาปิดสนิท หรือหุบปิดทันทีเมื่อเคาะเบา ๆ (ยังมีชีวิต)",
        spoilageIndicatorTh: "ฝาอ้ากว้าง เคาะแล้วไม่ปิด (หอยตายแล้ว)",
      },
      {
        region: "น้ำในฝาและเนื้อ",
        freshIndicatorTh: "น้ำใส กลิ่นหอมไอทะเล เนื้อสีส้มหรือครีมเต่งตึง",
        spoilageIndicatorTh: "น้ำขุ่นคล้ำ กลิ่นแก๊สไข่เน่า (H2S) เนื้อเหี่ยวลีบ",
      },
    ],
    biochemicalRisks: ["Algal biotoxins (PSP / DSP)", "Vibrio vulnificus in dead bivalves"],
  },
];

export const DATASET_SPECIFICATIONS = [
  {
    title: "European QIM Seafood Assessment Standard",
    reference: "Quality Index Method Foundation (qim-eurofish.com)",
    scope: "De facto European standardized sensory inspection protocol for fish & cephalopods.",
  },
  {
    title: "Thai Agricultural Standard TAS 7001-2550 (ปลาสด)",
    reference: "National Bureau of Agricultural Commodity and Food Standards (ACFS)",
    scope: "เกณฑ์คุณภาพทางกายภาพ จุลชีววิทยา และสารฮิสตามีนสำหรับปลาสดในประเทศไทย",
  },
  {
    title: "Thai Agricultural Standard TAS 7002-2550 (กุ้งสด)",
    reference: "ACFS Thailand / Department of Fisheries",
    scope: "เกณฑ์การตรวจวัดดัชนีจุดดำ (Melanosis) และความสมบูรณ์ของกุ้งสดเพื่อการค้าและการส่งออก",
  },
  {
    title: "Codex Alimentarius Code of Practice for Fish and Fishery Products",
    reference: "CODEX STAN CAC/RCP 52-2003",
    scope: "International code of hygiene, cold chain integrity, and sensory defect grading.",
  },
];
