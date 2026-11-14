# LifeEvent AI: Local Developer Setup & Runbook

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Prerequisites:** Python 3.11+, Node.js 18+ (Node 20+ LTS recommended), Git  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Quick Start (One-Click Runner)

On Windows developer machines, execute the pre-configured runner script from the repository root:

```cmd
.\run_demo.bat
```

This script:
1. Runs automated backend tests (`pytest backend/tests`).
2. Boots the FastAPI backend on port `8000`.
3. Boots the Next.js frontend on port `3000`.
4. Launches your default browser to `http://localhost:3000/journey/demo-journey-cardiac-01`.

---

## 2. Step-by-Step Manual Setup

### 2.1 Backend Setup (FastAPI & LangGraph)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# macOS / Linux:
source venv/bin/activate

# 4. Install dependencies
pip install --upgrade pip
pip install fastapi uvicorn langgraph langchain-core pydantic supabase python-multipart google-genai PyMuPDF slowapi pytest httpx

# 5. Configure environment variables
cp .env.example .env
# Open .env and add your GEMINI_API_KEY (optional if running in fixture demo mode)

# 6. Execute test suite to verify installation
python -m pytest tests/ -v

# 7. Start FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API is now running at `http://localhost:8000`.  
Interactive Swagger docs: `http://localhost:8000/docs`.

---

### 2.2 Frontend Setup (Next.js 15 / React 19)

```bash
# 1. Open a new terminal and navigate to frontend directory
cd frontend

# 2. Install npm dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# 4. Verify build with zero type errors
npm run build

# 5. Start Next.js development server
npm run dev
```
The frontend application is now running at `http://localhost:3000`.

---

## 3. Developer Verification Smoke Checks (5 Minutes)

1. Open `http://localhost:8000/api/health` in your browser. Verify `status: "healthy"` and `active_journeys >= 2`.
2. Open `http://localhost:3000/intake`. Click **"Load Cardiac Scenario"** and click **"Start Living Journey"**.
3. Confirm that the dashboard loads at `/journey/...` with the Low–Expected–High gap range.
4. Click **"Inspect Verbatim Clauses"** to confirm that page numbers, clause references, and quotes render.
5. Click **"Simulate TPA Query"** on the dashboard. Confirm that the page dynamically re-plans and prepends the urgent ECG task.
6. Open `http://localhost:3000/privacy` and click **"Erase My Data"**. Confirm that subsequent access returns 404.

---

## 4. Troubleshooting Table

| Symptom | Probable Cause | Authoritative Fix |
| :--- | :--- | :--- |
| `ModuleNotFoundError: No module named 'fastapi'` | Virtual environment not activated or pip install skipped | Activate venv (`.\venv\Scripts\activate`) and re-run `pip install -r requirements.txt`. |
| `CORS Error` in browser console | Origin mismatch in CORS middleware | Check `ALLOWED_ORIGINS` in `backend/app/main.py`. Ensure frontend is running on `http://localhost:3000`. |
| Next.js build fails with type error | Node.js version incompatible | Ensure Node.js 18.17+ or Node.js 20+ is active (`node -v`). Delete `.next` and `node_modules`, run `npm install`. |
| Voice recognition does not start | Browser does not support Web Speech API | Web Speech API requires Google Chrome, Microsoft Edge, or Safari. Ensure microphone permissions are granted. |
| Port 8000 or 3000 already in use | Lingering background process | Windows: `Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess \| Stop-Process -Force` |

