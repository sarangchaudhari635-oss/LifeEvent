# LifeEvent AI: REST & SSE API Specification

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Base URL:** `http://localhost:8000/api` (Staging: `https://api.staging.lifeevent.ai/api`)  
**Security:** Supabase Auth JWT (`Authorization: Bearer <token>`) & `slowapi` Rate Limiting

---

## 1. Endpoint Summary Matrix

| Method | Path | Auth Required | Rate Limit | Purpose |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/health` | No | — | Service liveness, readiness, active journey counters |
| `POST` | `/journey/intake` | Optional (Demo) / Yes (Prod) | 30/min | Ingests emergency context, creates living journey, runs pipeline |
| `GET` | `/journey/{id}` | Yes | 60/min | Retrieves full sanitized living journey aggregate |
| `POST` | `/journey/{id}/replan` | Yes | 30/min | Simulates/ingests TPA query, mutates DAG tasks, updates next action |
| `DELETE` | `/journey/{id}` | Yes | 10/min | Permanent hard erasure of all journey data (DPDP Act compliance) |
| `GET` | `/journey/{id}/stream` | Yes | 10 conns | Server-Sent Events (SSE) stream of real-time pipeline progress |
| `POST` | `/journey/{id}/documents/upload-url` | Yes | 30/min | Generates 15-min presigned S3 upload URL for private document bucket |
| `POST` | `/journey/{id}/tasks/{task_id}/approve` | Yes | 20/min | Customer Approval Gateway: authorizes consequential financial action |
| `GET` | `/counselor/journeys` | Yes (Role: Counselor) | 60/min | B2B queue overview: patient journeys, readiness scores, TPA queries |
| `POST` | `/pilot-request` | No | 10/min | Captures B2B hospital pilot trial requests |

---

## 2. Authentication & Common Headers

- **`Authorization`**: `Bearer <supabase_jwt>` (Required for all protected routes).
- **`Idempotency-Key`**: `<uuid-v4>` (Required for mutating consequential endpoints).
- **`Content-Type`**: `application/json`.
- **Output Sanitization Guarantee**: All responses pass through `sanitize_logs()`; any 12-digit number passing the Verhoeff checksum is masked to `XXXX-XXXX-1234`.

---

## 3. Detailed Endpoint Contracts

### 3.1 `GET /api/health`
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "LifeEvent AI Core API",
  "version": "2.0.0",
  "timestamp": "2026-11-14T10:00:00.000000Z",
  "active_journeys": 2,
  "engine_status": {
    "gemini_api": "connected",
    "supabase_db": "connected",
    "fixture_shield": "standby"
  }
}
```

---

### 3.2 `POST /api/journey/intake`
- **Headers**: `Idempotency-Key: 7b29a8f4-6e1c-4b3d-9f2e-0a1c2d3e4f5a`
- **Request Body (`LifeEventIntake`)**:
```json
{
  "patient_name": "Ramesh Sharma",
  "relation": "father",
  "age": 58,
  "gender": "Male",
  "hospital_name": "Ruby Hall Clinic",
  "city": "Pune",
  "room_category": "ICU",
  "condition_description": "Severe chest pain, diagnosed with acute myocardial infarction, emergency angioplasty recommended.",
  "urgency": "critical",
  "language": "hi",
  "estimated_amount": 420000.0,
  "allowed_room_rent": 5000.0,
  "actual_room_rent": 8500.0,
  "stay_days": 4,
  "sum_insured": 500000.0,
  "copay_percent": 10.0,
  "aadhaar_number": "234123412346",
  "is_demo": false
}
```
- **Response `201 Created` (`LivingJourney`)**:
```json
{
  "id": "7b29a8f4-6e1c-4b3d-9f2e-0a1c2d3e4f5a",
  "created_at": "2026-11-14T10:00:00.000000Z",
  "updated_at": "2026-11-14T10:00:02.800000Z",
  "intake": {
    "patient_name": "Ramesh Sharma",
    "hospital_name": "Ruby Hall Clinic",
    "aadhaar_number": "XXXX-XXXX-2346",
    "urgency": "critical",
    "language": "hi"
  },
  "documents": [
    {
      "name": "StarHealth_Policy_Schedule.pdf",
      "type": "health_policy",
      "status": "Analyzed & Grounded"
    },
    {
      "name": "RubyHall_PreAuth_Estimate.pdf",
      "type": "hospital_estimate",
      "status": "Analyzed & Grounded"
    }
  ],
  "gap": {
    "total_estimate": 420000.0,
    "likely_covered_base": 320400.0,
    "gap_low": 87600.0,
    "gap_expected": 99600.0,
    "gap_high": 120600.0,
    "confidence": "Needs TPA Confirmation",
    "assumptions": [
      "Estimated non-payable consumables (~10% under IRDAI Clause 4.8): ₹42,000",
      "Room rent penalty (actual ₹8,500/day vs allowed ₹5,000/day over 4 days): ₹49,350",
      "Policy mandates 10% co-payment on admissible expenses: ₹32,040"
    ],
    "room_rent_proportional_deduction": 49350.0,
    "non_payable_consumables": 42000.0,
    "co_pay_amount": 32040.0,
    "remaining_sum_insured": 500000.0
  },
  "coverage_findings": [
    {
      "category": "Room Rent & Nursing Expenses",
      "estimated_cost": 34000.0,
      "likely_covered": 20000.0,
      "out_of_pocket": 14000.0,
      "confidence": "High",
      "is_verified": true,
      "evidence_doc": "StarHealth_Policy_Schedule.pdf",
      "evidence_page": 2,
      "clause_ref": "Section 2.1",
      "evidence_passage": "The company indemnifies room and nursing expenses up to a maximum of INR 5,000 per day."
    }
  ],
  "checklist": [
    {
      "id": "task-submit-aadhaar",
      "title": "Submit Ramesh Sharma's Aadhaar & Doctor Signature to Ruby Hall Clinic Insurance Desk (Counter #4)",
      "category": "document_required",
      "status": "in_progress",
      "is_critical": true,
      "actor": "Family",
      "depends_on": []
    }
  ],
  "funding_options": [
    {
      "id": "fund-caution-01",
      "provider": "Paytm UPI Instant Caution Deposit",
      "badge": "Demo Partner — Illustrative terms for hackathon evaluation",
      "type": "emergency_deposit_buffer",
      "amount": 50000.0,
      "apr_percent": 0.0
    }
  ],
  "current_stage": "living_journey_active",
  "next_best_action": "Submit Ramesh Sharma's Aadhaar & Doctor Signature to Ruby Hall Clinic Insurance Desk (Counter #4)",
  "is_demo": false
}
```

---

### 3.3 `POST /api/journey/{id}/replan`
- **Purpose**: Ingests incoming TPA queries and dynamically mutates the DAG tasks.
- **Request Body**:
```json
{
  "query_ref": "TPA-QUERY-8921",
  "insurer_name": "Star Health TPA Desk",
  "requested_document": "Casualty Admission ECG Strip",
  "reason": "Rule out pre-existing ischemic heart disease"
}
```
- **Response `200 OK`**: Returns updated `LivingJourney` with `current_stage = "tpa_query_pending"` and pinned urgent next best action.

---

### 3.4 `DELETE /api/journey/{id}`
- **Purpose**: DPDP Act 2023 permanent hard erasure.
- **Response `200 OK`**:
```json
{
  "status": "success",
  "message": "Journey 7b29a8f4-6e1c-4b3d-9f2e-0a1c2d3e4f5a and all associated documents permanently erased."
}
```

---

### 3.5 `GET /api/journey/{id}/stream`
- **Protocol**: Server-Sent Events (`text/event-stream`).
- **Stream Event Format**:
```
event: progress
data: {"step": "coverage", "message": "Matching policy clauses with verified citation quotes...", "timestamp": "2026-11-14T10:00:01.200Z"}

event: progress
data: {"step": "gap", "message": "Modeling room-rent proportional deduction & out-of-pocket range...", "timestamp": "2026-11-14T10:00:01.800Z"}
```

---

### 3.6 `POST /api/journey/{id}/tasks/{task_id}/approve`
- **Purpose**: Customer Approval Gateway for consequential financial actions.
- **Headers**: `Idempotency-Key: <uuid-v4>`
- **Request Body**:
```json
{
  "approval_id": "appr-1731567600",
  "action_type": "caution_deposit_upi",
  "parameters": {
    "amount": 50000.0,
    "payee_vpa": "rubyhall@paytm"
  },
  "auth_token": "stepup-otp-verified"
}
```
- **Response `200 OK`**:
```json
{
  "status": "approved",
  "task_id": "task-caution-deposit",
  "action_executed": true,
  "transaction_reference": "PTM-TXN-90218491",
  "timestamp": "2026-11-14T10:05:00.000000Z"
}
```

