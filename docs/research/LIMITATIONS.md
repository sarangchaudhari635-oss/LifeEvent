# LifeEvent AI: Known Limitations, Edge Cases & Technical Boundaries

**Document Version:** 2.0  
**Status:** Approved Research Baseline  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Technical & Algorithmic Limitations

To maintain absolute credibility with technical reviewers and enterprise partners, LifeEvent AI explicitly documents its current technical boundaries:

### 1.1 Severely Degraded or Cursive Handwritten Doctor Prescriptions
- **Limitation:** While Gemini 2.0 Vision demonstrates exceptional OCR on printed invoices, scanned policy schedules, and typed admission notes, **heavily degraded cursive handwriting by emergency doctors** remains an industry-wide challenge.
- **System Defense:** When handwriting recognition confidence falls below 0.70, the system does not guess. It assigns `needs_review` state to the task and prompts the attendant or hospital counselor to confirm the medication or diagnosis name manually.

### 1.2 Multi-Policy Coordination of Benefits (Cross-Policy Claim Splitting)
- **Limitation:** A small percentage of Indian patients hold two concurrent health policies (e.g., a corporate mediclaim policy + a personal top-up policy). In such cases, claiming involves submitting the primary settlement letter to the secondary insurer.
- **Current Scope:** The hackathon MVP models a single primary policy journey. Multi-policy coordination of benefits is architected for Phase 3 roadmap development.

### 1.3 Hospital Basement Network Deadzones
- **Limitation:** Emergency triage counters and casualty wards in older Indian hospitals are frequently located in basements with poor cellular reception.
- **System Defense:**
  - Client-side Web Speech API runs locally in browser memory without requiring constant cloud streaming.
  - Next.js service workers cache UI assets offline.
  - Resilient SSE listeners automatically reconnect with exponential backoff when the attendant moves to an area with connectivity.

---

## 2. Regulatory & Legal Boundaries

1. **Never Guarantee Claim Approval:**  
   LifeEvent AI models honest expected coverage based on contractual clauses. However, final claim adjudication remains the statutory prerogative of the insurance company's medical underwriters. The system displays explicit disclaimers:  
   > *"Calculations represent estimated out-of-pocket gap ranges based on contractual policy clauses and IRDAI deduction formulas. Final claim settlement is subject to TPA medical audit."*
2. **Never Guarantee Loan Eligibility:**  
   Pre-qualified bridge credit offers are indicative terms provided by partner NBFCs. Final sanction is subject to lender credit policy and bureau underwriting.
3. **Never Disburse Funds Without Direct Consent:**  
   The platform enforces a mandatory Customer Approval Gateway on all consequential actions.

