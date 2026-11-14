# LifeEvent AI: Product Requirements Document (PRD)

**Product Name:** LifeEvent AI  
**Document Version:** 2.0 (Architectural Baseline)  
**Status:** Baseline Approved  
**Category:** AI-Powered Financial Journey Operating System  
**Hackathon:** Paytm AI Hackathon (Build for India) — PS-2: *AI-Powered Financial Journeys*

---

## 1. Problem Statement & Context

In high-stress life events—specifically medical emergencies—families in India are forced to navigate fragmented, adversarial financial systems in a state of cognitive distress. 

At the hospital admission desk, a family attendant is confronted with five critical financial questions:
1. **What does health insurance actually cover?**
2. **Which documents does the Third-Party Administrator (TPA) desk urgently require?**
3. **What is our honest out-of-pocket financial liability?**
4. **Where can we secure emergency bridge financing for the uncovered gap?**
5. **What is our single next best action right now?**

Today, the insurance desk, hospital billing department, and lending partners operate in disconnected silos. Families face delay in emergency care, liquidation of long-term investments at a loss, high-interest borrowing from informal moneylenders, or preventable rejection of cashless claims due to procedural errors.

### Hackathon Alignment (Paytm AI Hackathon PS-2)
LifeEvent AI reimagines customer-facing journeys across Insurance, Lending, and Fintech by acting as a **coordinated financial operating system**. Instead of requiring customers to master insurance policy fine print or apply to multiple disconnected lenders, LifeEvent AI understands their emergency, extracts facts from multimodal documents, computes honest financial liabilities, organizes required tasks, and coordinates financing under customer-controlled approvals.

---

## 2. Product Scope & Journey Focus

The initial scope focuses on the **Medical Emergency Financial Journey**:
- **Life Event Ingestion:** Multilingual voice explanation, insurance policy PDFs, hospital admission estimates, diagnostic reports, and patient identity proofs.
- **Financial Journey Coordination:**
  1. Classify event urgency and medical condition.
  2. Extract structured entities from unstructured documents.
  3. Analyze insurance coverage and exclusions.
  4. Compute honest out-of-pocket gap ranges (incorporating IRDAI room-rent limits, co-pay, non-payables).
  5. Identify missing pre-authorization documentation.
  6. Present verified clause citations from source contracts.
  7. Assemble emergency financing options (Paytm UPI caution deposit, bridge credit).
  8. Enforce customer authorization before any consequential action.
  9. Adapt dynamically to real-time events (e.g., TPA queries, estimate revisions).

---

## 3. User Personas

| Persona | Role | Context & Pain Points | Core Need |
| :--- | :--- | :--- | :--- |
| **P1: Distressed Family Attendant** | Primary User (B2C) | Standing at hospital emergency counter; stressed, low financial literacy; holds physical papers | Immediate clarity on out-of-pocket costs, missing documents, and the single immediate next action in their native language (EN/HI/MR) |
| **P2: Patient** | Beneficiary | Incapacitated during admission triage; vulnerable to privacy breaches | Strict protection of personal data (Aadhaar, medical diagnosis); zero PII exposure |
| **P3: Hospital Financial Counselor** | B2B Operator | Manages 30+ simultaneous patient files; tracks TPA pre-authorization queries | Queue dashboard displaying readiness scores, TPA query status, and estimated resolution timelines |
| **P4: Hospital Administrator / Pilot Lead** | B2B Stakeholder | Evaluates SaaS pilot deployment; focuses on reducing hospital admission friction and bed-block | Auditable, privacy-safe, compliant system reducing average counter clearance time |

---

## 4. Functional Requirements

### 4.1 Multilingual Emergency Intake
- **FR-1.1 `[Implemented]`**: Capture core intake fields: patient name, relation, age, gender, hospital name, city, room category, condition description, urgency level (critical, urgent, standard), and preferred language (English, Hindi, Marathi).
- **FR-1.2 `[Implemented]`**: Provide voice dictation using the Web Speech API with automatic language transcript conversion.
- **FR-1.3 `[Implemented]`**: Provide one-click demo scenario loaders (e.g., Cardiac Emergency at Ruby Hall Clinic, Orthopedic Surgery).
- **FR-1.4 `[Partially Implemented]`**: Ingest optional policy fields (sum insured, allowed room rent, actual room rent, stay days, co-pay percentage).
- **FR-1.5 `[Implemented]`**: Validate Aadhaar number using the mathematical Verhoeff checksum algorithm and mask immediately to `XXXX-XXXX-1234` prior to backend logging or storage.

### 4.2 Living Journey Dashboard
- **FR-2.1 `[Implemented]`**: Display an honest out-of-pocket financial gap range (Low, Expected, High) with explicit mathematical assumptions.
- **FR-2.2 `[Implemented]`**: Pin the dynamic "Next Best Action" prominently at the top of the interface.
- **FR-2.3 `[Partially Implemented]`**: Render an interactive timeline of completed, in-progress, and pending actions across actors (Family, Hospital TPA Desk, Insurer, LifeEvent AI).
- **FR-2.4 `[Implemented]`**: Render an categorized checklist of actionable items (document submission, doctor signature, form completion).
- **FR-2.5 `[Implemented]`**: Provide a live "Re-plan" trigger that simulates the arrival of a TPA Pre-Authorization Query, dynamically injecting urgent tasks and updating the next best action.

### 4.3 Clause-Verified Evidence Inspector
- **FR-3.1 `[Implemented]`**: Itemize coverage findings by expense category (Room Rent, ICU, Nursing, Diagnostics, Consumables) with estimated cost, likely covered amount, and out-of-pocket cost.
- **FR-3.2 `[Implemented]`**: Link every coverage finding to verbatim `evidence_passage`, source document name, page number, and clause reference.
- **FR-3.3 `[Implemented]`**: Strictly mark unsupported or unverified claims as `Unverified` with ₹0 covered (e.g., synthetic luxury room amenity claims).

### 4.4 Emergency Funding & Payment Gateway
- **FR-4.1 `[Demonstrated / Simulated]`**: Present bridge credit options dynamically sized against the computed out-of-pocket gap range.
- **FR-4.2 `[Demonstrated / Simulated]`**: Provide an instant caution deposit flow (~₹50,000) using Paytm UPI intent simulation, explicitly stamped with demo partner disclosures.
- **FR-4.3 `[Planned]`**: Integrate provider abstraction adapters for regulated lending partners (NBFCs/Banks) adhering to RBI Digital Lending Guidelines.

### 4.5 Document Hub & Redaction Engine
- **FR-5.1 `[Implemented]`**: Provide an interactive Verhoeff Aadhaar redactor playground demonstrating instant client/server sanitization.
- **FR-5.2 `[Partially Implemented]`**: Display uploaded documents with analysis status, extracted entities, and verified clause citations.
- **FR-5.3 `[Planned]`**: Support direct-to-storage signed uploads via Supabase Storage private buckets.

### 4.6 Counselor B2B Console
- **FR-6.1 `[Implemented]`**: Provide a queue overview for hospital financial counselors displaying active patient journeys, readiness scores (e.g., "3/7 tasks ready"), and expected gap amounts.
- **FR-6.2 `[Implemented]`**: Monitor active TPA queries and display average resolution estimated turnaround time.

### 4.7 Privacy, Consent & Hard Delete
- **FR-7.1 `[Implemented]`**: Provide a public privacy charter detailing Verhoeff masking, zero raw ID image retention, and data minimization.
- **FR-7.2 `[Implemented]`**: Provide an active hard-delete endpoint (`DELETE /api/journey/{id}`) fulfilling the right to erasure under India's DPDP Act 2023.
- **FR-7.3 `[Planned]`**: Generate cryptographic consent artifacts recorded in an immutable audit ledger upon journey creation.

---

## 5. Non-Functional Requirements (NFRs)

| ID | Requirement | Target Metric | Architectural Enforcement |
| :--- | :--- | :--- | :--- |
| **NFR-1** | **Privacy by Default** | 0 PII leaks in logs or LLM payloads | Verhoeff Aadhaar validation; `sanitize_logs()` on all egress API payloads |
| **NFR-2** | **Data Sovereignty** | 100% DPDP Act 2023 compliance | User-initiated hard delete (`DELETE /api/journey/{id}`); no raw ID photo storage |
| **NFR-3** | **Anti-Hallucination** | 0 ungrounded financial figures | Money math computed deterministically in Python; coverage claims verified against verbatim document strings |
| **NFR-4** | **High Availability** | 99.9% uptime during hackathon judging | Dual-engine architecture: Google Gemini 2.0 with automatic fallback to deterministic fixture shield |
| **NFR-5** | **Abuse Resistance** | 30 requests/min per IP | `slowapi` rate limiting on intake; structured input bounds checking |
| **NFR-6** | **Latency & UX** | < 3 seconds time-to-first-gap | Streaming Server-Sent Events (SSE) for multi-step progress feedback |
| **NFR-7** | **Accessibility** | WCAG 2.1 AA | High-contrast color tokens, keyboard navigation, `prefers-reduced-motion` support |
| **NFR-8** | **Device Support** | Responsive across 390px to 1440px | Tested on Mobile (390×844), Tablet (768×1024), Laptop (1280×800), Desktop (1440×900) |

---

## 6. Regulatory & Compliance Boundaries

1. **IRDAI Health Insurance Regulations:**
   - Proportional room rent deductions must be computed strictly in accordance with policy terms (`actual - allowed` room rent excess factored into associated medical expenses).
   - Standard non-payable consumables (~10% under Clause 4.8 / List I of IRDAI guidelines) must be explicitly segregated from admissible expenses.
2. **RBI Digital Lending Guidelines (2022/2023):**
   - LifeEvent AI operates strictly as a **Lending Service Provider (LSP)** interface.
   - All loan offers are originated by Regulated Entities (REs); no balance sheet lending is conducted directly.
   - Key Fact Statements (KFS) and APR disclosures must be displayed before user consent.
3. **DPDP Act 2023 (Digital Personal Data Protection Act):**
   - Explicit consent notice in specified languages (English, Hindi, Marathi).
   - Immediate hard erasure capability upon user request.

