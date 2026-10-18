<div align="center">

# 🐟 FreshScan

**ประเมินความสดของอาหารทะเลจากภาพถ่ายภายในไม่กี่วินาที**
<br/>
Seafood freshness assessment from a single photo — fast, explainable, and mobile-friendly.

[![Live Demo](https://img.shields.io/badge/demo-live-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white)](https://freshscan-webapp-8svx.vercel.app)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

---

## 📖 ภาพรวม (Overview)

**FreshScan** เป็นเว็บแอปพลิเคชันที่ช่วยผู้บริโภคและผู้ค้าประเมินความสดของอาหารทะเล (ปลา กุ้ง หอย ปลาหมึก) จากภาพถ่าย
ระบบจะวิเคราะห์ค่าพิกเซลจริงของภาพ แล้วให้ผลเป็น **เกรดความสด (A / B / C)** พร้อมคะแนนรายเกณฑ์และคำอธิบายที่เข้าใจง่าย
พัฒนาเพื่อเข้าร่วม **โครงการแข่งขันพัฒนาโปรแกรมคอมพิวเตอร์แห่งประเทศไทย (NSC) ครั้งที่ 28**

FreshScan is a web app that helps consumers and vendors evaluate seafood freshness from a photo.
It analyzes real pixel-level features of the uploaded image and returns a **freshness grade (A/B/C)**, a per-criterion score breakdown and human-readable reasoning.

## ✨ Features

| | Feature | Description |
|---|---|---|
| 📸 | **Scan / Upload** | ถ่ายภาพด้วยกล้องมือถือหรืออัปโหลดจากแกลเลอรี รองรับปลา กุ้ง หอย ปลาหมึก |
| 🔬 | **Explainable analysis** | วิเคราะห์ความสว่าง ความอิ่มของสี สัดส่วนรอยดำ สีเหลือง/น้ำตาลหม่น ความสม่ำเสมอของสี และความคมของพื้นผิว |
| 🏷️ | **Freshness grade** | ให้เกรด A/B/C พร้อม Confidence Score และคะแนนรายเกณฑ์ (เต็ม 20) |
| 🎯 | **Calibration** | ปรับเทียบผลด้วยชุดภาพอ้างอิงจริง (`npm run calibrate`) ดู [Datasetimage/README.md](Datasetimage/README.md) |
| 📚 | **Species knowledge** | ข้อมูลชนิดสัตว์น้ำและวิธีสังเกตความสดด้วยตนเอง |
| 🔐 | **Authentication** | สมัครสมาชิก / เข้าสู่ระบบ / รีเซ็ตรหัสผ่าน ผ่าน Supabase Auth |

## 🛠️ Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19, file-based routing) + Vite
- **Language:** TypeScript
- **UI:** Tailwind CSS 4, shadcn/ui (Radix UI), Motion, Lucide Icons
- **Data & Auth:** Supabase, TanStack Query, Zod
- **Hosting:** Vercel

## 📁 Project Structure

```
freshscan-webapp/
├── Datasetimage/          # ชุดภาพอ้างอิงสำหรับ calibration (ใส่ภาพเอง)
├── scripts/
│   └── calibrate.mjs      # สร้าง src/data/calibration.json จากชุดภาพอ้างอิง
├── src/
│   ├── components/
│   │   ├── freshscan/     # ส่วนประกอบหน้า Landing (Hero, HowItWorks, Stats, Team ...)
│   │   └── ui/            # shadcn/ui components
│   ├── data/              # taxonomy, species knowledge, calibration data
│   ├── integrations/      # Supabase client
│   ├── lib/               # freshnessAnalyzer, imageFeatures, imageResize
│   └── routes/            # หน้าเว็บ: /, /scan, /analyze, /species, /dataset, /auth
└── supabase/              # config & SQL migrations
```

## 🚀 Getting Started

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รันโหมดพัฒนา
npm run dev

# 3. Build สำหรับ production
npm run build

# 4. (ทางเลือก) ปรับเทียบด้วยชุดภาพอ้างอิง
npm run calibrate
```

ตั้งค่า environment variables ในไฟล์ `.env`:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## ⚠️ Disclaimer

ผลการประเมินเป็นเพียงข้อมูลประกอบการตัดสินใจ ไม่สามารถใช้แทนการตรวจสอบทางห้องปฏิบัติการได้
Results are for guidance only and are not a substitute for laboratory food-safety testing.

---

<div align="center">
Made with 💙 by <a href="https://github.com/Anantachai23">Anantachai</a> · Samut Prakan, Thailand
</div>
