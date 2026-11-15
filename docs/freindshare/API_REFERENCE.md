# API Reference

**Base URL:** `http://localhost:8000` · **App:** FastAPI v1.0.0 (`backend/app/main.py`)
Interactive docs while running: `/docs` (Swagger) and `/redoc`.

All journey-returning responses pass through `sanitize_logs()` before leaving the server.

---

## Endpoints

| Method | Path | Rate limit | Purpose |
| :--- | :--- | :--- | :--- |
| GET | `/api/health` | — | Liveness + journey count |
| POST | `/api/journey/intake` | 30/min | Create a living journey |
| GET | `/api/journey/{journey_id}` | — | Fetch a journey |
| POST | `/api/journey/{journey_id}/replan` | — | Simulate TPA query → live re-plan |
| DELETE | `/api/journey/{journey_id}` | — | Hard delete (DPDP erasure) |
| GET | `/api/journey/{journey_id}/stream` | — | SSE agent progress stream |
| GET | `/api/counselor/journeys` | — | B2B counselor queue summary |
| POST | `/api/pilot-request` | — | B2B lead capture |

---

## GET /api/health

```json
{ "status": "healthy", "service": "LifeEvent AI API", "timestamp": "2026-11-14T10:00:00.000000", "active_journeys": 2 }
```

## POST /api/journey/intake

**Rate limit:** 30 requests/minute per IP (slowapi). Exceeding returns `429`.
**Mode switch:** `is_demo: true` **and** "sample" in `hospital_name` or `patient_name` → runs the
cardiac fixture path. Otherwise the live pipeline runs (document synthesis, masking, coverage claims).

### Request body (`LifeEventIntake` — `backend/app/models/schemas.py`)

| Field | Type | Default | Notes |
| :--- | :--- | :--- | :--- |
| `patient_name` **\*** | str | — | Required |
| `relation` | str | `"father"` | Relation to patient |
| `age` | int? | 55 | |
| `gender` | str? | `"Male"` | |
| `hospital_name` **\*** | str | — | Required |
| `city` | str | `"Pune"` | |
| `room_category` | str? | `"ICU"` | ICU / Single Private AC / Twin Sharing / General Ward |
| `condition_description` **\*** | str | — | Required |
| `urgency` | str | `"urgent"` | critical / urgent / standard |
| `language` | str | `"en"` | en / hi / mr |
| `known_insurer` | str? | `"Sample Health Insurance Co."` | |
| `policy_number` | str? | null | |
| `sum_insured` | float? | 500000 | INR |
| `room_rent_cap_type` | str? | `"1% of Sum Insured (₹5,000/day)"` | |
| `allowed_room_rent` | float? | 5000 | per day, INR |
| `actual_room_rent` | float? | 8500 | per day, INR |
| `stay_days` | int? | 4 | |
| `copay_percent` | float? | 0 | 0–100 |
| `emergency_contact` | str? | null | Phone number |
| `aadhaar_number` | str? | null | **Verhoeff-validated then masked** to `XXXX-XXXX-1234` |
| `policy_photo_name` / `estimate_photo_name` | str? | null | Filenames |
| `policy_photo_preview` / `estimate_photo_preview` | str? | null | Base64 previews (transient — see Security Audit B3) |
| `estimated_amount` | float? | null | Hospital estimate, INR (falls back to 350000) |
| `is_demo` | bool | false | |

### Example

```http
POST /api/journey/intake
Content-Type: application/json

{
  "patient_name": "Ramesh Kumar",
  "relation": "father",
  "hospital_name": "Ruby Hall Clinic",
  "condition_description": "Acute myocardial infarction, emergency angioplasty",
  "urgency": "critical",
  "estimated_amount": 420000,
  "allowed_room_rent": 5000,
  "actual_room_rent": 8500,
  "stay_days": 4,
  "sum_insured": 500000,
  "copay_percent": 10,
  "aadhaar_number": "234123412346"
}
```

### Response: the full `LivingJourney` object (sanitized)

```json
{
  "id": "journey-1731567600",
  "created_at": "2026-11-14T10:00:00.000000",
  "intake": { "...": "echo of the intake, aadhaar masked" },
  "documents": [
    { "name": "Sample Health Insurance Co._Policy_Schedule.pdf", "type": "health_policy", "status": "Uploaded & Analyzed" },
    { "name": "Ruby Hall Clinic_PreAuth_Estimate.pdf", "type": "hospital_estimate", "status": "Uploaded & Analyzed" },
    { "name": "Aadhaar_1234_Masked.pdf", "type": "id_proof", "status": "Verhoeff Redacted" }
  ],
  "document_pages": { "<doc name>": { "1": "...", "2": "...", "3": "..." } },
  "coverage_findings": [
    {
      "category": "Room Rent & Nursing Expenses",
      "estimated_cost": 34000.0, "likely_covered": 20000.0, "out_of_pocket": 14000.0,
      "confidence": "High",
      "evidence_doc": "...Policy_Schedule.pdf", "evidence_page": 2,
      "evidence_passage": "The company indemnifies room and nursing expenses up to a maximum of INR 5,000 per day.",
      "clause_ref": "Section 2.1"
    }
  ],
  "gap": {
    "total_estimate": 420000.0,
    "likely_covered_base": 320400.0,
    "gap_low": 87600.0, "gap_expected": 99600.0, "gap_high": 120600.0,
    "confidence": "Needs TPA Confirmation",
    "assumptions": [ "Estimated non-medical consumables ... ₹42,000", "Room rent exceeded ... ₹49,350", "Policy mandates 10% co-payment ... ₹32,040" ],
    "room_rent_proportional_deduction": 49350.0,
    "co_pay_amount": 32040.0,
    "non_payable_consumables": 42000.0,
    "remaining_sum_insured": 500000.0
  },
  "checklist": [ { "id": "...", "title": "...", "category": "document_required", "status": "pending", "is_critical": true } ],
  "funding_options": [ { "provider": "...", "badge": "Demo Partner, illustrative terms, not a real offer", "type": "emergency_credit", "amount": 50000.0 } ],
  "timeline_events": [ { "title": "...", "actor": "Family", "status": "completed" } ],
  "current_stage": "funding",
  "next_best_action": "Submit Ramesh Kumar's Aadhaar & Doctor Signature to Ruby Hall Clinic Insurance Desk (Counter #4)",
  "is_demo": false
}
```

**Errors:** `422` schema violation · `429` rate limited.

## GET /api/journey/{journey_id}

Returns the sanitized journey. `404 { "detail": "Journey not found" }` when unknown.
Known demo ids: `demo-journey-cardiac-01`, `demo-journey-ortho-02`.

## POST /api/journey/{journey_id}/replan

Simulates the arrival of a **TPA Pre-Auth Query**. Mutates the stored journey:
- Appends the TPA query document
- **Prepends** urgent checklist tasks
- Appends a timeline event (`actor: "Insurer TPA Desk"`, `status: "in_progress"`)
- Sets `next_best_action = "URGENT: Submit Casualty Admission ECG Strip to Insurance Desk"`
- Sets `current_stage = "tpa_query_pending"`

Unknown ids silently fall back to the cardiac demo journey (see Security Audit A5).

## DELETE /api/journey/{journey_id}

Hard delete of the journey and all related data.

```json
{ "status": "success", "message": "Journey journey-1731567600 and all related files permanently deleted." }
```

Missing id returns success too (idempotent erasure — intentional for DPDP).

## GET /api/journey/{journey_id}/stream

**Server-Sent Events.** Seven agent steps, ~0.4s apart:

```
data: {"step": "intake",    "message": "Recording life event details & masking Aadhaar identifiers...", "timestamp": "..."}
data: {"step": "document",  "message": "Parsing hospital admission estimate line-by-line...", ...}
data: {"step": "coverage",  "message": "Matching policy clauses with verified citation quotes...", ...}
data: {"step": "gap",       "message": "Modeling room-rent proportional deduction & out-of-pocket range...", ...}
data: {"step": "checklist", "message": "Generating generic pre-authorization action plan...", ...}
data: {"step": "funding",   "message": "Compiling emergency medical credit & payment options...", ...}
data: {"step": "complete",  "message": "Living financial journey active.", ...}
```

## GET /api/counselor/journeys

B2B queue summary — one row per active journey:

```json
[{
  "id": "demo-journey-cardiac-01",
  "patient_name": "...", "relation": "father", "hospital_name": "...",
  "urgency": "urgent",
  "total_estimate": 420000.0, "gap_expected": 99600.0,
  "confidence": "Needs TPA Confirmation",
  "current_stage": "tpa_query_pending",
  "tasks_done": 3, "tasks_total": 7,
  "readiness_score": "3/7 tasks ready",
  "next_action": "URGENT: Submit Casualty Admission ECG Strip to Insurance Desk"
}]
```

## POST /api/pilot-request

Accepts any JSON object (⚠️ unvalidated — see Security Audit A6), stamps `created_at`, stores it.

```json
{ "hospital": "Ruby Hall Clinic", "contact": "...", "city": "Pune" }
→ { "status": "success", "message": "Pilot request received. Our team will contact you within 24 hours." }
```

---

## Data Models (`backend/app/models/schemas.py`)

- `LifeEventIntake` — full request schema above
- `CoverageClaim` — category, costs, `confidence` (High/Medium/Needs TPA Confirmation), `evidence_doc/page/passage`, `clause_ref`, `is_verified`
- `GapBreakdown` — range fields (`gap_low/expected/high`), `assumptions[]`, deduction components
- `ChecklistItem` — `category` (document_required/pre_auth/hospital_task/funding_step), `status` (pending/ready/submitted/approved), `is_critical`
- `FundingOffer` — `badge: "Demo Partner, illustrative terms, not a real offer"`, type (zero_cost_emi/emergency_credit/tpa_advance), EMI fields
- `TimelineEvent` — `actor` (Family/Hospital TPA/Insurer/LifeEvent AI), `status` (completed/in_progress/pending)
- `LivingJourney` — the aggregate root

## Gap Math Reference (`backend/app/core/gap_calculator.py`)

```
non_payables      = 10% × total_estimate
admissible_base   = total_estimate − non_payables
room_deduction    = direct_excess + 0.5 × associated_loss   (only if actual > allowed rent)
covered_before_copay = min(admissible_base − room_deduction, remaining_sum_insured)
co_pay            = co_pay% × covered_before_copay
gap_expected      = total_estimate − (covered_before_copay − co_pay)
gap_low           = gap_expected − 30% of non_payables − 20% of room_deduction   (optimistic TPA)
gap_high          = gap_expected + 5% of total_estimate                          (strict audit)
confidence        = "Needs TPA Confirmation" if room_deduction > 0 or co_pay > 0
```
