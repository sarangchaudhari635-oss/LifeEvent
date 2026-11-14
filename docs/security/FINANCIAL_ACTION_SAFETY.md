# LifeEvent AI: Financial Action Safety & Approval Gateway

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Regulatory Standards:** RBI Digital Lending Guidelines / IRDAI Claims Conduct  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Consequential Financial Action Taxonomy

In LifeEvent AI, tasks within the Financial Journey Graph are classified into two categories:
1. **Informational / Analytical Tasks (Safe for Autonomous Evaluation):**  
   - Parsing OCR lines from a hospital estimate.
   - Searching vector embeddings for room-rent clauses.
   - Calculating out-of-pocket gap ranges.
   - Checking required document checklists.
2. **Consequential Financial Actions (STRICTLY PROHIBITED from Autonomous Execution):**  
   - Authorizing a ₹50,000 caution deposit via Paytm UPI.
   - Applying for or accepting an emergency medical bridge credit offer.
   - Submitting a formal cashless pre-authorization claim dossier to an insurer.
   - Waiving or agreeing to room-rent downgrade terms with a hospital.

---

## 2. The Customer Approval Gateway Architecture

No consequential financial action can execute without passing through the **Customer Approval Gateway**:

```mermaid
flowchart TD
    ORCH["Central Orchestrator prepares Consequential Action"] --> GEN_APPR["Approval Gateway: Creates ApprovalChallenge"]
    
    subgraph ChallengeCreation ["Challenge & Hash Generation"]
        PARAMS["Action Parameters:\nAmount, Payee VPA, Terms, KFS"]
        HASH["Compute SHA-256 Hash of Sorted Parameters"]
        EXPIRY["Set Expiration Timer (+15 Minutes)"]
        COMMIT["Store Record in approval_requests (Status: 'pending')"]
    end

    GEN_APPR --> PARAMS --> HASH --> EXPIRY --> COMMIT
    COMMIT --> UI["Render Customer Approval Modal in Client UI"]
    
    subgraph UserAction ["Customer Verification & Decision"]
        UI --> REVIEW["Customer reviews Key Fact Statement & Exact Numbers"]
        REVIEW --> STEPUP["Customer executes Step-Up Auth (Biometric / OTP)"]
        STEPUP --> SUBMIT["POST /api/journey/{id}/tasks/{task_id}/approve"]
    end

    SUBMIT --> GATEWAY_VERIFY{"Approval Gateway Verification"}
    GATEWAY_VERIFY -->|Token Expired? (>15 mins)| REJECT_EXP["Reject: 'Challenge Expired' (409 Conflict)"]
    GATEWAY_VERIFY -->|Parameters Tampered? (Hash Mismatch)| REJECT_TAMP["Reject: 'Parameter Tampering' (409 Conflict)"]
    GATEWAY_VERIFY -->|Step-Up Token Invalid?| REJECT_AUTH["Reject: 'Unauthorized' (401 Unauthorized)"]
    GATEWAY_VERIFY -->|Valid & Non-Expired| DISPATCH["Dispatch Action to Provider (Paytm UPI / NBFC)"]
    DISPATCH --> MARK_COMPLETED["Task State transitions to 'completed'"]
```

---

## 3. Cryptographic Parameter Hash Verification

To prevent "Man-in-the-Middle" or "Time-of-Check to Time-of-Use" (TOCTOU) parameter manipulation (e.g., an attacker intercepting the request and changing the payee account number from the hospital billing desk to a personal account):

1. **At Challenge Generation:**  
   The gateway canonicalizes all action parameters and computes an immutable SHA-256 hash:
   $$\text{Hash}_{\text{expected}} = \text{SHA-256}\left(\text{JSON}_{\text{canonical}}(\text{parameters})\right)$$
2. **At Customer Submission:**  
   The API endpoint re-computes the SHA-256 hash of the parameters submitted with the user's approval token:
   $$\text{Hash}_{\text{actual}} = \text{SHA-256}\left(\text{JSON}_{\text{canonical}}(\text{current\_parameters})\right)$$
3. **Integrity Enforcement:**  
   If $\text{Hash}_{\text{actual}} \neq \text{Hash}_{\text{expected}}$, the transaction is instantly aborted, logged as a security tamper event in `audit_logs`, and the task is moved to `blocked`.

---

## 4. Idempotency Key Specification

All mutating payment and lending calls require a client-generated **UUID v4 Idempotency Key**:
- **Header:** `Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`
- **Cache Window:** Cached in Redis / Supabase for **24 hours**.
- **Behavior:**
  - If a second request arrives with the same idempotency key while the first is in progress, the API returns `409 Conflict (IDEMPOTENCY_CONFLICT)`.
  - If a second request arrives after completion, the API returns the exact cached result of the original execution without re-initiating bank or UPI transfers.

This guarantees that an anxious attendant tapping the "Pay Caution Deposit" button multiple times under spotty hospital Wi-Fi is never charged twice.

