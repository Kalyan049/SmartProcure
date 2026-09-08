<<<<<<< HEAD
# SmartProcure (SIH26032)

> “Right Information. Less Waiting. Brighter Tomorrows.”  
> **Ministry of Consumer Affairs, Food & Public Distribution**  
> **Category:** Software | **Theme:** Smart Automation | **Team:** InnoSix  
> **Architecture Version:** 3.0 | **Design Version:** 1.0

---

## 🌾 Overview

SmartProcure is an intelligent, capacity-aware agricultural arrival coordination system designed to eliminate uncertainty and long waiting queues at government procurement centers.

Instead of acting as a simple token issuer, SmartProcure dynamically balances farmer arrivals against physical center capacity through the lifecycle:

$$\text{Predict} \longrightarrow \text{Recommend} \longrightarrow \text{Coordinate} \longrightarrow \text{Track} \longrightarrow \text{Notify}$$

### The 5 Core Farmer Answers:
1. **When should I go?** — Personalized departure window based on real-time center processing rate and GPS distance.
2. **Where should I go?** — Smart Recommendation engine evaluates queue lengths, capacity, and distance to pick the optimal center.
3. **How long will I wait?** — Live queue position with real-time ETA calculation.
4. **What is happening with my produce?** — 7-stage transparent physical timeline (Inspection → Grading → Weighing → Verification).
5. **When will I get paid?** — Direct Benefit Transfer (DBT) reconciliation and receipt generation.

---

## 🏛️ Project Structure

```text
SmartProcure/
├── docs/
│   ├── PRD.md                 # UI/UX Specification & SIH Improvements
│   ├── ARCHITECTURE.md        # System Architecture Blueprint (v3.0)
│   └── DESIGN_STYLE.md        # Visual & Design System Style Guide
├── shared/
│   └── types/                 # Universal TypeScript Domain Models & Contracts
├── backend/
│   ├── src/
│   │   ├── config/            # Environment & Supabase configuration
│   │   ├── middleware/        # Auth, RBAC, Error, and Logger middlewares
│   │   ├── modules/           # Modular services (auth, booking, queue, voice...)
│   │   ├── utils/             # Standard API response handlers & logging
│   │   ├── routes.ts          # Master API router
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entrypoint
├── frontend/
│   ├── src/
│   │   ├── app/               # Routes, Providers, API configuration
│   │   ├── components/        # Reusable Design System UI component library
│   │   ├── features/          # Farmer & Officer portal views
│   │   ├── services/          # API Client & service wrappers
│   │   ├── data/              # Typed offline fallback / mock datasets
│   │   ├── index.css          # Tailwind CSS & Design tokens
│   │   └── main.tsx           # React Vite entrypoint
└── supabase/
    ├── schema.sql             # Complete PostgreSQL DDL (14 entities)
    └── seed.sql               # Canonical SIH Demo Seed Data
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v20+)
- npm (v10+)

### 1. Install Dependencies
```bash
# In backend
cd backend
npm install

# In frontend
cd ../frontend
npm install
```

### 2. Run Development Servers
```bash
# Start backend API (Port 5000)
cd backend
npm run dev

# Start frontend Web Application (Port 5173)
cd frontend
npm run dev
```

### 3. Verify Health Check
- Open Backend Health: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- Open Frontend Web App: [http://localhost:5173](http://localhost:5173)

---

## 🎨 Design System Tokens
- **Brand Dark Green**: `#1E5A3A`
- **Primary Green**: `#2E8B57`
- **Light Green Tint**: `#E9F5EE`
- **Mint Accent**: `#D3EDDD`
- **Page Canvas**: `#F5FAF7`
- **Typography**: Inter Sans-Serif
=======
# SmartProcure
>>>>>>> 3d8026ffc2b82a4028c21d6b24a5dcf51e420614
