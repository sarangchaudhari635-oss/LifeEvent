# Security Audit — Post-Development Checklist & Findings

**Product:** LifeEvent AI
**When to run:** after development, **before** any public deploy, live demo with real data, or
submission. Owner signs off per section.
**Severity scale:** 🔴 Critical · 🟠 High · 🟡 Medium · 🔵 Low / Hardening

> ⚠️ Current codebase status: this is a **prototype handling demo/synthetic data only**. Several
> items below are **known, real findings in the code as written today** (marked ✔︎ FOUND). Do not
> deploy publicly or feed real PII until the 🔴/🟠 items are resolved.

---

## A. Findings Already Present in the Code (verified by code review)

| # | Severity | Finding | Location | Fix |
| :- | :-: | :--- | :--- | :--- |
| A1 | 🔴 | **CORS wildcard with credentials**: `allow_origins=["*"]` combined with `allow_credentials=True`. Browsers reject this combo, and any origin can make credentialed calls to every API route. | `backend/app/main.py` (CORSMiddleware) | Set explicit origins (`http://localhost:3000` for demo; the deploy domain for prod). Credentials should only stay enabled if actually used. |
| A2 | 🔴 | **No authentication / authorization on any route.** Anyone can read any journey (`GET /api/journey/{id}`), trigger replan, or delete another user's journey (`DELETE`). IDOR by design — acceptable for offline demo, blocking for deploy. | All of `main.py` | For demo: acceptable with the demo-data caveat displayed. For deploy: add session/token auth; scope journey access to the creating session; verify ownership before GET/DELETE/replan. |
| A3 | 🟠 | **Unbounded in-memory store**: `JOURNEY_STORE` and `PILOT_REQUESTS` grow without eviction — memory-exhaustion DoS via repeated intakes. | `main.py` | Evict by TTL/max-size; or move to Supabase with row limits per session. |
| A4 | 🟠 | **Journey IDs are predictable** (`journey-<unix-seconds>`): collides on same-second submits and is enumerable (supports A2 IDOR). | `main.py` `create_journey_intake` | Use `uuid4()`; see `IMPLEMENTATION_PLAN.md` §2.3. |
| A5 | 🟠 | **`GET /api/journey/{id}` falls back to the demo journey** when the id contains "cardiac" or "sample" — undefined behavior that quietly returns another journey's data. | `main.py` `get_journey` | Return 404, or an explicit demo redirect with clear labeling. |
| A6 | 🟡 | **`POST /api/pilot-request` accepts an unvalidated `dict`** — arbitrary payload shapes stored, potential garbage/oversized payloads. | `main.py` `submit_pilot_request` | Define a Pydantic schema (name, hospital, email, phone) with field limits. |
| A7 | 🟡 | **DELETE is idempotent-by-silence**: deleting a nonexistent journey returns success — fine for privacy, but log/monitor actual deletions vs. misses. | `main.py` `delete_journey` | Keep response, add server-side audit log (without PII). |
| A8 | 🔵 | **Rate limiting only on intake** (30/min). replan/pilot/delete/counselor are unlimited. | `main.py` | Add limits to all mutating + listing routes (Plan §3.5). |
| A9 | 🔵 | **SSE endpoint holds connections ~2.8s** per client with no client cap. | `main.py` `stream_journey_progress` | Cap concurrent streams; add overall request timeout. |
| A10 | 🔵 | **Counselor endpoint exposes all journeys** (patient names, gap figures) to anyone who asks. | `main.py` `get_counselor_journeys` | Demo: fine (demo data). Deploy: auth + per-hospital scoping. |

## B. PII & Privacy (DPDP Act) — Checklist

- [ ] **B1** Verhoeff masking verified: valid 12-digit Aadhaar → `XXXX-XXXX-1234`; invalid/phone/policy numbers pass through unchanged. (`tests/test_aadhaar.py` covers this — keep it green.)
- [ ] **B2** `sanitize_logs()` applied to every route that returns journey data — add the automated test from Plan §2.4 (grep responses for unmasked 12-digit sequences).
- [ ] **B3** No raw ID images persisted anywhere: check temp dirs, `frontend/public`, uploads folder, and any logging of `policy_photo_preview` / `estimate_photo_preview` payloads. ✔︎ FOUND-risk: previews are echoed in the journey response — confirm they are not base64 ID images in any flow; strip them from `GET` responses.
- [ ] **B4** Hard delete actually removes everything reachable: `JOURNEY_STORE` entry ✔, any Supabase rows (when persistence lands), and document page text derived from user uploads.
- [ ] **B5** LLM payload audit: confirm masked, minimal fields only are sent to Gemini; document what leaves the server (`/how-it-works` + `/privacy` should match reality).
- [ ] **B6** Logs (uvicorn console, browser devtools, error tracking) contain no Aadhaar, no policy numbers, no patient names. Run a demo session and grep the logs.
- [ ] **B7** Privacy page (`/privacy`) accurately describes current behavior; update any claim the code doesn't yet honor (e.g., "immediately discarded" vs. transient echo in B3).

## C. Secrets & Configuration

- [ ] **C1** No API keys, Supabase URLs/tokens, or credentials in the repo. Search: `grep -riE "(api[_-]?key|secret|token|password|GEMINI|SUPABASE)" --include="*.{py,ts,tsx,env,json}" .` — inspect every hit.
- [ ] **C2** `.env` is in `.gitignore` and no `.env` file is committed. Provide `.env.example` with placeholders only.
- [ ] **C3** Gemini key (if used) loaded from environment; app degrades to the deterministic fixture shield when absent — never crashes, never logs the key.
- [ ] **C4** `mcp_config.json` and any local tooling configs reviewed for embedded credentials before any repo share.
- [ ] **C5** Dependency hygiene: `pip list --outdated`, `npm audit` in `frontend/`; pin versions; document any known-vulnerable pin and why.

## D. Input Validation & Abuse Resistance

- [ ] **D1** Intake schema limits: string length caps (names ≤ 100, condition ≤ 500), numeric sanity (sum insured, amounts > 0 and < 10^8, stay_days ≤ 60, co-pay ≤ 100). ✔︎ FOUND-risk: current `LifeEventIntake` tolerates extreme values; the gap calculator does math on them.
- [ ] **D2** `estimated_amount`, room rents, etc. are `float(...)`-cast — invalid strings will 500. Confirm Pydantic coercion gives clean 422s.
- [ ] **D3** Upload handling: size cap + MIME sniff if real file upload is enabled; PyMuPDF parsing of untrusted PDFs behind a size/page-count guard.
- [ ] **D4** Rate limits on all mutating routes (Plan §3.5), and consider per-IP journey-creation caps beyond 30/min.
- [ ] **D5** Frontend never renders raw user text as HTML (XSS check on intake fields echoed into journey pages — React escapes by default; verify no `dangerouslySetInnerHTML` exists). `grep -r "dangerouslySetInnerHTML" frontend/src`

## E. Transport & Deployment (only when deploying)

- [ ] **E1** HTTPS everywhere; HSTS at the edge.
- [ ] **E2** Security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, CSP on the Next.js app.
- [ ] **E3** Backend not exposed directly; reverse proxy with request size limits; disable FastAPI docs (`/docs`, `/redoc`) in prod.
- [ ] **E4** CORS tightened per A1; cookies (if any) `Secure`, `HttpOnly`, `SameSite=Lax`.
- [ ] **E5** Backups + retention policy for Supabase; deletion endpoint honored in backups or documented as exception.
- [ ] **E6** Separate demo vs. prod data; demo journeys cannot contain real names/numbers.

## F. AI-Specific Security

- [ ] **F1** Citation gate active: unmatched LLM claims → unverified, `likely_covered: 0` (Plan §3.2). Test the planted "Clause 9.9" hallucination still shows ₹0 covered.
- [ ] **F2** No money math from the LLM — figures only from `gap_calculator.py`. Grep for any LLM-produced rupee value rendered without calculator origin.
- [ ] **F3** Prompt-injection review: policy PDF text is untrusted input that flows into prompts. Confirm extracted text is treated as data (quoted/escaped), and system prompts instruct the model to never follow instructions found in documents.
- [ ] **F4** Fixture shield tested under engine failure (Plan §3.3): no 500s, no partial journeys.
- [ ] **F5** Deterministic demo boundaries: any demo-simulated outcome (UPI deposit, partner offers) visibly labeled "demo" in the UI.

## G. Final Sign-Off

| Item | Owner | Date | Result |
| :--- | :--- | :--- | :--- |
| A1 CORS fixed | | | ☐ |
| A2 auth decision documented (demo-accept or fix) | | | ☐ |
| B1–B7 privacy checks | | | ☐ |
| C1–C5 secrets sweep | | | ☐ |
| D1–D5 validation | | | ☐ |
| E1–E6 deploy config | | | ☐ |
| F1–F5 AI security | | | ☐ |
| `pytest backend/tests` 12/12 | | | ☐ |
| `npm audit` + `pip list --outdated` reviewed | | | ☐ |

**Rule:** any 🔴/🟠 not resolved must be explicitly accepted in writing with the risk statement
("demo-only, synthetic data, no auth — accepted for offline judging") before demo/deploy day.
