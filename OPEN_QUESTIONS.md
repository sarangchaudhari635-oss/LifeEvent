# LifeEvent AI: Open Technical & Architectural Questions

**Date:** 2026-11-14  
**Author:** Principal Software Architect & Technical Lead  
**Status:** Active Tracking  
**Rule:** When project information or partner integration parameters are unverified, record them here rather than making unwarranted assumptions.

---

## 1. Integrations & Partner APIs

### OQ-1: Insurance TPA Digital Exchange Protocols
- **Question:** Which Third-Party Administrators (TPAs) or Health Insurance Platforms provide sandbox APIs for pre-authorization submission in India (e.g., Medi Assist, Vidal Health, MDIndia, Paramount TPA, or National Health Claims Exchange - NHCX)?
- **Current Status:** `[Simulated]`. Currently simulated via deterministic fixture responses and mock replanning events.
- **Validation Requirement:** Verify API availability on the National Health Authority (NHA) NHCX platform or obtain partner sandbox credentials for standard FHIR-based claim exchange.

### OQ-2: Account Aggregator (AA) Ecosystem Onboarding
- **Question:** Which RBI-regulated Account Aggregator (e.g., Setu, Anumati, OneMoney, Finvu) will serve as the gateway for financial information provider (FIP) retrieval?
- **Current Status:** `[Proposed]`.
- **Validation Requirement:** Formal registration as a Financial Information User (FIU) under the Sahamati framework, or connection to Setu AA Sandbox for consent management and bank statement pulling.

### OQ-3: Digital Lending Guidelines (DLG) Compliance Partner
- **Question:** Which Regulated Entity (NBFC or Scheduled Commercial Bank) will act as the principal balance-sheet lender for the emergency bridge credit flow?
- **Current Status:** `[Simulated]`. Terms and offers are labeled as illustrative demo partners.
- **Validation Requirement:** Under the RBI Digital Lending Guidelines (2022/2023), LifeEvent AI must operate strictly as a Lending Service Provider (LSP) with direct borrower-to-RE loan agreements and RE-controlled disbursements. Identify prospective NBFC partner sandbox for pre-qualification API specs.

### OQ-4: DigiLocker & ABDM Integration Tier
- **Question:** Will DigiLocker and ABDM integrations run via API Setu / National Health Authority sandboxes, or through an authorized intermediary (e.g., Signzy, Bureau, Setu)?
- **Current Status:** `[Proposed]`.
- **Validation Requirement:** Determine whether hackathon evaluation permits direct NHA ABDM sandbox registration (M1, M2, M3 milestones) or if intermediate API wrappers should be modeled in the adapter layer.

---

## 2. Infrastructure & Persistence

### OQ-5: Source Code Repository Synchronization
- **Question:** The local workspace directory (`C:\Users\Sarang Chaudhari\OneDrive\Desktop\LifeEvent`) currently contains documentation files only. Where is the active code repository containing `backend/`, `frontend/`, `tests/`, and `run_demo.bat` hosted?
- **Current Status:** `[Not Yet Verified in Current Workspace]`.
- **Validation Requirement:** Confirm the Git remote origin or repository path so automated tests, Playwright visual QA, and backend dependencies can be synchronized directly into this workspace.

### OQ-6: Supabase Deployment Tier & pgvector Index Sizing
- **Question:** For production deployment, what is the expected scale of policy clause embeddings (HNSW vs IVFFlat index), and what chunking strategy optimizes retrieval accuracy for multi-page IRDAI insurance policies?
- **Current Status:** `[Planned]`.
- **Validation Requirement:** Benchmark Gemini embedding models (e.g., `text-embedding-004`) on 50 sample Indian health insurance schedules to evaluate chunk sizes (500 tokens vs 1000 tokens with 15% overlap) and cosine similarity thresholds.

---

## 3. Product & Regulatory

### OQ-7: DPDP Consent Architecture & Data Retention
- **Question:** Under Section 6 and Section 8 of India's Digital Personal Data Protection (DPDP) Act 2023, what is the precise retention period for masked insurance records when an emergency hospital claim remains pending resolution with a TPA?
- **Current Status:** `[Design Baseline Established]`. The system supports immediate user-initiated hard delete (`DELETE /api/journey/{id}`).
- **Validation Requirement:** Consult legal counsel regarding the statutory retention requirement for audit logs under IRDAI claims regulations versus the right to erasure under the DPDP Act 2023.

