# Contributing Guide

**Product:** LifeEvent AI · **Team:** Crazy Coders
Rules for collaborating on this repo without stepping on each other.

---

## 1. Branch & Commit Workflow

```bash
git pull origin main
git checkout -b feat/<plan-task-id>-<short-name>   # e.g. feat/2.3-uuid-journey-ids
# ...work, test, commit...
git push -u origin feat/2.3-uuid-journey-ids
# open a Pull Request referencing the task ID from IMPLEMENTATION_PLAN.md
```

- One task = one branch = one PR. Reference the task ID (e.g., "Implements Plan §2.3" from
  `IMPLEMENTATION_PLAN.md`).
- Never commit directly to `main`.
- PRs require: 12/12 tests green + `npm run build` clean + reviewer approval.

### Commit message format

```
<type>(<scope>): <short imperative summary>

types: feat | fix | test | docs | refactor | chore | perf
example: feat(gap): apply sum-insured cap before co-pay calculation
```

## 2. Non-Negotiable Code Rules

1. **No real PII, ever** — no real Aadhaar numbers, policy numbers, patient names, or phone
   numbers in fixtures, tests, screenshots, or logs. Demo data only.
2. **Money math stays deterministic** — rupee figures come from `backend/app/core/gap_calculator.py`,
   never from the LLM. If you add a financial rule, add it to the calculator + `test_gap.py`.
3. **Every coverage claim needs evidence** — `evidence_doc`, `evidence_page`, `evidence_passage`,
   `clause_ref`. Claims without verifiable text must surface as unverified with `likely_covered: 0`.
4. **Aadhaar masking before exposure** — any new code path that touches an Aadhaar must mask via
   `backend/app/core/security.py` (Verhoeff) before logging, storing, or sending to the LLM.
5. **Test-first for backend** — feature PR without a test in `backend/tests/` gets sent back.
6. **Respect the schemas** — extend `backend/app/models/schemas.py` rather than inventing ad-hoc
   dict shapes; keep Pydantic as the single source of truth for the API contract.

## 3. Code Style

**Python (backend)**
- PEP 8; type hints on function signatures.
- Docstrings on every module and every public function.
- Keep route handlers thin: orchestrate, don't compute — business logic belongs in `core/` or `agents/`.

**TypeScript/React (frontend)**
- App Router conventions; server components by default, `"use client"` only when needed
  (interactivity, Web Speech API, SSE).
- Design tokens from `design-system/` — no hardcoded colors/spacing in components.
- Honors `prefers-reduced-motion` for any added animation.

## 4. Documentation Duties

When your change alters any of these, update the matching doc in the same PR:

| Change | Update |
| :--- | :--- |
| New/changed endpoint or schema field | `API_REFERENCE.md` + root `README.md` route table |
| New financial/insurance rule | `RESEARCH.md` + `PRD.md` acceptance criteria |
| New user-facing route | `PRD.md` §5 + `TESTING_QA.md` route checklist |
| New security-relevant behavior | `SECURITY_AUDIT.md` (checklist or findings) |
| New dependency | `TECH_STACK.md` §1 |

## 5. Review Checklist (for reviewers)

- [ ] Task ID referenced; scope matches one task
- [ ] Tests added/updated; `python -m pytest backend/tests` → 12 passed
- [ ] No PII in code, fixtures, screenshots, or log strings
- [ ] Money math unchanged unless calculator + tests + PRD updated together
- [ ] New routes rate-limited and returning `sanitize_logs()`-clean data
- [ ] Docs updated per §4
- [ ] No secrets, `.env`, or credential files in the diff
- [ ] UI changes: 4-viewport screenshots attached (1440/1280/768/390)

## 6. Getting Help

- Start with `FreindSHare/README.md` → `SETUP_GUIDE.md` for environment problems.
- Architecture questions → `TECH_STACK.md`.
- "Why does it do X?" → `RESEARCH.md` explains every domain rule (IRDAI, DPDP, Verhoeff).
- Found a security issue → document it as a finding in `SECURITY_AUDIT.md` §A with severity;
  don't discuss real-data exposure publicly.
