# LifeEvent AI — Project Documentation

> Everything a new collaborator needs to understand, build, verify, and harden LifeEvent AI.
> Companion to the root [`README.md`](../README.md) (which covers quick start and demo info).

## Document Map

| # | Document | Purpose | When to read |
| :- | :--- | :--- | :--- |
| 1 | [`PRD.md`](PRD.md) | Product Requirements Document — problem, users, features, acceptance criteria | First, to understand **what** we build and **why** |
| 2 | [`TECH_STACK.md`](TECH_STACK.md) | Full stack breakdown, architecture, project structure | Second, to understand **how** it's built |
| 3 | [`API_REFERENCE.md`](API_REFERENCE.md) | Every endpoint with request/response examples, schemas, gap-math reference | Before touching the backend |
| 4 | [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) | Phased build plan with tasks, milestones, and definition of done | Before writing any code |
| 5 | [`RESEARCH.md`](RESEARCH.md) | Domain research — IRDAI rules, DPDP Act 2023, hackathon problem statement, competitive landscape | For context and to defend design decisions |
| 6 | [`SECURITY_AUDIT.md`](SECURITY_AUDIT.md) | Post-development security audit: checklist + findings already present in the codebase | **After** development, before any demo/deploy |
| 7 | [`TESTING_QA.md`](TESTING_QA.md) | Test suites, smoke checks, route checklist, multi-viewport + accessibility QA | Before every commit and demo |
| 8 | [`SETUP_GUIDE.md`](SETUP_GUIDE.md) | Environment setup, run commands, troubleshooting table | Day one, when something won't boot |
| 9 | [`CONTRIBUTING.md`](CONTRIBUTING.md) | Branch/PR workflow, code rules, review checklist | Before your first PR |
| 10 | [`CHANGELOG.md`](CHANGELOG.md) | Version history and known issues | To catch up on state |

## The 60-Second Summary

**LifeEvent AI** is a guided financial journey for Indian families at the hospital counter during a
medical emergency. It ingests an insurance policy + hospital estimate, computes an **honest**
out-of-pocket gap range (Low–Expected–High, using real IRDAI penalty rules), verifies every
coverage claim against verbatim policy text (anti-hallucination citations), masks Aadhaar numbers
mathematically (Verhoeff checksum), and adapts the journey live when new events (e.g., a TPA
pre-auth query) arrive.

## Project Snapshot

- **Context:** Paytm AI Hackathon (Build for India), Pune — PS-2: AI-Powered Financial Journeys
- **Team:** Crazy Coders (Sarang Chaudhari, Sumit Kalr, Sanskar Thorat)
- **Status:** Working prototype — 12/12 backend tests passing, full frontend flow, demo fixtures + live intake pipeline
- **Stack:** Next.js 15 / React 19 · FastAPI · LangGraph StateGraph · Google Gemini 2.0 · Supabase (optional persistence) · PyMuPDF · slowapi

## For the New Collaborator — Suggested Path

1. Run the project: `.\run_demo.bat` (backend on :8000, frontend on :3000).
2. Read [`PRD.md`](PRD.md) to understand the hospital-counter problem and the 5 user questions.
3. Read [`TECH_STACK.md`](TECH_STACK.md) § Architecture and § API Reference.
4. Pick up a phase/task from [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md).
5. Before merging to a deploy/demo state, work through [`SECURITY_AUDIT.md`](SECURITY_AUDIT.md) —
   several items there are **already known issues in the current code** (e.g., CORS wildcard).
6. Run `python -m pytest backend/tests` — all 12 tests must pass before any commit.
7. Follow [`CONTRIBUTING.md`](CONTRIBUTING.md) for branches, PRs, and review rules.

## Ground Rules for Collaboration

- Never commit real Aadhaar numbers, policy numbers, or patient data — even in fixtures, comments, or test files.
- Every coverage figure shown to the user must be traceable to a verbatim `evidence_passage` + `clause_ref`. No exceptions.
- Tests must stay green: `python -m pytest backend/tests` (12 passed).
- New backend features need a corresponding test in `backend/tests/`.
- Respect `prefers-reduced-motion` and the design tokens in `design-system/` on the frontend.
