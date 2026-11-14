# Product Requirements Document (PRD)

**Product:** LifeEvent AI
**Version:** 1.0 · **Status:** Prototype shipped · **Owner:** Team Crazy Coders
**Context:** Paytm AI Hackathon (Build for India), Pune — Problem Statement PS-2: *AI-Powered Financial Journeys*

---

## 1. Problem Statement

When a patient is rushed into emergency triage, they cannot speak. The family attendant at the
admission desk is hit with five high-stakes financial questions they cannot answer:

1. **What does insurance cover?**
2. **Which documents does the hospital TPA desk urgently require?**
3. **How much out-of-pocket money must our family arrange?**
4. **Where can we get financial help if there is a gap?**
5. **What is our single next best action right now?**

Insurance desks, lending partners, and hospital payment counters operate in isolated silos.
Families resort to desperate calls, liquidating savings, or suffering avoidable cashless claim
rejections.

## 2. Vision

One guided, living, evidence-backed financial journey that unifies the emergency:
`Speak Situation ➔ Understand Evidence ➔ Connect Financial Dots ➔ Guided Living Journey ➔ Pay with Confidence`

## 3. Target Users

| User | Context | Core need |
| :--- | :--- | :--- |
| **Family attendant (primary)** | At hospital counter, distressed, low financial literacy | Clarity on coverage, gap, and the immediate next action — in their language |
| **Patient** | Incapacitated during intake | Their identity data (Aadhaar) must never leak |
| **Hospital financial counselor (B2B)** | Handles many patients; needs queue visibility | Readiness of each patient's file, TPA query status, resolution ETA |
| **Hospital admin / insurer pilot lead (B2B)** | Evaluates SaaS pilot | Trustworthy, auditable, privacy-safe product |

## 4. Goals & Non-Goals

### Goals
- G1: Convert unstructured intake (typed or spoken, EN/HI/MR) into a structured life-event journey.
- G2: Produce an **honest range** (Low–Expected–High) of out-of-pocket liability, never a fake exact number.
- G3: Every coverage claim must cite verbatim policy text (page + clause) — anti-hallucination by construction.
- G4: Model Indian-specific realities: IRDAI room-rent proportional deductions, ~10% non-payable consumables, co-pay clauses.
- G5: Zero PII leakage: Verhoeff-validated Aadhaar masking before any log or LLM payload; no raw ID image retention.
- G6: The journey is **living** — new documents (e.g., TPA query) visibly re-plan the timeline.
- G7: 100% availability during judging: deterministic offline fixture fallback if the LLM is unreachable.

### Non-Goals (for prototype scope)
- Real disbursement of loans/UPI deposits (funding flow is simulated and clearly labeled).
- Real insurer/TPA integrations or hospital HIS integrations.
- Regulatory-grade claim filing.
- Non-medical life events (wedding, education) — the architecture generalizes, but scope is medical.

## 5. Functional Requirements

### 5.1 Emergency Intake (`/intake`)
- FR-1.1: Capture patient name, relation, hospital, city, condition, urgency, language (EN/HI/MR).
- FR-1.2: Voice dictation via Web Speech API.
- FR-1.3: One-click sample loaders (cardiac / orthopedic scenarios) for demo.
- FR-1.4: Accept optional policy/estimate document references, Aadhaar number, sum insured, co-pay %, room rent cap vs. actual, stay days.
- FR-1.5: Aadhaar input is validated with the Verhoeff checksum and immediately reduced to `XXXX-XXXX-1234` form.

### 5.2 Living Journey Dashboard (`/journey/[id]`)
- FR-2.1: Show the honest gap range with transparent assumptions listed.
- FR-2.2: Show a pinned "next best action".
- FR-2.3: Timeline events with actor + status; new events stream in (SSE).
- FR-2.4: Checklist with completion state.
- FR-2.5: "Re-plan" trigger simulating a TPA Pre-Auth Query — must visibly insert urgent tasks and update the timeline.

### 5.3 Clause-Verified Evidence Inspector (`/journey/[id]/coverage`)
- FR-3.1: Each coverage line item shows estimated cost, likely covered, out-of-pocket, confidence.
- FR-3.2: Each item links to the verbatim `evidence_passage`, source document, page, and clause ref.
- FR-3.3: Items without verifiable evidence are explicitly labeled unverified (e.g., "Unverified Hospital Five-Star Luxury Claim").

### 5.4 Emergency Funding (`/journey/[id]/funding`)
- FR-4.1: Bridge funding options sized against the computed gap.
- FR-4.2: Simulated instant Paytm UPI deposit (~₹50,000 caution deposit) with transparent "demo partner" labeling.

### 5.5 Document Hub (`/documents`)
- FR-5.1: Interactive Verhoeff Aadhaar redactor playground.
- FR-5.2: List of ingested documents with their redaction/analysis status.

### 5.6 Counselor Console (`/counselor`)
- FR-6.1: Queue of active journeys with patient, hospital, urgency, gap, readiness (tasks done/total).
- FR-6.2: TPA query monitoring and average resolution ETA.

### 5.7 B2B Pilot (`/for-hospitals`)
- FR-7.1: ₹25,000/mo pilot tier proposition.
- FR-7.2: Working trial request form persisted server-side (`POST /api/pilot-request`).

### 5.8 Privacy (`/privacy`)
- FR-8.1: Explain the Verhoeff masking scheme and zero-retention rules.
- FR-8.2: Active hard-delete tool → `DELETE /api/journey/{id}` (DPDP Act compliance charter).

## 6. Non-Functional Requirements

| ID | Requirement | Current implementation |
| :--- | :--- | :--- |
| NFR-1 | **Privacy by default** | Verhoeff masking in `backend/app/core/security.py`; raw ID photos discarded; `sanitize_logs()` on every API response |
| NFR-2 | **DPDP Act 2023** | Hard-delete endpoint; zero-retention charter |
| NFR-3 | **Anti-hallucination** | Citation matcher in `backend/app/core/citation_validator.py`; character-level string matching against document pages |
| NFR-4 | **Availability** | Dual engine: Gemini 2.0 via `google-genai` + deterministic fixture fallback (`backend/app/sample_data/fixtures.py`) |
| NFR-5 | **Abuse resistance** | slowapi rate limiting (30/min on intake) keyed by remote address |
| NFR-6 | **Responsiveness** | Verified at 1440/1280/768/390 viewports (see `screenshots/`) |
| NFR-7 | **Accessibility** | Semantic HTML, reduced-motion support |
| NFR-8 | **Testability** | 12 pytest suites covering Aadhaar masking, citations, gap math, graph, hard delete |

## 7. Acceptance Criteria (per demo journey)

- [ ] A cardiac demo journey loads pre-populated at `/journey/demo-journey-cardiac-01`.
- [ ] Gap shows as a range (e.g., ₹1,44,000–₹1,76,000), not a single number.
- [ ] Room-rent penalty math: `max(0, (actual − allowed) × stay_days)` is visible in assumptions.
- [ ] Non-payables computed at 10% of estimate.
- [ ] Every covered line has a matching verbatim passage; the fabricated "Clause 9.9" luxury claim shows **0 covered**.
- [ ] Aadhaar `XXXXXXXX1234` — valid 12-digit Verhoeff only; phone numbers and policy numbers untouched.
- [ ] `POST /replan` inserts "URGENT: Submit Casualty Admission ECG Strip…" and updates stage to `tpa_query_pending`.
- [ ] `DELETE /api/journey/{id}` removes all data and subsequent `GET` returns 404.
- [ ] `python -m pytest backend/tests` → 12 passed.

## 8. Success Metrics (post-hackathon, if productized)

- Time-to-clarity at counter: < 3 minutes from first spoken sentence to gap range shown.
- % of coverage claims with verified citations: target 100%.
- Cashless rejection avoidance rate in pilot hospitals.
- Zero PII incidents in audits.

## 9. Risks & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| LLM hallucinated figures | Deterministic calculators for money math; LLM only for language understanding; citation validator rejects unmatched claims |
| Network failure during judging | Offline fixture shield (dual engine) |
| PII exposure | Verhoeff masking + `sanitize_logs` + no raw image retention + hard delete |
| Over-trust in demo numbers | "Demo partner" / sample-data labeling throughout UI |
