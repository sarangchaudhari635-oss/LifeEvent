# Testing & QA Guide

**Product:** LifeEvent AI
How to verify the product: automated backend tests, frontend build checks, and multi-viewport visual QA.

---

## 1. Automated Test Suite

Run:

```bash
python -m pytest backend/tests -v
```

Expected result (must be green before every commit):

```
backend\tests\test_aadhaar.py      ....   (4)
backend\tests\test_citation.py     ...    (3)
backend\tests\test_gap.py          ..     (2)
backend\tests\test_graph.py        .      (1)
backend\tests\test_hard_delete.py  ..     (2)
============ 12 passed ============
```

### What each suite guarantees

| Suite | Guarantees |
| :--- | :--- |
| `test_aadhaar.py` | Verhoeff checksum validation is correct; valid 12-digit Aadhaar → `XXXX-XXXX-1234`; phone numbers and policy numbers are **not** masked |
| `test_citation.py` | Coverage claims match verbatim document text; unmatched passages are rejected/flagged unverified |
| `test_gap.py` | The honest range math: non-payables (10%), room-rent deduction, co-pay, and Low–Expected–High bounds match `gap_calculator.py` |
| `test_graph.py` | LangGraph pipeline runs end-to-end and produces a complete journey |
| `test_hard_delete.py` | `DELETE` removes data; subsequent access no longer returns the journey (DPDP erasure) |

### Rules when adding tests

- New backend feature ⇒ new test file or new cases in the matching suite.
- Changing money math ⇒ update `test_gap.py` expectations **and** the PRD acceptance criteria (`PRD.md` §7).
- Run with `-v` for per-test names; use `pytest backend/tests/test_gap.py` to scope while iterating.

## 2. Backend Smoke Checks (manual, 5 minutes)

1. `GET /api/health` → `status: healthy`, `active_journeys >= 2` (demo journeys seeded).
2. `POST /api/journey/intake` with a valid body → returns a journey with populated `gap`, `checklist`, `funding_options`.
3. Intake with an Aadhaar number → response shows it masked (`XXXX-XXXX-XXXX` last-4 only).
4. `POST /api/journey/{id}/replan` → `current_stage` becomes `tpa_query_pending`, urgent ECG task prepended.
5. `DELETE /api/journey/{id}` → then `GET` returns 404.
6. Burst intake 31× quickly → the 31st returns `429`.

## 3. Frontend Verification

```bash
cd frontend
npm run build     # must complete with zero type errors
```

### Route checklist (all must render without console errors)

| Route | Check |
| :--- | :--- |
| `/` | Hospital-counter story, 5 questions render |
| `/intake` | Voice dictation works (Chrome), both sample loaders populate the form |
| `/journey/[id]` | Gap range displayed, pinned next action, timeline |
| `/journey/[id]/coverage` | Every covered line shows verbatim passage + page + clause; "Clause 9.9" item shows ₹0 covered |
| `/journey/[id]/funding` | Demo-partner labeling visible; simulated deposit flow completes |
| `/documents` | Verhoeff playground: valid number masks, phone number untouched |
| `/counselor` | Queue rows appear with readiness scores |
| `/for-hospitals` | Trial form submits successfully |
| `/how-it-works` | 5-step flow, dual engine explainer |
| `/privacy` | Charter text + working hard-delete tool |
| 404 path | Custom `not-found.tsx` renders |

## 4. Multi-Viewport Visual QA

Use Playwright (already a root dependency) or DevTools device toolbar. Capture into `screenshots/`.

| Viewport | Size | Screenshot file |
| :--- | :--- | :--- |
| Desktop | 1440 × 900 | `screenshots/desktop-1440.png` |
| Laptop | 1280 × 800 | `screenshots/laptop-1280.png` |
| Tablet | 768 × 1024 | `screenshots/tablet-768.png` |
| Mobile | 390 × 844 | `screenshots/mobile-390.png` |

Per-viewport checks: no horizontal scroll, no clipped text, tap targets ≥ 44px on mobile, Devanagari (HI/MR) renders without truncation, no console errors, no layout shift on load.

## 5. Accessibility Pass

- Keyboard-only walkthrough of `/intake` → `/journey/[id]`: every control reachable, visible focus.
- Labels present on all form inputs.
- Body text contrast ≥ 4.5:1.
- `prefers-reduced-motion` emulation → animations disable.

## 6. Regression Checklist Before Any Demo

- [ ] `python -m pytest backend/tests` → 12 passed
- [ ] `npm run build` clean
- [ ] Fresh boot via `.\run_demo.bat`; cardiac demo loads at `/journey/demo-journey-cardiac-01`
- [ ] Replan shows the TPA-query live re-plan
- [ ] No real PII anywhere in fixtures/logs
- [ ] Four viewport screenshots refreshed if any UI changed
