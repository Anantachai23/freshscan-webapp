# FreshScan Developer Guide

## Project Overview

FreshScan is an AI-powered seafood freshness assessment web application. It evaluates the freshness of seafood (fish, shrimp, shellfish, and squid) from photos using visual feature analysis and calibrated rubrics.

## Codebase Architecture

- **Framework:** TanStack Start (React 19) + TanStack Router
- **Styling:** Tailwind CSS v4, Lucide React, Framer Motion
- **Database & Auth:** Supabase (`@supabase/supabase-js`)
- **Visual Analysis:** Client-side canvas pixel feature extraction (`src/lib/freshnessAnalyzer.ts` and `src/lib/imageFeatures.ts`)
- **Calibration Engine:** Node-based feature calibration script (`scripts/calibrate.mjs`)

## Development Workflow

- `npm run dev`: Start local development server.
- `npm run build`: Build production client and server bundles.
- `npm run calibrate`: Recalibrate feature weights from labeled photos in `Datasetimage/`.
