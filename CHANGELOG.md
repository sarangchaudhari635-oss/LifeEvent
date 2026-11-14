# Changelog

All notable changes to LifeEvent AI. Format follows [Keep a Changelog](https://keepachangelog.com/).
Versions here describe the prototype's state, not released production builds.

---

## [1.0.0] — 2026-11-14 (Prototype Complete)

### Added
- **Backend (FastAPI + LangGraph):**
  - `POST /api/journey/intake` — creates a living journey (30/min rate limit); demo-fixture path
    and live intake pipeline with document synthesis and Verhoeff masking.
  - `GET /api/journey/{id}`, `POST /api/journey/{id}/replan`, `DELETE /api/journey/{id}`,
    `GET /api/journey/{id}/stream` (SSE, 7 agent steps),
    `GET /api/counselor/journeys`, `POST /api/pilot-request`, `GET /api/health`.
  - LangGraph StateGraph pipeline: intake → document → coverage → gap → checklist → funding → complete.
  - Honest Gap Calculator (`core/gap_calculator.py`): 10% non-payables, room-rent proportional
    deduction, sum-insured cap, co-pay, Low–Expected–High range, confidence grading.
  - Citation Validator (`core/citation_validator.py`): verbatim passage matching for anti-hallucination.
  - Security module (`core/security.py`): Verhoeff Aadhaar validation/masking + `sanitize_logs()`.
  - Demo fixtures: cardiac & orthopedic scenarios, TPA-query replan fixture.
- **Frontend (Next.js 15 / React 19):** 10 routes — landing, intake (Web Speech API voice
  dictation, EN/HI/MR, sample loaders), living journey dashboard, clause-verified coverage
  inspector, emergency funding with simulated Paytm UPI deposit, document hub with Verhoeff
  playground, counselor console, B2B pilot landing, how-it-works, DPDP privacy charter with
  hard-delete tool.
- **Testing:** 12 pytest suites — aadhaar (4), citation (3), gap (2), graph (1), hard-delete (2).
- **Tooling:** `run_demo.bat` one-click runner (tests → backend :8000 → frontend :3000 → browser).
- **QA:** multi-viewport screenshots at 1440/1280/768/390 (`screenshots/`).
- **Docs:** `FreindSHare/` — README, PRD, TECH_STACK, IMPLEMENTATION_PLAN, RESEARCH,
  SECURITY_AUDIT, SETUP_GUIDE, API_REFERENCE, TESTING_QA, CONTRIBUTING.

### Known Issues (tracked in `SECURITY_AUDIT.md` §A)
- CORS wildcard (`*`) with credentials enabled (A1, critical)
- No authentication on API routes (A2, critical — demo-acceptable)
- Unbounded in-memory journey store (A3)
- Timestamp-based, enumerable journey IDs (A4)
- Demo-fallback behavior in `GET /api/journey/{id}` (A5)
- `/api/pilot-request` accepts unvalidated payloads (A6)
- Rate limiting only on intake (A8)

---

## [Unreleased] — Planned (see `IMPLEMENTATION_PLAN.md`)

### Planned
- Supabase persistence replacing in-memory store (Phase 2)
- UUID journey IDs (Phase 2)
- Real Gemini pipeline over uploaded policy PDFs via PyMuPDF (Phase 3)
- Citation validator as a hard rejection gate (Phase 3)
- Rate limits on all mutating routes (Phase 3)
- SSE live progress wired into the dashboard (Phase 4)
- i18n, reduced-motion, accessibility passes (Phase 4)
- Security audit sign-off gate (Phase 5)
