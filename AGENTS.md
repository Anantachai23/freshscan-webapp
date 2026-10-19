# FreshScan Developer Guide

## Project Overview

FreshScan is an AI-powered seafood freshness assessment web application. It evaluates the freshness of seafood (fish, shrimp, shellfish, and squid) from photos using visual feature analysis and calibrated rubrics.

## Codebase Architecture

- **Framework:** TanStack Start (React 19) + TanStack Router
- **Styling:** Tailwind CSS v4, Lucide React, Framer Motion
- **Database & Auth Services:** Supabase (`src/services/supabase/`)
- **Visual Analysis:** Client-side canvas pixel feature extraction (`src/lib/freshnessAnalyzer.ts` and `src/lib/imageFeatures.ts`)
- **Calibration Engine:** Node-based feature calibration script (`scripts/calibrate.mjs`)

## Directory Structure

```
src/
├── assets/             # Brand and sample seafood imagery
├── components/
│   ├── home/           # Landing page sections (Hero, Problem, HowItWorks, Tech, Stats, About)
│   ├── layout/         # Application shell (Navbar, Footer)
│   └── ui/             # Reusable design system primitives (Radix / Tailwind)
├── data/               # Species rubrics, quality rules, and calibration data
├── hooks/              # Reusable React hooks (use-mobile)
├── lib/                # Pure business logic & computer vision algorithms
├── routes/             # TanStack Start file-based routing
└── services/           # Backend and cloud integrations (Supabase client & middleware)
```

## Development Workflow

- `npm run dev`: Start local development server.
- `npm run build`: Build production client and server bundles.
- `npm run calibrate`: Recalibrate feature weights from labeled photos in `Datasetimage/`.
