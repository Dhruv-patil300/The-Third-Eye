# 👁️ The Third Eye

> **AI-Powered Investigation Intelligence & Case Analysis Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Overview

**The Third Eye** is a cutting-edge forensic and investigation intelligence platform designed for law enforcement, investigative journalists, legal teams, and corporate compliance officers. It ingests complex multi-source evidence, extracts key entities and timelines, visualizes relational networks, highlights testimony contradictions, and identifies critical investigative gaps using state-of-the-art AI.

---

## ✨ Core Features

### 🗂️ Case Portfolio & Management
- Multi-case dossier tracking with risk profiling, lead assignment, and classification tiers (*Critical*, *Active*, *Cold*, *Closed*).
- Live dashboard telemetry: evidence ingestion counts, suspect associations, contradiction alerts, and unsolved gaps.

### 📄 Multi-Modal Evidence Vault
- Automated parser for documents (PDF, DOCX, TXT), images, CCTV records, phone extractions, and witness statements.
- Entity extraction with confidence scores, chain of custody tracking, and tamper-resistant audit metadata.

### 🕸️ Interactive Entity Knowledge Graph
- Visual relational network powered by `@xyflow/react`.
- Entity nodes representing Suspects, Victims, Witnesses, Locations, Vehicles, Financial Accounts, and Organizations.
- Dynamic link weighting, clustering, and path analysis between disconnected actors.

### ⏱️ Chronological Timeline Reconstruction
- Comprehensive sequence-of-events visualization with filtering by participant, location, and verified timestamps.
- Flags temporal anomalies, impossible travel, and alibi conflicts.

### ⚠️ Automated Contradiction Spotter
- Cross-references witness testimonies, interrogations, and forensic logs to spotlight conflicting statements and irreconcilable timelines.
- Assigns severity scores to discrepancies for rapid trial preparation and interrogation planning.

### 🔍 Investigation Gap Analysis & Recommendations
- AI-driven discovery of missing evidence, unverified alibis, and pending subpoena requests.
- Prioritized action checklists to guide lead detectives toward high-leverage investigative steps.

### 🤖 AI Investigation Assistant
- Context-aware forensic copilot capable of querying the full case record.
- Supports offline local deterministic reasoning engine, with pluggable support for Google Gemini and OpenAI.

### 📑 Executive & Court-Ready Report Generator
- 1-click synthesis of executive case summaries, suspect profiles, timelines, and evidentiary exhibits into structured reports.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Glassmorphism
- **Graph Visualization**: [`@xyflow/react`](https://reactflow.dev/)
- **Charts & Telemetry**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Document Processing**: `pdf-parse`, `mammoth`
- **Data Persistence**: Relational file store engine (`data/storage.json`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18.x` or higher
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dhruv-patil300/The-Third-Eye.git
   cd The-Third-Eye
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   ```bash
   cp .env.example .env.local
   ```
   *By default, The Third Eye runs with a built-in offline local deterministic intelligence engine. You may optionally configure `GEMINI_API_KEY` or `OPENAI_API_KEY` in `.env.local`.*

4. **Launch development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
The-Third-Eye/
├── data/
│   └── storage.json            # Seed database & persistent entity store
├── src/
│   ├── app/                    # Next.js App Router endpoints & views
│   │   ├── api/                # REST API routes (cases, evidence, AI, graph)
│   │   ├── assistant/          # AI Forensic Assistant
│   │   ├── cases/              # Case dossier management
│   │   ├── contradictions/     # Contradiction detection engine
│   │   ├── evidence/           # Evidence repository
│   │   ├── gaps/               # Gap analysis
│   │   ├── graph/              # Entity relationship graph
│   │   ├── reports/            # Report builder
│   │   ├── settings/           # Configuration & provider keys
│   │   ├── timeline/           # Chronological timeline
│   │   ├── globals.css         # Global styling & theme tokens
│   │   ├── layout.tsx          # Root shell layout
│   │   └── page.tsx            # Main intelligence dashboard
│   ├── components/             # Reusable UI widgets & modals
│   ├── context/                # Global React application state
│   ├── lib/                    # Storage, parsers, and AI utilities
│   └── types/                  # TypeScript data contracts & models
├── .env.example                # Sample environment configuration
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔒 Security & Privacy

The Third Eye is designed with an offline-first architecture. Case files and evidentiary records remain stored strictly within your secure environment or self-hosted deployment.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
