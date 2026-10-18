<div align="center">

# 🐟 FreshScan

**AI-powered seafood freshness assessment in your browser.**

Evaluate the freshness of fish, shrimp, shellfish, and squid from smartphone photos in under 3 seconds. Built for everyday consumers, home cooks, restaurants, and seafood vendors to make confident buying choices, protect food safety, and reduce waste.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.0-ff4154.svg)](https://tanstack.com/start)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ecf8e.svg)](https://supabase.com)

[Live App](https://freshscan-webapp-8svx.vercel.app) · [Report Bug](https://github.com/issues) · [Request Feature](https://github.com/issues)

</div>

---

## ✨ Highlights

- **⚡ Fast & Frictionless:** Upload or capture an image on any mobile device or desktop and receive an evaluation in under 3 seconds—no app install required.
- **🦐 4 Key Seafood Categories:** Custom evaluation rubrics for **Fish**, **Shrimp**, **Shellfish**, and **Squid**.
- **📋 20-Point Explainable Grading:** Delivers transparent **Grade A (Very Fresh)**, **Grade B (Acceptable)**, or **Grade C (Deteriorating)** results, accompanied by visual cues (eye clarity, gill/shell color, surface brightness, and tissue firmness).
- **🔒 Privacy-Preserving:** Image feature extraction runs client-side right in your browser via HTML Canvas. Your photos never leave your device without your consent.
- **📖 Seafood Buyer's Guide:** Includes an integrated knowledge base detailing popular Thai seafood species, optimal chilling temperatures, seasonal availability, and shelf life.
- **🎯 Calibratable Heuristics:** Includes a lightweight calibration workflow (`npm run calibrate`) that fine-tunes score distributions using real reference photos from your local markets.

---

## 🔬 How It Works

FreshScan avoids black-box ambiguity by analyzing measurable visual proxies proven in manual seafood quality inspection:

1. **Pixel Feature Extraction:** Evaluates overall luminance, color saturation, dark discoloration patches (bruising or gill degradation), dull yellow/brown oxidation ratios, color uniformity, and surface texture sharpness.
2. **Category-Specific Rubric:** Evaluates indicators mapped to each seafood type (e.g., eye clarity and gill red saturation for fish, shell translucency for shrimp, shell closure for bivalves).
3. **Transparent Scoring:** Aggregates sub-scores onto a 20-point scale with actionable storage and culinary recommendations.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm

### 1. Clone & Install

```bash
git clone https://github.com/your-username/freshscan.git
cd freshscan
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 3. Launch Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` (or the port indicated in your terminal).

---

## 📁 Project Structure

```
├── Datasetimage/          # Reference photos for local calibration
├── scripts/               # Calibration script (sharp-based feature aggregation)
├── src/
│   ├── components/        # UI components & landing page sections
│   ├── data/              # Seafood taxonomy, species handbook & calibration data
│   ├── hooks/             # Authentication & custom React hooks
│   ├── integrations/      # Supabase client & authentication helpers
│   ├── lib/               # Pixel analysis & image feature extraction logic
│   └── routes/            # TanStack Router file-based route definitions
└── supabase/              # Database schema & role migrations
```

---

## 🛠️ Calibration Workflow

To calibrate scoring thresholds against photos from your specific market environment:

1. Place reference images into `Datasetimage/fresh/<category>/` and `Datasetimage/not_fresh/<category>/`.
2. Run the calibration script:
   ```bash
   npm run calibrate
   ```
3. Rebuild or restart the dev server—the app automatically incorporates updated reference averages.

---

## ⚠️ Disclaimer

FreshScan is an assistive visual assessment tool designed for educational and informational purposes. Results reflect visual surface indicators and should be corroborated with tactile feel and odor before making food safety decisions. It is not a replacement for professional laboratory microbiology testing.

---

## 📄 License

Distributed under the MIT License.
