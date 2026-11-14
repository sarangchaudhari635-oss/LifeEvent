# LifeEvent AI: Technical Differentiation (For Technical Judges)

**Document Version:** 2.0  
**Context:** Paytm AI Hackathon (Build for India) — Technical Jury Evaluation  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Deep Technical Comparison for Evaluators

| Architectural Dimension | Generic AI Chatbot / Wrapper | LifeEvent AI Operating System |
| :--- | :--- | :--- |
| **Orchestration Model** | Linear conversational prompt loop; stochastic next-token prediction | **Deterministic LangGraph StateGraph & Dynamic DAG Engine** |
| **Financial Calculations** | LLM prompt instruction: *"Estimate out-of-pocket cost"* (Frequent arithmetic errors & hallucinations) | **Deterministic Python Arithmetic Engine** (`gap_calculator.py`) enforcing statutory IRDAI formulas |
| **Evidence Grounding** | Generic claims: *"Your policy covers angioplasty"* without contractual proof | **Verbatim Citation Gate**: Every claim is matched character-by-character to source text (Page + Clause) |
| **Handling Planted Traps** | Believes fabricated clauses inserted in prompt | **Guaranteed Rejection**: Catches planted traps (e.g., Clause 9.9 Luxury Living), forcing coverage to ₹0 |
| **PII Data Redaction** | Naive 12-digit regex (masks phone numbers, policy numbers, and PIN codes) | **Mathematical Verhoeff Checksum ($D_5$ Dihedral Group)**: Strictly masks valid Aadhaar numbers to `XXXX-XXXX-1234` |
| **Event Re-planning** | Static single-turn response | **Dynamic Graph Mutation**: Webhook or counselor triggers re-plan on TPA query, updating DAG dependencies live |
| **Consequential Actions** | Autonomous tool calling without human consent | **Customer Approval Gateway**: 15-min expiring cryptographic parameter hash + step-up biometric/OTP authorization |
| **High Availability** | Direct dependency on external API (Fails during API outage or rate limit) | **Dual-Engine Architecture**: Automatic zero-downtime routing between Gemini 2.0 and Deterministic Fixture Shield |

---

## 2. Mathematical Formalization of Core Engines

### 2.1 The Verhoeff Checksum Formula ($D_5$)
The algorithm operates on the dihedral group $D_5$ of order 10:
$$\sum_{i=0}^{11} d\left(p\left(i \pmod 8, d_i\right)\right) = 0$$
where $d$ is the $10 \times 10$ multiplication table and $p$ is the $8 \times 10$ permutation matrix. 
- Transposition errors ($d_i d_{i+1} \to d_{i+1} d_i$) are detected with **100% certainty**.
- Single-digit substitution errors are detected with **100% certainty**.

### 2.2 The IRDAI Room-Rent Proportional Deduction Equation
$$\text{Rent Penalty} = (\text{Actual Rent} - \text{Allowed Rent}) \times \text{Days} + \text{Associated Expenses} \times \left(1 - \frac{\text{Allowed Rent}}{\text{Actual Rent}}\right)$$
$$\text{Admissible Base} = \text{Total Estimate} - 0.10 \times \text{Total Estimate}$$
$$\text{Net Insurer Payable} = \min(\text{Admissible Base} - \text{Rent Penalty}, \text{Sum Insured}) \times (1 - \text{CoPay \%})$$
$$\text{Expected Gap} = \text{Total Estimate} - \text{Net Insurer Payable}$$

This ensures that out-of-pocket predictions reflect the exact deductions applied by TPA medical billing auditors at hospital discharge.

