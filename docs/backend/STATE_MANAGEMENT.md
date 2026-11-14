# LifeEvent AI: State Management & Transition Validation Engine

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. State Management Philosophy

In financial operating systems, **uncontrolled state mutations lead to legal liability, money loss, and system corruption**. 

LifeEvent AI establishes a strict state management philosophy:
1. **Deterministic State Machine:** Task states and financial journey stages can only mutate via a deterministic backend state engine.
2. **LLM Mutation Prohibition:** Language models are **strictly forbidden from directly mutating task statuses or financial figures**. LLM outputs are treated as untrusted proposals; the backend state machine validates all conditions before committing transitions.
3. **DAG Dependency Validation:** A task cannot activate until all prerequisite tasks in its dependency array have successfully completed.
4. **Idempotency Guarantees:** State mutations must accept an `Idempotency-Key` header, guaranteeing that network retries never double-execute transactions.

---

## 2. Valid Task State Transition Matrix

The table below defines every permitted state transition in the system:

| From State | To State | Trigger / Condition | Validated By |
| :--- | :--- | :--- | :--- |
| `pending` | `in_progress` | All prerequisite task IDs in `depends_on` are in `completed` state | State Engine |
| `in_progress` | `needs_review` | Fact extraction confidence $< 0.70$ or OCR contradiction detected | OCR / RAG Gate |
| `needs_review`| `in_progress` | User or Counselor provides manual clarification / edits | User / Counselor |
| `in_progress` | `blocked` | External event (missing doctor casualty signature, physical bill unavailable) | Counselor / User |
| `blocked` | `in_progress` | External prerequisite resolved | Counselor / User |
| `in_progress` | `awaiting_approval`| Consequential action prepared (Key Fact Statement generated, parameters hashed) | Approval Gateway |
| `awaiting_approval`| `completed` | Customer step-up authentication verified and parameter hash matches | Approval Gateway |
| `awaiting_approval`| `cancelled` | Customer explicitly rejects offer OR approval timer expires (15 mins) | Approval Gateway |
| `in_progress` | `completed` | Safe informational action executed and verified | State Engine |
| `in_progress` | `failed` | Unrecoverable external failure (e.g., bank transfer permanently rejected) | Provider Adapter |
| `failed` | `in_progress` | Manual retry triggered with corrected parameters | Counselor / User |

Any transition not explicitly listed in the matrix above is rejected with `409 Conflict (STATE_INVARIANT_VIOLATION)`.

---

## 3. Transition Validator Implementation (`backend/app/core/state_machine.py`)

```python
from typing import Dict, Any, List
from backend.app.core.exceptions import DomainException

VALID_TRANSITIONS: Dict[str, List[str]] = {
    "pending": ["in_progress", "cancelled"],
    "in_progress": ["needs_review", "blocked", "awaiting_approval", "completed", "failed", "cancelled"],
    "needs_review": ["in_progress", "cancelled"],
    "blocked": ["in_progress", "cancelled"],
    "awaiting_approval": ["completed", "cancelled"],
    "completed": [], # Terminal state
    "failed": ["in_progress", "cancelled"],
    "cancelled": []  # Terminal state
}

def validate_task_transition(
    task: Dict[str, Any],
    target_status: str,
    all_tasks: Dict[str, Dict[str, Any]],
    approval_verified: bool = False
) -> None:
    """
    Validates whether a task can legally transition to target_status.
    Raises DomainException if any invariant is violated.
    """
    current_status = task["status"]

    # 1. Validate state transition legality
    if target_status not in VALID_TRANSITIONS.get(current_status, []):
        raise DomainException(
            code="ILLEGAL_STATE_TRANSITION",
            title="Illegal State Transition",
            status_code=409,
            detail=f"Cannot transition task from '{current_status}' to '{target_status}'."
        )

    # 2. Dependency Invariant: Check prerequisites before activating
    if target_status == "in_progress":
        for dep_id in task.get("depends_on", []):
            dep_task = all_tasks.get(dep_id)
            if not dep_task or dep_task["status"] != "completed":
                raise DomainException(
                    code="TASK_DEPENDENCY_UNRESOLVED",
                    title="Task Dependency Unresolved",
                    status_code=409,
                    detail=f"Task '{task['title']}' cannot activate because prerequisite task '{dep_id}' is '{dep_task.get('status') if dep_task else 'missing'}'."
                )

    # 3. Consequential Action Safety Invariant
    if current_status == "awaiting_approval" and target_status == "completed":
        if not approval_verified:
            raise DomainException(
                code="APPROVAL_REQUIRED",
                title="Customer Approval Required",
                status_code=409,
                detail="Consequential action cannot be marked completed without valid customer authorization."
            )
```

This guarantees absolute state predictability and enforces institutional safety across all user journeys.

