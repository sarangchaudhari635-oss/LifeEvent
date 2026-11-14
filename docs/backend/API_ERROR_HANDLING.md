# LifeEvent AI: API Error Handling & Problem Details Specification

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Standard:** RFC 7807 (Problem Details for HTTP APIs)  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Error Handling Philosophy

In critical financial and healthcare workflows, generic error messages (such as `500 Internal Server Error` with blank payloads) cause panic and confusion. 

LifeEvent AI standardizes all API error responses according to **RFC 7807 (Problem Details for HTTP APIs)**, ensuring that errors are:
1. **Machine-Readable:** Structured error codes and retryable flags allow clients to handle failures automatically.
2. **Human-Actionable:** Plain-language descriptions inform the user or counselor exactly what went wrong and how to recover.
3. **Privacy-Sanitized:** Error details never leak stack traces, database connection strings, unmasked Aadhaar numbers, or internal tokens.

---

## 2. Standard RFC 7807 Error Schema

All `4xx` and `5xx` error responses return `Content-Type: application/problem+json`:

```json
{
  "type": "https://api.lifeevent.ai/errors/state-invariant-violation",
  "title": "State Invariant Violation",
  "status": 409,
  "detail": "Cannot transition task 'task-preauth-approval' to 'completed' because prerequisite task 'task-tpa-query-ecg' is pending.",
  "instance": "/api/journey/7b29a8f4-6e1c-4b3d-9f2e-0a1c2d3e4f5a/tasks/task-preauth-approval/complete",
  "code": "TASK_DEPENDENCY_UNRESOLVED",
  "retryable": false,
  "timestamp": "2026-11-14T10:04:12.300Z",
  "invalid_params": [
    {
      "name": "depends_on",
      "reason": "Task 'task-tpa-query-ecg' has status 'in_progress'"
    }
  ]
}
```

---

## 3. Standard Error Code Taxonomy

| HTTP Status | Error Code (`code`) | RFC 7807 Title | Description & Client Action |
| :--- | :--- | :--- | :--- |
| `400 Bad Request` | `INVALID_INPUT_DATA` | Invalid Request Payload | Request body violates basic constraints (e.g., negative room rent). Fix payload. |
| `401 Unauthorized` | `AUTHENTICATION_REQUIRED` | Authentication Missing or Expired | Missing or expired JWT Bearer token in `Authorization` header. Re-authenticate. |
| `403 Forbidden` | `ACCESS_DENIED` | Tenant Access Forbidden | Authenticated user is not the owner of this journey or lacks counselor role. |
| `404 Not Found` | `JOURNEY_NOT_FOUND` | Resource Not Found | Journey ID does not exist or has been permanently erased under DPDP hard delete. |
| `409 Conflict` | `STATE_INVARIANT_VIOLATION` | State Invariant Violation | Illegal task transition attempted (e.g., executing payment without approval). |
| `409 Conflict` | `IDEMPOTENCY_CONFLICT` | Idempotent Request In Progress | Concurrent request with identical `Idempotency-Key` is currently executing. |
| `422 Unprocessable`| `SCHEMA_VALIDATION_FAILED`| Schema Validation Error | Pydantic validation failed; field names and validation errors returned in `invalid_params`. |
| `429 Too Many Req`| `RATE_LIMIT_EXCEEDED` | Rate Limit Exceeded | Exceeded 30 req/min on intake. Client must inspect `Retry-After` header. |
| `502 Bad Gateway` | `AI_PROVIDER_ERROR` | Upstream AI Provider Failure | Gemini API unavailable; system automatically transitions to Offline Fixture Shield. |
| `503 Service Unavail`| `PROVIDER_UNAVAILABLE`| External Fintech Service Down | Upstream TPA exchange or Payment Gateway unreachable. Retryable. |

---

## 4. FastAPI Global Exception Handler (`backend/app/core/exceptions.py`)

```python
from fastapi import Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime

class ProblemDetails(BaseModel):
    type: str
    title: str
    status: int
    detail: str
    instance: str
    code: str
    retryable: bool
    timestamp: str
    invalid_params: Optional[List[Dict[str, str]]] = None

class DomainException(Exception):
    def __init__(self, code: str, title: str, status_code: int, detail: str, retryable: bool = False, invalid_params: List[Dict[str, str]] = None):
        self.code = code
        self.title = title
        self.status_code = status_code
        self.detail = detail
        self.retryable = retryable
        self.invalid_params = invalid_params

async def problem_details_exception_handler(request: Request, exc: DomainException) -> JSONResponse:
    """
    Serializes all domain exceptions into standard RFC 7807 Problem Details JSON.
    """
    problem = ProblemDetails(
        type=f"https://api.lifeevent.ai/errors/{exc.code.lower().replace('_', '-')}",
        title=exc.title,
        status=exc.status_code,
        detail=exc.detail,
        instance=request.url.path,
        code=exc.code,
        retryable=exc.retryable,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        invalid_params=exc.invalid_params
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=problem.model_dump(exclude_none=True),
        headers={"Content-Type": "application/problem+json"}
    )
```
This guarantees consistent, safe, and professional error handling across the entire backend.

