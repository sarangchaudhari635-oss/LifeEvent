# LifeEvent AI: Architecture Decision Records (ADRs)

**Document Version:** 2.0  
**Status:** Approved  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Overview of Architecture Decision Records

This document formalizes the fundamental technical decisions, trade-offs, and design rationales governing LifeEvent AI.

| ADR ID | Title | Status | Context / Problem | Decision |
| :---: | :--- | :---: | :--- | :--- |
| **ADR-01** | Central Orchestrator vs Multi-Agent Swarm | Accepted | Uncoordinated autonomous agents create race conditions and unpredictable state mutations in critical financial workflows. | Adopt a single Central Orchestrator with specialized service modules and a deterministic Financial Journey Graph. |
| **ADR-02** | Deterministic Python Math vs LLM Financial Calculation | Accepted | LLMs suffer from stochastic arithmetic errors, hallucinations, and non-reproducibility when calculating complex financial liabilities. | Decouple reasoning from arithmetic: all gap math, room-rent penalties, and co-pays are computed deterministically in Python. |
| **ADR-03** | Supabase PostgreSQL + pgvector vs In-Memory Dict | Accepted | In-memory storage is ephemeral, non-scalable, and vulnerable to DoS; lacks multi-user isolation and compliance auditing. | Establish Supabase PostgreSQL with `pgvector` and Row Level Security (RLS) as mandatory primary persistence. |
| **ADR-04** | Verhoeff Checksum Algorithm for Aadhaar Masking | Accepted | Regex pattern matching for 12 digits creates high false positives (masks phone numbers, policy numbers, PIN codes). | Use the mathematical Verhoeff checksum algorithm (dihedral group $D_5$) to strictly identify genuine Aadhaar numbers before masking to `XXXX-XXXX-1234`. |
| **ADR-05** | Provider Abstraction Layer for External Integrations | Accepted | Hardcoding mock APIs into UI components prevents smooth migration to sandbox and production fintech/health environments. | Implement domain-driven Provider Abstraction Interfaces (`InsuranceProvider`, `LendingProvider`, etc.) with configurable mock/sandbox drivers. |
| **ADR-06** | Customer Approval Gateway for Consequential Actions | Accepted | Autonomous AI execution of loan applications or payment transfers violates RBI guidelines and customer agency. | Mandate a Customer Approval Gateway requiring explicit, time-limited, cryptographic user authorization for all consequential actions. |
| **ADR-07** | Dual-Engine AI Architecture (Gemini 2.0 + Fixture Shield) | Accepted | Network latency or LLM API outages during hackathon judging or hospital admissions causes total application failure. | Implement a dual-engine architecture: primary Google Gemini 2.0 with automatic zero-downtime fallback to a deterministic fixture shield. |
| **ADR-08** | Presigned S3 Storage URLs vs Base64 JSON Payloads | Accepted | Passing raw base64 document strings in REST JSON payloads causes memory spikes, slow transfers, and unencrypted log exposure. | Transition to direct-to-storage uploads using Supabase Storage private buckets and 15-minute expiring signed URLs. |

---

## 2. Detailed Architecture Decision Records

### ADR-01: Central Orchestrator vs Multi-Agent Swarm
- **Context:** Many modern "agentic" demonstrations deploy independent autonomous agents (e.g., an Insurance Agent, a Lending Agent, a Payment Agent) communicating via free-form text. In a regulated healthcare emergency, this architecture creates non-deterministic execution, unvalidated state transitions, circular deadlocks, and audit failures.
- **Decision:** LifeEvent AI utilizes a single **Central Orchestrator** backed by a deterministic **Financial Journey Graph (DAG)**. Specialized capabilities (OCR extraction, clause verification, gap calculation, loan sizing) are exposed as deterministic service modules invoked by the orchestrator.
- **Consequences:**
  - *Positive:* 100% predictable state transitions; auditable task dependency tracking; no agent race conditions.
  - *Negative:* Central orchestrator codebase requires disciplined modular design to prevent becoming a monolithic controller.

---

### ADR-02: Deterministic Python Math vs LLM Financial Calculation
- **Context:** Insurance out-of-pocket calculations involve complex multi-variable equations: IRDAI room-rent sub-limits, proportional loss sharing across associated medical charges, non-payable consumable exclusions (Clause 4.8), and percentage co-pays. Generating these numbers via LLM prompt instructions leads to rounding errors, inconsistent totals across turns, and regulatory non-compliance.
- **Decision:** The LLM is strictly restricted to semantic classification and entity extraction. All monetary calculations are executed in Python (`backend/app/core/gap_calculator.py`).
- **Consequences:**
  - *Positive:* Zero hallucinated rupee figures; mathematical auditability; instant sub-millisecond calculation speed.
  - *Negative:* Financial rules must be explicitly coded in Python rather than relying on natural language prompt instructions.

---

### ADR-03: Supabase PostgreSQL + pgvector vs In-Memory Dictionary
- **Context:** The hackathon prototype utilized an in-memory dictionary (`JOURNEY_STORE = {}`) for rapid local development. This approach resulted in total data loss on backend restarts, inability to run multiple uvicorn workers, and lack of tenant data isolation.
- **Decision:** Adopt **Supabase PostgreSQL** as the core database, leveraging:
  1. Relational schema with foreign keys and cascade rules.
  2. PostgreSQL Row Level Security (RLS) enforcing tenant isolation at the SQL engine level.
  3. `pgvector` extension for storing 768-dimensional embeddings of insurance policy clauses.
- **Consequences:**
  - *Positive:* Enterprise durability; transactional safety; compliance with DPDP data governance.
  - *Negative:* Requires managing database migration scripts and cloud connection credentials.

---

### ADR-04: Verhoeff Checksum Algorithm for Aadhaar Masking
- **Context:** Under Section 4 of India's Aadhaar Act and the DPDP Act 2023, storing or logging unmasked 12-digit Aadhaar numbers is illegal. Standard regexes (`\b\d{12}\b`) frequently produce false positives, incorrectly redacting valid 12-digit policy numbers, transaction references, or phone numbers with country codes.
- **Decision:** Implement the mathematical **Verhoeff Checksum Algorithm** in Python and TypeScript. The algorithm validates the 12th digit against the $D_5$ dihedral permutation group. Only numbers that pass the checksum are masked to `XXXX-XXXX-1234`.
- **Consequences:**
  - *Positive:* Zero false positive redactions of policy numbers; guaranteed masking of genuine Aadhaar numbers before logging or LLM transmission.
  - *Negative:* Slightly higher CPU evaluation cost per 12-digit sequence (negligible in practice, < 0.05ms).

---

### ADR-05: Provider Abstraction Layer for External Integrations
- **Context:** Connecting to live insurance TPAs, banks, and hospital management systems during a hackathon is impossible due to regulatory licensing and private network constraints. However, hardcoding static JSON mocks in frontend components makes the code brittle and non-extensible.
- **Decision:** Define formal **Provider Abstraction Interfaces** (Python Abstract Base Classes) for Insurance, Lending, Payments, Account Aggregator, DigiLocker, and ABDM. Implement both `SimulatedProvider` and `SandboxProvider` drivers selectable via environment configuration.
- **Consequences:**
  - *Positive:* Production-ready architecture; pluggable adapters; zero changes to core journey orchestration when graduating from mock to sandbox.
  - *Negative:* Additional abstraction layer overhead during initial prototyping.

---

### ADR-06: Customer Approval Gateway for Consequential Actions
- **Context:** Allowing an AI system to autonomously submit insurance claims, accept loan terms, or initiate UPI transactions creates severe legal liability and violates RBI Digital Lending Guidelines.
- **Decision:** Enforce a **Customer Approval Gateway**. Any consequential financial action transitions the task to `awaiting_approval`. The system issues an `ApprovalRequest` with an expiration timer and cryptographic hash. The user must review a Key Fact Statement (KFS) and provide step-up authentication (biometric/OTP) to authorize execution.
- **Consequences:**
  - *Positive:* Absolute regulatory compliance; user retains total agency; verifiable audit trail.
  - *Negative:* Introduces a human pause in fully automated workflows (which is an intentional safety feature).

---

### ADR-07: Dual-Engine AI Architecture (Gemini 2.0 + Fixture Shield)
- **Context:** Cloud LLM APIs are subject to latency spikes, quota exhaustion, and occasional outages. In a hackathon presentation or emergency hospital intake, an API failure destroys the user experience.
- **Decision:** Build a **Dual-Engine Router**. The system prioritizes Google Gemini 2.0 for live multimodal reasoning. If the API returns an error or if demo mode is enabled, the request gracefully routes to a **Deterministic Fixture Shield** without throwing 500 errors.
- **Consequences:**
  - *Positive:* 100% presentation availability; offline capability; resilient user experience.
  - *Negative:* Fixture datasets must be maintained and synchronized with the latest Pydantic schemas.

---

### ADR-08: Presigned S3 Storage URLs vs Base64 JSON Payloads
- **Context:** Transmitting 10MB multi-page scanned medical bills and policy PDFs as base64 strings in REST API JSON request bodies degrades network throughput, inflates payload sizes by 33%, and risks exposing unencrypted PII in API server access logs.
- **Decision:** Implement **direct-to-storage presigned uploads**. The client requests an upload URL (`POST /api/journey/{id}/documents/upload-url`), transfers the binary directly to a private Supabase Storage bucket with AES-256 server-side encryption, and passes only the authenticated `storage_path` to the backend.
- **Consequences:**
  - *Positive:* Lightweight API payloads; backend servers freed from binary stream handling; documents protected by short-lived signed URLs.
  - *Negative:* Requires a two-step upload flow on the client (get signed URL, upload binary, register document).

