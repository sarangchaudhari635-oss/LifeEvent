# Implementation Plan

**Product:** LifeEvent AI · **Scope:** from current prototype → robust demo/deployable build
**How to use:** phases are ordered. Phase 0 is **done** (verify, don't redo). Phases 1–5 are the
collaborator's work queue. Every task lists its Definition of Done (DoD).

---

## Phase 0 — Current State (COMPLETE, verify only)

- [x] Next.js 15 / React 19 frontend with 10 routes (landing, intake, journey, coverage, funding, documents, counselor, for-hospitals, how-it-works, privacy)
- [x] FastAPI backend with 8 endpoints (health, intake, get, replan, delete, SSE stream, counselor, pilot-request)
- [x] LangGraph StateGraph pipeline: intake → document → coverage → gap → checklist → funding → complete
- [x] Verhoeff Aadhaar masking + `sanitize_logs()` (`backend/app/core/security.py`)
- [x] Honest gap calculator with IRDAI room-rent penalty + 10% non-payables (`backend/app/core/gap_calculator.py`)
- [x] Citation validator with verbatim passage matching (`backend/app/core/citation_validator.py`)
- [x] Dual engine: Gemini 2.0 + offline deterministic fixtures
- [x] 12/12 pytest suites green
- [x] Multi-viewport visual QA (1440/1280/768/390 in `screenshots/`)
- [x] One-click Windows runner (`run_demo.bat`)

**DoD for re-verification:** `python -m pytest backend/tests` → 12 passed; `.\run_demo.bat` boots both servers; cardiac demo journey loads at `/journey/demo-journey-cardiac-01`.

---

## Phase 1 — Environment & Onboarding (half day)

- [ ] 1.1 Clone repo, install Python + Node deps (see `TECH_STACK.md` §7)
- [ ] 1.2 Run test suite; confirm 12/12 green
- [ ] 1.3 Run `.\run_demo.bat`; walk every route in `PRD.md` §5
- [ ] 1.4 Read `docs/PRD.md` + `docs/TECH_STACK.md` end to end
- [ ] 1.5 Agree branch strategy: feature branches → PR → owner review; never commit to `main` directly

## Phase 2 — Correctness & Data Integrity (2–3 days)

- [ ] 2.1 **Supabase persistence**: replace `JOURNEY_STORE` dict with Supabase-backed repository; keep in-memory as test double. DoD: journeys survive backend restart; tests still green with fixture store.
- [ ] 2.2 **Pilot requests persisted**: route `PILOT_REQUESTS` through same repository. DoD: form submissions durable.
- [ ] 2.3 **Idempotent journey IDs**: replace `int(datetime.now().timestamp())` IDs with UUID4 (collision risk on rapid submits). DoD: two intakes within the same second produce distinct IDs.
- [ ] 2.4 **`sanitize_logs` coverage audit**: verify every route returning journey data applies it (already true today — add a test that greps responses for unmasked 12-digit sequences). DoD: new pytest case fails if a raw Aadhaar-shaped number appears in any response.
- [ ] 2.5 **Error contracts**: define Pydantic error schema; replace bare `HTTPException(404)` detail strings. DoD: consistent `{code, message}` errors; frontend `error.tsx` renders them.

## Phase 3 — AI Pipeline Hardening (3–4 days)

- [ ] 3.1 **Real Gemini path for live intake**: today the live pipeline synthesizes `document_pages` from intake form fields; wire actual PDF upload → PyMuPDF extraction → coverage node for uploaded policies. DoD: uploading a sample policy PDF yields citations pulled from that PDF's text, not synthesized text.
- [ ] 3.2 **Citation validator as gate**: make unmatched LLM coverage claims *rejected* (not just flagged). DoD: a pytest case where a hallucinated clause produces an "unverified" item with `likely_covered: 0`.
- [ ] 3.3 **Fixture fallback test**: simulate Gemini failure (network off / bad key) and verify deterministic shield output. DoD: journey still completes with fixtures; demo never 500s.
- [ ] 3.4 **Prompt versioning**: extract Gemini prompts to `backend/app/prompts/` with version tags. DoD: prompts not buried in code; changelog entry per prompt change.
- [ ] 3.5 **Rate limit on all mutating routes** (`replan`, `pilot-request`, `delete`), not just intake. DoD: slowapi limits return 429 under burst test.

## Phase 4 — Frontend Polish & Resilience (2–3 days)

- [ ] 4.1 **SSE consumption**: wire `/api/journey/{id}/stream` into the dashboard so agent steps animate live during intake → journey creation. DoD: progress visible without refresh.
- [ ] 4.2 **Loading/empty/error states** for all data-driven routes (counselor queue with 0 journeys, journey 404). DoD: no blank screens anywhere.
- [ ] 4.3 **i18n audit**: verify HI/MR strings on intake + journey render correctly (Devanagari line-height, no truncation). DoD: 390px viewport screenshots for all three languages.
- [ ] 4.4 **Reduced-motion pass**: confirm every animation honors `prefers-reduced-motion`. DoD: Playwright emulation run with motion disabled.
- [ ] 4.5 **A11y sweep**: labels on form inputs, focus order, contrast ≥ 4.5:1 on body text. DoD: no critical violations in a manual keyboard-only walkthrough.

## Phase 5 — Pre-Demo / Pre-Deploy Gate (1 day, blocking)

- [ ] 5.1 Complete `docs/SECURITY_AUDIT.md` checklist — **fix or explicitly accept every finding**
- [ ] 5.2 Secrets sweep: confirm no API keys in repo; `.env` gitignored; demo uses fixture engine if no key present
- [ ] 5.3 Final test run: `python -m pytest backend/tests` (12 passed) + `npm run build` clean
- [ ] 5.4 Fresh-machine dry run: clone → `run_demo.bat` → full demo flow end to end
- [ ] 5.5 Demo script rehearsal against `DEMO_SCRIPT.md`

---

## Milestone Summary

| Milestone | Phase | Duration | Blocker for |
| :--- | :--- | :--- | :--- |
| Onboarded & verified | 0–1 | 0.5 day | Everything |
| Durable data layer | 2 | 2–3 days | Deploy-grade demo |
| Hardened AI pipeline | 3 | 3–4 days | Public deploy |
| UI resilient & accessible | 4 | 2–3 days | Judging polish |
| Release gate | 5 | 1 day | Demo / deploy day |

## Working Agreement

1. One task = one branch = one PR; reference the task ID above.
2. Backend change ⇒ matching test in `backend/tests/`.
3. Money math changes ⇒ update `test_gap.py` expectations **and** the PRD acceptance criteria.
4. Never commit real PII (Aadhaar, policy numbers, patient names) — fixtures only.
5. Screenshots for any visual change: 1440 / 1280 / 768 / 390 into `screenshots/`.
