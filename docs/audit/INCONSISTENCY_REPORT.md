# LifeEvent AI: Inconsistency & Contradiction Report

**Audit Date:** 2026-11-14  
**Author:** Technical Documentation Lead & Principal Systems Architect  
**Status:** Complete  
**Product:** LifeEvent AI

---

## 1. Executive Summary

During the audit of the existing eight documents in the workspace, several direct contradictions, broken references, divergent technical assumptions, and terminology mismatches were identified. This report documents each inconsistency, details the conflicting sources, evaluates the severity, and provides an authoritative resolution.

---

## 2. Inconsistency Log & Authoritative Resolutions

### INC-01: Document Directory Path Contradictions (`FreindSHare/` vs Root vs `docs/`)
- **Conflicting Sources:**
  - `CONTRIBUTING.md` (Line 84): *"Start with `FreindSHare/README.md` → `SETUP_GUIDE.md` for environment problems."*
  - `CHANGELOG.md` (Line 31): *"- Docs: `FreindSHare/` — README, PRD, TECH_STACK, IMPLEMENTATION_PLAN, RESEARCH, SECURITY_AUDIT, SETUP_GUIDE, API_REFERENCE, TESTING_QA, CONTRIBUTING."*
  - `README(1).md` (Line 4): *"Companion to the root `README.md` (which covers quick start and demo info)."*
- **Severity:** 🔴 Critical (Broken developer onboarding and dead document links)
- **Explanation:** Historical documentation artifacts from an earlier project name or subfolder (`FreindSHare`) were left in the markdown text when the documents were copied into the `LifeEvent` root directory. Furthermore, the root file was renamed to `README(1).md` due to an OS copy artifact, leaving no root `README.md`.
- **Authoritative Resolution:**
  - Eliminate all references to `FreindSHare/`.
  - Establish `docs/` as the single canonical directory for all specialized documentation.
  - Create a clean root `README.md` serving as the top-level repository entrypoint, linking directly to `docs/README.md`.
  - Retain `README(1).md` for archival integrity without deleting it.

---

### INC-02: Missing Document References in Document Map
- **Conflicting Sources:**
  - `README(1).md` (Lines 13, 14, 17) includes in its Document Map:
    - `#4 IMPLEMENTATION_PLAN.md`
    - `#5 RESEARCH.md`
    - `#8 SETUP_GUIDE.md`
  - Workspace File System: Only 8 files exist in the root folder (`API_REFERENCE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `PRD.md`, `README(1).md`, `SECURITY_AUDIT.md`, `TECH_STACK.md`, `TESTING_QA.md`).
- **Severity:** 🔴 Critical (Missing core technical specifications)
- **Explanation:** Three critical documentation files were referenced as core reading material but were omitted from the workspace.
- **Authoritative Resolution:**
  - Synthesize and generate the missing research, setup, and implementation specifications in their proper canonical locations:
    - `docs/deployment/LOCAL_SETUP.md` (replaces and expands `SETUP_GUIDE.md`).
    - `docs/product/ROADMAP.md` and `docs/audit/IMPROVEMENT_PLAN.md` (replaces and expands `IMPLEMENTATION_PLAN.md`).
    - `docs/research/MARKET_OPPORTUNITY.md`, `docs/research/TECHNICAL_FEASIBILITY.md`, and `docs/research/LIMITATIONS.md` (replaces and expands `RESEARCH.md`).

---

### INC-03: Persistence Architecture: In-Memory Dictionary vs Supabase PostgreSQL
- **Conflicting Sources:**
  - `TECH_STACK.md` (Line 21 & Line 170): *"Persistence: In-memory dict + Supabase (optional)"* and *"JOURNEY_STORE and PILOT_REQUESTS are in-memory; all journeys reset on backend restart. Supabase is the planned durable fallback."*
  - `SECURITY_AUDIT.md` (Finding A3): *"Unbounded in-memory store: JOURNEY_STORE and PILOT_REQUESTS grow without eviction — memory-exhaustion DoS via repeated intakes."*
  - Finalized Architecture Baseline (Section 3 of Mandate): *"Database and Infrastructure: Supabase PostgreSQL, Supabase Storage, Supabase Auth, pgvector, PostgreSQL Row Level Security."*
- **Severity:** 🔴 Critical (Fundamental architectural contradiction)
- **Explanation:** The prototype was quickly assembled using Python dictionaries for a local hackathon demo. However, in-memory storage violates multi-worker scalability, durability, and DPDP auditability requirements.
- **Authoritative Resolution:**
  - Formally designate **Supabase PostgreSQL** as the canonical database architecture for LifeEvent AI.
  - In-memory storage is officially classified as a **temporary prototype shim** used exclusively in local test fixtures when `SUPABASE_URL` is omitted.
  - Fully document the complete PostgreSQL schema, DDL, indexes, and RLS policies in `docs/backend/DATABASE_SCHEMA.md` and `docs/architecture/DATABASE_ARCHITECTURE.md`.

---

### INC-04: Consequential Actions: Non-Goals vs Core Product Scope
- **Conflicting Sources:**
  - `PRD.md` (Section 4 Non-Goals): *"Real disbursement of loans/UPI deposits (funding flow is simulated and clearly labeled). Real insurer/TPA integrations or hospital HIS integrations."*
  - Target Scope (Section 2 & 3 of Mandate): *"LifeEvent AI should: 8. Assess potential financial shortfalls. 9. Explore appropriate financing options. 10. Organize payment-related tasks. 11. Request customer authorization before consequential actions."*
  - Target Integration Strategy (Section 3 of Mandate): *"Create provider abstraction interfaces for: Insurance, Lending, Payments, Financial information, Document services, Health information services. Never assume access to private APIs or unrestricted financial infrastructure."*
- **Severity:** 🟠 High (Product scope and integration contradiction)
- **Explanation:** The prototype PRD treated financial actions as passive simulated UI mocks and declared integrations out of scope. In contrast, the operating system vision requires formal integration provider adapters with a strict Customer Approval Gateway.
- **Authoritative Resolution:**
  - Maintain the safety boundary: LifeEvent AI does not directly hold banking licenses or lend its own capital.
  - Define formal Provider Abstraction Interfaces (`InsuranceProvider`, `LendingProvider`, `PaymentProvider`, `AccountAggregatorProvider`, `ABDMProvider`).
  - Classify current prototype connections as **Simulated Providers**, with documented migration pathways to **Sandbox Providers** and **Production Regulated Entities (REs)**.
  - Enforce the **Customer Approval Gateway** requirement: no consequential action can execute without explicit, cryptographically verifiable, time-limited customer authorization.

---

### INC-05: Workflow Model: Linear Sequence vs Dependency-Aware Graph
- **Conflicting Sources:**
  - `TECH_STACK.md` (Section 3.1): *"The StateGraph executes these stages over a typed state dict: intake → document → coverage → gap → checklist → funding → complete"* (Strict linear 7-stage chain).
  - Target Architecture Baseline (Section 4A of Mandate): *"LifeEvent AI must use a structured graph or dependency-aware workflow representation... Task states: pending, in_progress, blocked, needs_review, awaiting_approval, completed, failed, cancelled. The backend must validate all state transitions. Do not allow the LLM to freely modify critical financial states."*
- **Severity:** 🟠 High (Orchestration model contradiction)
- **Explanation:** A linear pipeline cannot accommodate real-world hospital workflows, where asynchronous events (e.g., TPA query, doctor revision, bill amendment, family loan approval) arrive out of order and require dynamic re-planning.
- **Authoritative Resolution:**
  - Redefine the orchestration model in `docs/architecture/FINANCIAL_JOURNEY_GRAPH.md` as a **Directed Acyclic Graph (DAG)** of tasks.
  - Enforce explicit state transition validation rules in `docs/backend/STATE_MANAGEMENT.md`.
  - The linear 7-step sequence is classified as the initial intake provisioning sequence, after which the journey transitions into a living dependency graph.

---

### INC-06: Aadhaar Masking Format Discrepancy
- **Conflicting Sources:**
  - `PRD.md` (Section 5.1 & Section 7): Aadhaar input is reduced to `XXXX-XXXX-1234` form (14 characters with dashes).
  - `TESTING_QA.md` (Smoke check #3): *"Intake with an Aadhaar number → response shows it masked (`XXXX-XXXX-XXXX` last-4 only)"* (14 characters with triple XXXX).
  - `API_REFERENCE.md` (Section 5.1): Aadhaar shown as `XXXXXXXX1234` (12 characters, no hyphens).
- **Severity:** 🟡 Medium (Specification inconsistency in security-critical PII logic)
- **Explanation:** Multiple documents use slightly different string representations for masked Aadhaar numbers.
- **Authoritative Resolution:**
  - Canonical format standardized across all documentation, API schemas, and test specs: `XXXX-XXXX-1234` (standard Indian UIDAI compliance representation, masking the first 8 digits into two 4-character blocks separated by hyphens and preserving the last 4 digits).

---

### INC-07: Document Storage and Upload Architecture
- **Conflicting Sources:**
  - `API_REFERENCE.md` (Lines 61-62): *"policy_photo_preview / estimate_photo_preview: Base64 previews (transient)"*
  - `SECURITY_AUDIT.md` (Finding B3): *"previews are echoed in the journey response — confirm they are not base64 ID images in any flow; strip them from GET responses."*
  - Target Architecture (Section 3 of Mandate): *"Supabase Storage, PostgreSQL Row Level Security... Private document storage, Signed URLs."*
- **Severity:** 🟠 High (Data privacy and storage architecture flaw)
- **Explanation:** Ingestion of base64 document payloads directly into REST API JSON bodies bloats payload sizes, risks memory crashes, and exposes unencrypted sensitive documents in server request logs.
- **Authoritative Resolution:**
  - Standardize on direct-to-storage uploads via **Supabase Storage signed upload URLs**.
  - Client requests a presigned upload URL (`POST /api/journey/{id}/documents/upload-url`), uploads binary directly to Supabase private bucket `journey-documents`, and passes only the verified `storage_path` to backend processing.
  - Deprecate raw base64 previews in JSON payloads.

---

## 3. Inconsistency Tracking Matrix

| ID | Issue | Affected Files | Severity | Resolution Status | Authoritative Target File |
| :---: | :--- | :--- | :---: | :---: | :--- |
| INC-01 | `FreindSHare/` path remnants | `CONTRIBUTING.md`, `CHANGELOG.md`, `README(1).md` | 🔴 Critical | Resolved in docs suite | `README.md`, `docs/README.md` |
| INC-02 | Missing referenced documents | `README(1).md`, `CONTRIBUTING.md` | 🔴 Critical | Resolved in docs suite | `docs/audit/IMPROVEMENT_PLAN.md`, `docs/research/*`, `docs/deployment/LOCAL_SETUP.md` |
| INC-03 | In-memory vs Supabase DB | `TECH_STACK.md`, `SECURITY_AUDIT.md` | 🔴 Critical | Resolved in docs suite | `docs/backend/DATABASE_SCHEMA.md`, `docs/architecture/DATABASE_ARCHITECTURE.md` |
| INC-04 | Consequential actions non-goals | `PRD.md`, `TECH_STACK.md` | 🟠 High | Resolved in docs suite | `docs/product/PRODUCT_REQUIREMENTS.md`, `docs/integrations/*` |
| INC-05 | Linear chain vs Journey Graph | `TECH_STACK.md`, `API_REFERENCE.md` | 🟠 High | Resolved in docs suite | `docs/architecture/FINANCIAL_JOURNEY_GRAPH.md`, `docs/backend/STATE_MANAGEMENT.md` |
| INC-06 | Aadhaar masking format mismatch | `PRD.md`, `API_REFERENCE.md`, `TESTING_QA.md` | 🟡 Medium | Resolved in docs suite | Standardized to `XXXX-XXXX-1234` |
| INC-07 | Base64 previews vs Signed URLs | `API_REFERENCE.md`, `SECURITY_AUDIT.md` | 🟠 High | Resolved in docs suite | `docs/security/SECURE_FILE_HANDLING.md`, `docs/backend/API_SPECIFICATION.md` |

This inconsistency report provides the rationale for the updates applied across the canonical documentation system.

