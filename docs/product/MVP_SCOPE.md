# LifeEvent AI: MVP Scope & Hackathon Boundaries

**Document Version:** 2.0  
**Status:** Approved  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System  
**Hackathon:** Paytm AI Hackathon (Build for India)

---

## 1. Executive Summary

This document establishes the precise functional boundaries of the **LifeEvent AI Hackathon MVP**. It explicitly defines what is in scope, what is simulated, and what is deferred to post-hackathon phases, ensuring total transparency with hackathon judges and technical evaluators.

---

## 2. In-Scope vs Simulated vs Out-of-Scope Matrix

| Functional Domain | In-Scope (Implemented & Demonstrated) | Simulated for Demo | Out-of-Scope (Deferred to Roadmap) |
| :--- | :--- | :--- | :--- |
| **Life Event Intake** | Multilingual voice (Web Speech API) in EN/HI/MR; structured emergency form; one-click cardiac & orthopedic scenarios; Aadhaar Verhoeff validation & masking | Synthetic patient identities and pre-loaded document sets | Non-medical life events (education, bereavement, home purchase) |
| **Document Intelligence** | PyMuPDF page-level text extraction; Gemini 2.0 multimodal prompt extraction; verbatim passage matching | Synthetic policy schedules and hospital estimates | Live OCR on heavily degraded handwritten doctor prescriptions |
| **Gap Calculation** | Deterministic Python calculation of IRDAI room-rent proportional deduction, 10% non-payables, and co-payment; Low–Expected–High range bounds | None (math is real and executable) | Complex multi-policy coordination of benefits (cross-policy claim splitting) |
| **Living Journey Dashboard** | Dynamic checklist; living timeline; pinned next best action; Server-Sent Events (SSE) streaming updates | In-memory journey store (`JOURNEY_STORE`) for zero-friction demo | Multi-tenant hospital role-based permission tiers |
| **Dynamic Re-planning** | Triggering TPA Pre-Auth Query via `POST /replan`; prepending urgent tasks; live state mutation | Pre-configured TPA query fixture (`TPA_Query_Query1_ECG.pdf`) | Direct bidirectional HL7 FHIR connection to insurer core claim systems |
| **Emergency Financing** | Sizing bridge credit offers to gap range; caution deposit workflow UI | Paytm UPI instant ₹50,000 deposit; partner NBFC credit terms | Real monetary disbursement or live UPI mandate registration |
| **Trust & Security** | Verhoeff Aadhaar masking; `sanitize_logs()` on all responses; one-click DPDP hard delete (`DELETE /api/journey/{id}`) | Synthetic Aadhaar numbers in demo fixtures | Production Hardware Security Module (HSM) key management |
| **B2B Operations** | Counselor console queue (`/counselor`); readiness scoring; B2B pilot request lead capture (`/for-hospitals`) | In-memory lead persistence | Hospital Information System (HIS) bi-directional HL7 integration |

---

## 3. Strict Boundary Rules for Evaluation

1. **No Real Money Movement:**  
   The funding module demonstrates how emergency credit and caution deposit workflows integrate into the living journey. It utilizes **simulated provider interfaces** clearly labeled with demo disclaimers. No actual monetary transactions, banking credentials, or credit bureau pulls take place.
2. **No Secret or Proprietary API Dependencies:**  
   The system runs reliably on standard, publicly documented APIs (Google Gemini API) with a deterministic fixture fallback shield to guarantee 100% demo availability even in poor network conditions.
3. **Synthetic PII Only:**  
   All patient names, hospital estimates, and Aadhaar numbers used in demo scenarios are strictly synthetic. No real citizen data is included in fixtures or logs.
4. **Deterministic Gap Math:**  
   All rupee figures are computed using deterministic Python algorithms. The LLM is never permitted to generate or modify monetary liabilities.

