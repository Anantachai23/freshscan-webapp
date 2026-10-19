<div align="center">

# FreshScan Marine™
### Autonomous Seafood Quality Assessment & Biological Freshness Grading Platform

**A browser-based edge computer vision system engineered for rapid, non-destructive seafood freshness inspection adhering to the international Quality Index Method (QIM) and TAS 7001-2550 standards.**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-000000.svg?logo=vercel&logoColor=white)](https://freshscan-webapp-8svx.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Standard QIM](https://img.shields.io/badge/Standard-QIM%20%7C%20TAS%207001--2550-06b6d4.svg)](https://www.fao.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

[**Launch Live Platform**](https://freshscan-webapp-8svx.vercel.app) · [Inspect Calibration Matrix](https://freshscan-webapp-8svx.vercel.app/dataset) · [Species Knowledge Hub](https://freshscan-webapp-8svx.vercel.app/species)

</div>

---

## Executive Overview

FreshScan Marine™ is an industrial-grade seafood quality assessment web platform designed to enforce traceability, food safety, and cold-chain compliance across the marine harvest supply chain. 

By translating traditional sensory evaluation protocols—most notably the **European Quality Index Method (QIM)**, **FAO Fisheries Technical Paper 348**, and **Thai Agricultural Standards (TAS 7001-2550 & 7002-2550)**—into a lightweight, client-side computer vision pipeline, FreshScan enables fishermen, auction piers, cold storage operators, culinary professionals, and consumers to evaluate seafood freshness in under 800 milliseconds directly within any modern web browser.

---

## Key System Capabilities

- **Strict Regulatory Compliance (QIM & Codex):** Employs a standardized 0–20 demerit point scoring system mapped directly to statutory freshness grades:
  - **Grade Extra / A (0–4 Demerits):** Prime sushi/sashimi export-grade quality.
  - **Grade B (5–9 Demerits):** Wholesome commercial grade suitable for regular retail and thermal culinary preparation.
  - **Grade C (10–14 Demerits):** Secondary grade requiring immediate consumption.
  - **Grade D / Reject (15–20 Demerits):** Unfit for human consumption due to advanced protein breakdown, histamine buildup, or microbial spoilage.
- **Dual-Mode Optical Ingestion:**
  - **Live WebRTC Viewfinder:** Direct camera streaming with optical alignment targeting overlays for handheld market operation.
  - **Dropzone Pipeline:** Support for ultra-high-resolution imagery (up to 108MP) with client-side downsampling and chromatic adaptation.
- **Explainable Biomarker Analytics (XAI):**
  - **Corneal Opacity & Pupil Contour:** Quantitative lens clarity index distinguishing fresh vitreous humor from post-mortem cataract clouding.
  - **Branchial Hemoglobin Saturation:** Spectral color analysis of gill tissue measuring arterial oxyhemoglobin degradation.
  - **Polyphenol Oxidase (Melanosis Index):** Enzymatic blackening quantification in crustacean cephalothoraxes and uropods.
  - **Chromatophore Dispersion:** Cephalopod pigment contraction and dermal sheath structural integrity.
- **Zero-Cloud Privacy & Offline Autonomy:** 100% of pixel processing, color space transformations, and Bayesian likelihood estimations occur locally on the user's browser via HTML5 Canvas and SIMD-accelerated math routines. No private imagery is ever transmitted or retained.
- **Cold-Chain Shelf-Life Projection:** Calculates estimated residual shelf life on ice ($0^\circ\text{C}$ to $2^\circ\text{C}$) based on linear sensory degradation models.
- **Verifiable Inspection Certificates:** One-click generation of printable quality audit reports containing timestamp, biological classification, demerit breakdown, and consumer directives.

---

## Supported Taxa & Biological Coverage

FreshScan Marine™ maintains calibrated empirical distribution profiles for 16 commercially critical marine species distributed across four primary taxonomic classes:

| Class | Commercial Species Profile | Key Anatomical Checkpoints |
| :--- | :--- | :--- |
| **Pisces (Fish)** | Indo-Pacific Mackerel, Barramundi, Narrow-barred Spanish Mackerel, Yellowfin Tuna, Cobia, Red Snapper | Eye convexity & clarity, gill vascular coloration, opercular mucus viscosity, skin iridescent shine |
| **Crustacea (Shrimp)** | Whiteleg Shrimp (*L. vannamei*), Giant Tiger Prawn (*P. monodon*), Banana Prawn | Carapace adhesion, antennal rigidity, absence of melanosis, caudal fin translucency |
| **Bivalvia (Shellfish)** | Green Mussel, Blood Clam, Asian Oyster | Shell valve adduction response, mantle liquor turbidity, ligament firmness |
| **Cephalopoda (Squid)** | Swordtip Squid, Indian Squid, Bigfin Reef Squid | Dermal chromatophore integrity, tentacle suckers adherence, flesh elasticity |

---

## Technology Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Browser (Edge)                       │
│                                                                 │
│  ┌──────────────────────┐         ┌──────────────────────────┐  │
│  │   Optical Ingestion  │         │   Client-Side CV Engine  │  │
│  │ - WebRTC HD Camera   │ ──(Raw)─► - Image Resizer / Bicubic│  │
│  │ - Drag & Drop Upload │         │ - Chromatic Adaptation   │  │
│  └──────────────────────┘         └────────────┬─────────────┘  │
│                                                │                │
│                                                ▼                │
│  ┌──────────────────────┐         ┌──────────────────────────┐  │
│  │   Interactive UI/UX  │         │   QIM Evaluation Core    │  │
│  │ - Oceanic Navy Theme │ ◄(Audit)─ - 0–20 Demerit Scoring   │  │
│  │ - Radar Quality HUD  │         │ - Bayesian Classification│  │
│  │ - PDF/Print Cert     │         │ - Cold-Chain Projection  │  │
│  └──────────────────────┘         └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ▲
                                │ SSR / Nitro Vercel Output API
┌───────────────────────────────┴─────────────────────────────────┐
│              Serverless Delivery (TanStack Start)               │
│  - TypeScript 5.8 & React 19 Isomorphic Server Engine           │
│  - Tailwind CSS v4 Modern Theme Pipeline                        │
│  - Pre-calibrated Baseline Repository (calibration.json)        │
└─────────────────────────────────────────────────────────────────┘
```

- **Frontend Core:** React 19, TanStack Router, TanStack Start (SSR/Isomorphic hydration).
- **Styling Architecture:** Tailwind CSS v4, Lucide React, Framer Motion, Recharts.
- **Edge CV Pipeline:** Client-side RGB/HSV/Lab pixel processing, Gray-World white balancing, and kernel convolution.
- **Deployment Platform:** Vercel Build Output API v3 via Nitro serverless preset.

---

## Local Development & Setup

### Prerequisites

- Node.js `20.x` or later
- npm or pnpm package manager

### 1. Installation

```bash
git clone https://github.com/Anantachai23/freshscan-webapp.git
cd freshscan-webapp
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 3. Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Recalibration Engine

To re-calibrate empirical feature weights from benchmark photos:

```bash
npm run calibrate
```

### 5. Production Build Verification

```bash
npm run build
```

---

## Scientific References & Standards

1. **European QIM Foundation:** *Quality Index Method manual for fresh fish inspection.* Available at [qim-eurofish.com](https://www.qim-eurofish.com).
2. **Food and Agriculture Organization (FAO):** *Quality and quality changes in fresh fish.* FAO Fisheries Technical Paper No. 348, Rome, FAO.
3. **National Bureau of Agricultural Commodity and Food Standards (ACFS):**
   - *TAS 7001-2550: Marine Fish Guidelines.*
   - *TAS 7002-2550: Marine Shrimp Guidelines.*
4. **Codex Alimentarius Commission:** *Standard for Quick Frozen Fish and Fishery Products (CXS 36-1981, CXS 165-1989).*

---

## Disclaimer & Advisory

FreshScan Marine™ is designed as a rapid, non-destructive sensory decision-support tool. While calibrated against standard biological and photometric benchmarks, visual inspection cannot detect odorless toxins, microbial pathogens (*Vibrio* spp.), or heavy metal contaminants. For critical public health decisions, visual evaluations should always be supplemented by organoleptic checks (odor, firm tactile resistance) and validated laboratory microbiology.

---

## License

This software is released under the **MIT License**.
