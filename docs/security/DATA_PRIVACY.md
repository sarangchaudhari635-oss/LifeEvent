# LifeEvent AI: Data Privacy Charter & DPDP Act 2023 Compliance

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Governing Statute:** Digital Personal Data Protection (DPDP) Act 2023 (Republic of India)  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Compliance Framework: DPDP Act 2023 Alignment

Under India's Digital Personal Data Protection Act 2023, personal data—particularly health and financial data—is subject to strict processing standards:

| DPDP Act Provision | Legal Obligation | LifeEvent AI Architectural Implementation |
| :--- | :--- | :--- |
| **Section 5 (Notice)** | Inform citizen of purpose and rights in clear language | Multilingual privacy notices presented at intake in English, Hindi, and Marathi (`/privacy`). |
| **Section 6 (Consent)** | Consent must be free, specific, informed, and unambiguous | Explicit consent modal prior to document processing; separate consent for loan pre-qualification. |
| **Section 7 (Legitimate Uses)**| Processing permitted for medical emergencies | Emergency triage mode permits immediate intake processing to preserve life and treatment continuity. |
| **Section 8 (Data Minimization)**| Collect only necessary data; destroy when purpose served | Raw ID photos immediately discarded; Aadhaar masked; temporary processing buffers purged. |
| **Section 12 (Right to Erasure)**| Citizen has absolute right to erase personal data | One-click permanent hard delete via `DELETE /api/journey/{id}`. |
| **Section 13 (Grievance Redressal)**| Mechanism to address privacy concerns | Designated Data Protection Officer contact and automated erasure audit logging. |

---

## 2. The Verhoeff Aadhaar Masking Protocol

Under Section 29 of the Aadhaar Act, storing unmasked 12-digit Aadhaar numbers without specialized UIDAI vault authorization is a criminal offense.

### The Problem with Simple Regex:
Standard regular expressions (e.g. `\b\d{12}\b`) trigger false positives on:
- 12-digit policy schedule numbers (e.g., `SH-2026-90812412`).
- Bank transaction reference numbers (UTR/RRN).
- Phone numbers formatted with country codes (`+919820123456`).

### The Verhoeff Solution:
LifeEvent AI validates the 12th check digit using the **dihedral group $D_5$ permutation and multiplication tables**:
$$\sum_{i=0}^{11} d\left(p\left(i \pmod 8, d_i\right)\right) = 0$$

Only numbers that satisfy this mathematical equation are classified as genuine Aadhaar numbers and masked to:
$$\text{XXXX-XXXX-}d_8 d_9 d_{10} d_{11}$$

```python
# backend/app/core/security.py
def mask_aadhaar_verhoeff(text: str) -> str:
    """
    Finds 12-digit sequences, verifies them with Verhoeff, and masks valid ones to XXXX-XXXX-1234.
    Leaves phone numbers and policy codes untouched.
    """
    def replace_match(match):
        raw_number = match.group(0).replace(" ", "").replace("-", "")
        if len(raw_number) == 12 and validate_verhoeff(raw_number):
            return f"XXXX-XXXX-{raw_number[-4:]}"
        return match.group(0) # Preserve untouched if checksum fails

    # Match 12-digit patterns with optional hyphens/spaces
    pattern = r'\b\d{4}[ -]?\d{4}[ -]?\d{4}\b'
    return re.sub(pattern, replace_match, text)
```

---

## 3. Right to Erasure Implementation (`DELETE /api/journey/{id}`)

When a user exercises their right to data erasure:
1. **Relational Cascade:** The PostgreSQL engine deletes the journey row, cascading to `journey_documents`, `coverage_findings`, `journey_tasks`, and `approval_requests`.
2. **Object Storage Purge:** All binary files in Supabase Storage matching `storage_path = 'journeys/{id}/*'` are permanently deleted.
3. **Audit Anonymization:** An audit entry records only that an erasure event occurred at timestamp $T$ for a hashed journey identifier. Zero personal or medical data is retained.
4. **Subsequent Lookup:** Any subsequent request to `GET /api/journey/{id}` returns `404 Not Found`.

