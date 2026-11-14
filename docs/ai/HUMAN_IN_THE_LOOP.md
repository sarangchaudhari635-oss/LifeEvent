# LifeEvent AI: Human-in-the-Loop (HITL) Architecture & Escalation Controls

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Human-in-the-Loop Philosophy

In autonomous systems, the temptation is to automate every step from intake to payment disbursement. In high-stakes emergency healthcare financing, **fully autonomous execution is dangerous, irresponsible, and illegal**.

LifeEvent AI establishes a **Human-in-the-Loop (HITL)** architecture where:
- **AI serves as an intelligent accelerator:** Parsing complex documents, mapping clauses, and modeling financial gaps in seconds.
- **Humans retain absolute decision authority:** Consequential financial actions, legal claims, and ambiguous data extractions require explicit human verification and authorization.

```mermaid
flowchart TD
    AI_IN["Incoming Data / Event Analysis\n(Multimodal OCR, RAG, Fact Extraction)"] --> EVAL{"Confidence & Consequence Evaluator"}
    
    EVAL -->|Low Confidence (< 0.70) or Data Conflict| HITL_REVIEW["Task State: 'needs_review'\nFlags UI for Attendant / Counselor Clarification"]
    
    EVAL -->|High Confidence & Safe Informational Task| AUTO["Automatic State Transition:\nTask moves to 'completed'"]
    
    EVAL -->|Consequential Financial Action\n(Loan Application, UPI Deposit, Claim Submission)| HITL_APPROVE["Task State: 'awaiting_approval'\nCustomer Approval Gateway Triggered"]

    HITL_REVIEW --> USER_INPUT["Attendant Confirms / Edits Document Data"]
    USER_INPUT --> AUTO

    HITL_APPROVE --> KFS["Display Key Fact Statement & Terms"]
    KFS --> STEPUP["Step-Up Verification (Biometric / OTP)"]
    STEPUP --> CONSENT{"Customer Decision"}
    
    CONSENT -->|Approved| EXECUTE["Execute Provider API / Commit Ledger"]
    CONSENT -->|Rejected / Timed Out| CANCEL["Task moves to 'cancelled' / Aborted"]
```

---

## 2. HITL Review & Approval Triggers

| Trigger Category | Specific Condition | Enforced Task State | Responsible Human Actor |
| :--- | :--- | :--- | :--- |
| **Data Extraction Ambiguity** | OCR confidence $< 0.70$ on actual room rent or stay days | `needs_review` | Family Attendant (confirms on mobile form) |
| **Policy Document Conflict** | Hospital estimate names a procedure not found in policy schedule | `needs_review` | Hospital Financial Counselor (reviews on console) |
| **TPA Query Discrepancy** | TPA requests casualty ECG note to rule out pre-existing disease | `in_progress` (Urgent) | Attendant & Attending Doctor |
| **Emergency Caution Deposit** | Triggering ₹50,000 Paytm UPI instant caution deposit | `awaiting_approval` | Family Attendant (explicit authorization) |
| **Bridge Credit Line Offer** | Accepting emergency medical loan terms from partner NBFC | `awaiting_approval` | Family Attendant (signs digital KFS via OTP) |
| **Pre-Auth Claim Submission** | Submitting formal cashless pre-auth dossier to insurer | `awaiting_approval` | Family Attendant & Counselor |

---

## 3. The Customer Approval Gateway (`backend/app/core/approval_gateway.py`)

The Approval Gateway enforces a cryptographic pause before any consequential action executes:

```python
import hashlib
import time
from typing import Dict, Any
from pydantic import BaseModel

class ApprovalRequestPayload(BaseModel):
    journey_id: str
    task_id: str
    action_type: str # 'caution_deposit_upi', 'emergency_credit_sanction'
    parameters: Dict[str, Any]
    expires_in_seconds: int = 900 # 15-minute expiration timer

class ApprovalGateway:
    @staticmethod
    def create_request(payload: ApprovalRequestPayload) -> Dict[str, Any]:
        """
        Creates a time-limited, cryptographic approval challenge.
        """
        payload_bytes = str(sorted(payload.parameters.items())).encode('utf-8')
        payload_hash = hashlib.sha256(payload_bytes).hexdigest()
        expires_at = int(time.time()) + payload.expires_in_seconds

        approval_record = {
            "approval_id": f"appr-{int(time.time())}",
            "journey_id": payload.journey_id,
            "task_id": payload.task_id,
            "action_type": payload.action_type,
            "payload_hash": payload_hash,
            "status": "pending",
            "expires_at": expires_at
        }
        return approval_record

    @staticmethod
    def verify_and_authorize(approval_record: Dict[str, Any], user_auth_token: str, current_parameters: Dict[str, Any]) -> bool:
        """
        Validates that consent has not expired and the action parameters have not been tampered with.
        """
        # 1. Check expiration
        if time.time() > approval_record["expires_at"]:
            approval_record["status"] = "expired"
            raise ValueError("Approval request has expired. Re-authorization required.")

        # 2. Check parameter hash integrity (anti-tampering)
        current_hash = hashlib.sha256(str(sorted(current_parameters.items())).encode('utf-8')).hexdigest()
        if current_hash != approval_record["payload_hash"]:
            approval_record["status"] = "tampered"
            raise ValueError("Action parameters modified after consent generation.")

        approval_record["status"] = "granted"
        return True
```

This guarantees that LifeEvent AI remains an empowering decision-support tool that respects human agency and regulatory boundaries at all times.

