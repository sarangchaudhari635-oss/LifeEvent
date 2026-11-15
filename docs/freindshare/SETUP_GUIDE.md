# Setup & Development Guide

**Product:** LifeEvent AI
Step-by-step environment setup, common troubleshooting, and day-to-day development commands.

---

## 1. Prerequisites

| Tool | Minimum version | Check command |
| :--- | :--- | :--- |
| Python | 3.11+ | `python --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | any recent | `git --version` |

Optional (for AI engine): a Google Gemini API key from [https://aistudio.google.com](https://aistudio.google.com).
**Without a key the app still works** — the deterministic fixture shield takes over.

## 2. Clone & Install

```bash
git clone <repo-url>
cd Pytm2
```

### Backend dependencies

```bash
python -m pip install fastapi uvicorn langgraph langchain-core supabase python-multipart google-genai PyMuPDF slowapi pytest
```

### Frontend dependencies

```bash
cd frontend
npm install
```

### Root (QA tooling — optional)

```bash
npm install   # installs Playwright for screenshot QA
```

## 3. Run the App

### One-click (Windows)

```powershell
.\run_demo.bat
```

This: runs unit tests → boots FastAPI on **:8000** → boots Next.js on **:3000** → opens the browser.

### Manual (two terminals)

```bash
# Terminal 1 — backend
python -m uvicorn backend.app.main:app --port 8000

# Terminal 2 — frontend
cd frontend
npm run build
npm run start -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000). Backend health check: [http://localhost:8000/api/health](http://localhost:8000/api/health).

## 4. Environment Variables

Create `frontend/.env.local` / backend `.env` as needed (never commit them):

```ini
# backend/.env
GEMINI_API_KEY=your_key_here        # optional — fixture shield works without it
SUPABASE_URL=...                    # optional — in-memory store is default
SUPABASE_KEY=...
```

## 5. Run Tests

```bash
python -m pytest backend/tests
```

Expected: **12 passed**. Suites:

| File | Tests | Covers |
| :--- | :-: | :--- |
| `test_aadhaar.py` | 4 | Verhoeff validation + masking rules |
| `test_citation.py` | 3 | Verbatim passage matching |
| `test_gap.py` | 2 | Honest gap range math |
| `test_graph.py` | 1 | LangGraph pipeline integrity |
| `test_hard_delete.py` | 2 | DPDP hard-delete behavior |

## 6. Troubleshooting

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `ModuleNotFoundError: langgraph` | Deps not installed in the active Python | Re-run the pip install line; check `python --version` matches the env |
| Port 8000/3000 already in use | Previous run still alive | `netstat -ano \| findstr :8000` → `taskkill /PID <pid> /F` |
| Frontend 404s all API calls | Backend not running | Start backend first; verify `/api/health` |
| Demo journeys missing after restart | In-memory store resets on boot | Expected behavior — demo journeys re-seed automatically via `init_demo_journeys()` |
| Gemini errors in logs | No/invalid API key | App falls back to fixture shield; set `GEMINI_API_KEY` to enable the live engine |
| `npm run build` type errors | Stale `.next` cache | Delete `frontend/.next` and rebuild |
| Tests fail after your change | Regression | Run `python -m pytest backend/tests -v` to see the failing suite; money-math changes must update `test_gap.py` |

## 7. Daily Workflow Cheatsheet

```bash
# before starting work
git pull && python -m pytest backend/tests

# work on a branch
git checkout -b feat/<task-id>-<short-name>

# frontend lint/build check
cd frontend && npm run build

# before PR
python -m pytest backend/tests   # 12 passed required
```
