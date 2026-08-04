# AI-Powered Customer Complaint Management System (Pharma QMS)

An intelligent, regulatory-compliant Quality Management System (QMS) copilot designed for pharmaceutical manufacturing, biotechnology, and medical device organizations. Built to streamline customer complaint intake, automated document extraction, ICH Q9 quality risk assessment, vector-based duplicate detection, and automated 5-Whys CAPA (Corrective and Preventive Action) remediation workflows in compliance with **FDA 21 CFR Part 211.198**, **21 CFR Part 11**, and **ICH Q9 Quality Risk Management**.

---

## 🌟 Key Features & Functional Modules

### 1. 📥 Multi-Source Complaint Ingestion & Automated Extraction
- **Flexible Data Intake**: Paste unstructured complaint transcripts, customer emails, hospital QA reports, or load standard pre-configured sample complaints (e.g., Sub-visible Particulate Matter in Ceftriaxone, Discoloration in Amoxicillin, Stopper Coring in Propofol).
- **Automated Field Extraction**: Utilizes Gemini AI models to instantly parse complex clinical narratives into structured GxP metadata (Product Name, Dosage/Strength, Batch/Lot Number, Manufacturing & Expiration Dates, Quantity Affected, Defect Type, Initial Severity, and Detailed Description).
- **Completeness Checker**: Evaluates ingested data against mandatory 21 CFR § 211.198 regulatory criteria, scoring field completeness and highlighting missing compliance parameters.

### 2. 🛡️ ICH Q9 Quality Risk Assessment Copilot
- **RPN Matrix Calculation**: Automatically computes Risk Priority Numbers ($RPN = \text{Severity} \times \text{Occurrence} \times \text{Detectability}$) on a standardized 1–125 scale.
- **Patient Safety Impact**: Assesses health hazard severity (e.g., vascular occlusion, sub-therapeutic dosing, microbiological contamination).
- **Regulatory Reporting Deadlines**: Flags requirements for mandatory FDA 15-Day Field Alert Reports (FAR under 21 CFR 314.81), MedWatch (Form 3500A), or Class I/II recall notifications.
- **Recommended Immediate Actions**: Outlines containment protocols, warehouse quarantine holds, and batch retention sample visual inspection guidelines.

### 3. 🔁 Semantic Duplicate & Recurring Defect Detection
- **Cross-Facility Search**: Performs similarity matching across historical complaints to detect recurring batch anomalies, multi-hospital reports, or systematic packaging/formulation defects.
- **Similarity Scoring**: Computes similarity percentages and surfaces previous investigation outcomes and CAPA links.

### 4. 🛠️ Automated 5-Whys Root Cause & CAPA Remediation Engine
- **5-Whys Causal Decomposition**: Constructs rigorous 5-step iterative causal paths from physical defect manifestation down to systemic root causes (e.g., supplier material degradation, preventive maintenance lapses, calibration drift).
- **Immediate Containment Actions**: Formulates quarantine steps, inventory freezes, and batch tracking controls.
- **Corrective & Preventive Action (CAPA) Table**: Generates actionable task tables with department ownership, target deadlines, and verification methods.
- **90-Day Effectiveness Criteria**: Pre-populates measurable criteria for post-remediation effectiveness checks.
- **21 CFR Part 11 Electronic Sign-off**: Provides QA approval toggle with audit logging and timestamping.
- **Dynamic Plan Regeneration**: Recalculates and updates the entire CAPA and 5-Whys plan dynamically based on revised complaint inputs.

### 5. 📋 Auditable QMS Complaints Database
- **Centralized QMS Repository**: Stores historical and active complaint files with unique tracking numbers (e.g., `QMS-2026-0814`).
- **Interactive Search & Severity Filtering**: Filter records by Critical, Major, or Minor severity, product title, or batch/lot ID.
- **One-Click Record Loading**: Instantly load any logged record back into the intake and CAPA views.

### 6. 🏗️ Architecture & LangGraph Agent Pipeline Visualizer
- **Interactive Graph Trace**: Visualizes multi-agent state nodes (`Extraction_Node` → `Validation_Node` → `Risk_Assessment_Node` → `Duplicate_Search_Node` → `CAPA_Generator_Node`).
- **Inspection Metrics**: Inspect node payloads, execution runtimes, and prompt payloads.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Redux Toolkit, Tailwind CSS v4, Lucide Icons, Motion |
| **Backend & API** | Node.js, Express, TypeScript (`tsx`), `@google/genai` (Google Gen AI SDK) |
| **AI / LLM Engine** | Gemini 2.5 Flash / Pro (Server-side proxy architecture) |
| **Python Architecture Blueprint** | FastAPI, LangGraph, Pydantic, Uvicorn (located in `/backend`) |
| **Compliance Standards** | FDA 21 CFR Part 211.198, 21 CFR Part 11, ICH Q9 Quality Risk Management |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **bun** / **yarn**
- **Gemini API Key** (set via environment variable)

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The development server will run on `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Project Structure

```text
├── .env.example              # Environment variables template
├── metadata.json             # Applet metadata and permissions
├── package.json              # Project dependencies and build scripts
├── server.ts                 # Full-stack Express server with Gemini API endpoints
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration with Tailwind CSS plugin
├── backend/                  # Python FastAPI & LangGraph agent blueprint
│   ├── agent/                # LangGraph state nodes and workflow graph
│   ├── main.py               # FastAPI entry point
│   ├── models.py             # Pydantic schemas for complaints and CAPA
│   └── requirements.txt      # Python dependencies
└── src/                      # React frontend source code
    ├── App.tsx               # Main application component & tab switcher
    ├── index.css             # Tailwind CSS imports and theme configuration
    ├── main.tsx              # React entry point
    ├── components/           # Modular UI components
    │   ├── ArchitectureDiagram.tsx       # Interactive agent graph & system architecture
    │   ├── CapaRemediationView.tsx       # 5-Whys root cause, CAPA table, & regeneration
    │   ├── ComplaintForm.tsx             # Structured complaint input & edit form
    │   ├── CompletenessCheckerModal.tsx  # 21 CFR completeness scoring modal
    │   ├── DuplicateDetectionModal.tsx   # Historical duplicate search modal
    │   ├── Header.tsx                    # Top navigation, status indicator, & reset
    │   ├── IntakeAssistant.tsx           # Document ingestion, sample loader, & metrics
    │   ├── LoggedComplaintsTable.tsx     # Searchable QMS complaint records audit table
    │   └── RiskAssessmentCard.tsx        # ICH Q9 RPN matrix & regulatory reporting modal
    ├── data/
    │   └── sampleComplaints.ts           # Pre-configured pharmaceutical complaint templates
    ├── store/
    │   ├── agentSlice.ts                 # Redux state for node traces and agent telemetry
    │   ├── complaintSlice.ts             # Redux state for complaints, CAPA, & async thunks
    │   └── store.ts                      # Redux store configuration
    └── types/
        └── complaint.ts                  # TypeScript interfaces and GxP data models
```

---

## 📡 API Endpoints Reference

All API calls are proxied through the server to ensure API keys remain secure on the server side:

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Service health check and status verification. |
| `/api/extract` | `POST` | Ingests complaint text/document, extracts structured metadata, runs completeness checks, and computes initial risk assessment. |
| `/api/v1/complaints/process` | `POST` | Comprehensive LangGraph-style complaint pipeline execution endpoint. |
| `/api/risk-assessment` | `POST` | Computes ICH Q9 Severity, Occurrence, Detectability, RPN score, and FAR reporting necessity. |
| `/api/duplicates` | `POST` | Searches historical database for duplicate batch anomalies or recurring defects. |
| `/api/v1/complaints/capa-recommend` | `POST` | Generates 5-Whys Root Cause Analysis, Containment Steps, Corrective/Preventive actions, and 90-day effectiveness criteria. |
| `/api/capa-recommendation` | `POST` | Alias endpoint for dynamic CAPA generation and regeneration. |
| `/api/feedback` | `POST` | Ingests user ratings and corrections for continuous agent improvement. |

---

## 📜 Regulatory & Compliance Notes

- **21 CFR Part 211.198 (Complaint Files)**: Written procedures describing the handling of all written and oral complaints regarding a drug product.
- **21 CFR Part 11 (Electronic Records; Electronic Signatures)**: Audit trails, user attribution, and QA sign-off verifications.
- **ICH Q9 (Quality Risk Management)**: Standardized risk ranking and filtering methodology using Severity, Occurrence, and Detectability metrics.
