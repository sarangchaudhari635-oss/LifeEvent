# Domain & Technical Research

**Product:** LifeEvent AI
This document captures the research that justifies LifeEvent AI's design decisions. Sources marked
"verify" should be re-checked with the cited authority before using figures in a public pitch.

---

## 1. Hackathon Context

**Paytm AI Hackathon (Build for India), Pune — PS-2: AI-Powered Financial Journeys.**
The problem statement asks teams to build AI systems that guide users through complex, high-stakes
financial events rather than isolated transactions. Medical emergencies are the archetypal Indian
life event where insurance, lending, and payments collide at the worst possible moment — the
hospital counter. LifeEvent AI's framing (five unanswerable questions at the admission desk) is
taken directly from the root README's problem narrative.

## 2. Indian Health Insurance Mechanics (the rules we encode)

### 2.1 IRDAI Room-Rent Proportional Deduction
- Most health policies cap the daily room rent or room category (e.g., single private room,
  or "2% of sum insured" caps). If the insured occupies a more expensive room, insurers commonly
  apply a **proportional deduction**: associated charges (surgeon fees, diagnostics, nursing) are
  reduced in the ratio of *eligible room rent : actual room rent*, not just the room charge itself.
- LifeEvent AI models the honest, conservative version of this:
  `penalty = max(0, (actual_rent − allowed_rent) × stay_days)`, shown transparently as an assumption
  in the gap range. This is intentionally simpler than full proportional-deduction-on-all-charges,
  and the UI labels it as an estimate pending TPA confirmation.
- Verify current IRDAI health insurance regulations for the exact proportional-deduction wording
  before public claims (source: IRDAI Health Insurance Regulations; "verify").

### 2.2 Non-Payable Consumables
- Hospital bills routinely include 5–15% of non-payable administrative/consumable items (gloves,
  syringes, infusion kits, admission kits, registration). LifeEvent AI uses a flat, disclosed
  **10% of total estimate** (`Clause 4.8` in the synthesized policy pages) — conservative and honest.
- Verify with a real hospital bill sample when piloting (source: hospital billing "non-payable items"
  lists; "verify").

### 2.3 Co-pay & Deductibles
- Policies commonly carry co-pay clauses (10–30% on claims, sometimes mandatory for senior-citizen
  plans). The intake form captures `copay_percent` and the gap calculator applies it to the range.

### 2.4 Cashless Claim Flow & TPA
- Cashless hospitalization runs through the **TPA (Third-Party Administrator)** desk at the hospital:
  pre-authorization request → insurer query cycles → approval/denial. **Query cycles are the #1
  source of delay and rejection anxiety** — which is why the "Living Journey" replans the moment a
  TPA Pre-Auth Query arrives (the `/replan` endpoint and TPA_QUERY_UPDATE_FIXTURE).
- Common query asks: casualty admission records, ECG strips, doctor's notes, itemized estimates —
  mirrored in the demo fixture ("Submit Casualty Admission ECG Strip to Insurance Desk").

## 3. Regulatory: DPDP Act 2023 (India)

- The **Digital Personal Data Protection Act, 2023** governs processing of digital personal data in
  India. Relevant obligations LifeEvent AI commits to in `/privacy`:
  - **Purpose limitation & data minimization** — collect only what the journey needs; discard ID
    images immediately after extraction.
  - **Right to erasure** — the `DELETE /api/journey/{id}` hard-delete endpoint operationalizes this.
  - **Reasonable security safeguards** — masking before storage/log/LLM transit (see §4).
- Note: the prototype processes demo data only; a productized version would need consent managers,
  breach-notification procedures, and possibly Significant Data Fiduciary obligations. Track the
  Draft DPDP Rules for operational specifics ("verify").

## 4. Identity Privacy: the Verhoeff Approach

- **Aadhaar numbers are 12 digits; the 12th digit is a Verhoeff checksum** over the first 11.
  This means a client can mathematically distinguish a real Aadhaar from a random number
  (e.g., phone numbers, policy IDs, or typos) *without any external database*.
- LifeEvent AI's rule (`backend/app/core/security.py`):
  1. Validate with the Verhoeff algorithm (dihedral-5 permutation tables).
  2. If valid → mask to `XXXX-XXXX-1234` (last 4 only) before any log or LLM payload.
  3. If invalid → leave untouched (it isn't an Aadhaar; masking phone numbers would destroy utility).
  4. Raw ID photos are never stored.
- This is a deliberate anti-pattern-avoidance design: naive regex masking would corrupt phone
  numbers and policy codes; UIDAI-compliant masking (last 4 digits) is the accepted display form.
- The `/documents` route ships an interactive Verhoeff playground for judges to verify this live.

## 5. Why "Honest Ranges" Beat "Exact Numbers"

- Any system that outputs a single precise out-of-pocket figure at admission time will be wrong —
  and wrong numbers destroy trust precisely when families can't afford another shock.
- Behavioral research on medical financial distress consistently shows uncertainty amplifies
  stress; a **bounded, assumption-labeled range** (₹1,44,000–₹1,76,000) with a visible formula
  outperforms false precision on trust and actionability.
- Design implication enforced in code: the LLM never computes money; deterministic Python does,
  and the LLM's coverage claims must pass the citation validator or show as unverified.

## 6. Anti-Hallucination Engineering Pattern

- LLMs extracting policy clauses will fabricate plausible-sounding coverage statements.
- Mitigation used here (three layers):
  1. **Deterministic money math** — `gap_calculator.py` owns all rupee figures.
  2. **Citation matching** — `citation_validator.py` requires character-level verbatim match of the
     `evidence_passage` against the extracted `document_pages` text; unmatched claims surface as
     "Unverified" with `likely_covered: 0` (the demo's "Five-Star Luxury Claim / Clause 9.9" is an
     intentional planted hallucination that correctly shows ₹0 covered).
  3. **Dual engine fallback** — Gemini via `google-genai`, with a deterministic fixture shield so
     the product never lies and never dies.
- This pattern generalizes to any regulated-domain AI product (finance, legal, health).

## 7. Competitive / Landscape Notes

| Landscape player | What they do | Gap LifeEvent AI fills |
| :--- | :--- | :--- |
| Insurer apps (HDFC Ergo, Star, Niva Bupa) | Policy servicing, claim status | They serve the insurer's book, not the *family's* cross-domain journey |
| Claims SAAS (Medi Assist, Fidity etc.) | TPA/claim processing ops | Back-office efficiency; no family-facing guidance at the counter |
| Hospital billing desks | Payment collection | No insurance/coverage reasoning at all |
| Generic chatbots | Q&A | No document-verified citations, no honest gap math, no living timeline |

**Positioning:** the only layer that speaks to *all three silos* (insurer policy, hospital estimate,
family's cash needs) with verifiable evidence, at the moment of maximum vulnerability.

## 8. Technical Research: Stack Choices Rationale

- **LangGraph over raw LLM calls:** the journey is a stateful, inspectable pipeline; StateGraph
  makes each stage deterministic, testable (`test_graph.py`), and resumable. Critical when every
  output is auditable.
- **FastAPI + SSE over WebSockets:** agent progress is one-directional; SSE is simpler, proxy-
  friendly, and auto-reconnects.
- **PyMuPDF over OCR services:** policy PDFs in India are frequently text-layer PDFs; page-level
  extraction gives exact character offsets for citation matching without an OCR dependency.
- **slowapi (in-process) over Redis limiter:** right-sized for a single-node demo; swap to
  distributed limiter when multi-instance (tracked in `IMPLEMENTATION_PLAN.md` Phase 5).
- **In-memory store + Supabase fallback:** zero-friction demo boot; Supabase gives Postgres
  durability + RLS when persistence lands (Phase 2 of the plan).

## 9. Open Questions (to resolve with the team)

1. Should room-rent deduction model full proportional-deduction-on-associated-charges in v2?
2. Which funding partners are realistic for the bridge-loan tier (NBFC vs. UPI deposit simulation)?
3. Hospital SaaS pilot pricing validation — is ₹25,000/mo defensible against counselor workload saved?
4. Do we add OCR (scanned-policy images) before PDF-text extraction fails on real documents?
