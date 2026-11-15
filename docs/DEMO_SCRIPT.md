# 🏆 LifeEvent AI — Official 3-Minute Hackathon Demo Script
### Paytm AI Hackathon (Build for India) &bull; PS-2: AI-Powered Financial Journeys
**Team Crazy Coders:** Sarang Chaudhari, Sumit Kalr, Sanskar Thorat

---

## ⏱️ Timeline Breakdown (Total: 3 Minutes)

| Time | Phase | Screen | What to Say & Do |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:30** | The Hook & Problem | `/` (Home) | Anchor on the traumatic hospital admission counter crisis. |
| **0:30 - 1:00** | Intake & Redaction | `/intake` & `/documents` | Voice intake + Zero-knowledge Verhoeff Aadhaar redaction. |
| **1:00 - 1:45** | Honest Gap & Evidence | `/journey/[id]` & `/coverage` | Show estimated range (₹1.44L–₹1.76L) + String-matched policy clauses. |
| **1:45 - 2:15** | Dynamic Re-planning | `/journey/[id]` | Click "Simulate: TPA Pre-Auth Query" (The Wow Moment). |
| **2:15 - 2:45** | Funding & UPI Deposit | `/journey/[id]/funding` | Show honest demo partner offers + Simulate instant ₹50,000 Paytm UPI deposit. |
| **2:45 - 3:00** | B2B & Wrap-up | `/counselor` & `/for-hospitals` | Hospital counselor view, SaaS model, and closing summary. |

---

## 🎤 Detailed Script & Talking Points

### Step 1: The Hook (0:00 - 0:30)
> *"Judges, imagine your father is suddenly rushed to an emergency room with chest pain. He's being prepped for ICU. At the counter, you're not asked about his health—you're asked 5 financial questions you can't answer: What will insurance cover? Which documents do we need right now? How much cash must we arrange? Where do we get help? And what do we do next?*
> 
> *Today, insurance, lending, and payments operate in complete silos. We built **LifeEvent AI** to turn this life event into one guided, evidence-backed financial journey."*

### Step 2: Intake & Zero-Knowledge Redaction (0:30 - 1:00)
> *(Click **Start Emergency Intake** ➔ Click **Try Sample Emergency (Cardiac)**)*
> 
> *"In a panic, families can't fill 40 form fields. Attendants simply speak in English, Hindi, or Marathi. Our system extracts the critical clinical context.*
> 
> *More importantly: privacy. Before any document reaches the AI or logs, our custom Indian **Verhoeff mathematical checksum algorithm** automatically detects and masks 12-digit Aadhaar numbers to `XXXX-XXXX-1234`. 10-digit phone numbers and policy codes are preserved with zero false positives. Identity document photos are discarded immediately and never stored or sent to LLMs."*

### Step 3: Honest Range & Anti-Hallucination Evidence (1:00 - 1:45)
> *(Click **Start Financial Journey** ➔ Arrive on `/journey/[id]`)*
> 
> *"Look at this financial summary card. Notice we **never claim an exact liability**—that would be dishonest. Hospital liabilities depend on room rent caps and consumables.*
> 
> *Instead, we calculate an **honest estimated range: ₹1,44,000 to ₹1,76,000**, with an expected out-of-pocket gap of ₹1,60,000. We explicitly break down why: policy Section 2.1 caps standard rooms at ₹5,000/day, but the hospital billed ₹8,500/day, triggering IRDAI proportionate deductions across associated fees, plus 10% non-payable gloves and syringes.*
> 
> *(Click **View Clause Evidence**)*
> 
> *Every single recommendation is string-matched against the actual policy PDF. Green badges prove verbatim character-matching. Unverified claims are flagged in amber for manual TPA verification—zero AI hallucinations."*

### Step 4: The Dynamic Re-planning "Wow Moment" (1:45 - 2:15)
> *(Navigate back to Living Journey ➔ Point to the timeline)*
> 
> *"A hospital admission is not a static chatbot conversation—it's a living event. Watch what happens when new information arrives.*
> 
> *(Click **Simulate: TPA Pre-Auth Query**)*
> 
> *The Insurer TPA desk just raised a query requesting the initial casualty admission ECG strip. Instantly, our LangGraph engine re-plans the entire living journey in real time. The top-priority action dynamically updates, and a new urgent task is pushed to the family's checklist."*

### Step 5: Bridge Funding & Instant Paytm UPI Deposit (2:15 - 2:45)
> *(Click **View Funding & Payment Plan**)*
> 
> *"To bridge the ₹1,60,000 gap without delaying surgery, we present vetted emergency credit lines—honestly labeled as demo partners.*
> 
> *And right here: the hospital requires a ₹50,000 caution deposit before transferring the patient to the Cath Lab. The family clicks **Simulate Instant UPI Deposit**, the payment reconciles, and a digital receipt is transmitted to the hospital desk in under 3 seconds."*

### Step 6: Hospital B2B & Closing (2:45 - 3:00)
> *(Click **Hospital Console**)*
> 
> *"For hospitals, we provide a Counselor Console showing patient document readiness scores and query ETAs—cutting cashless admission delays by 45 minutes. Our B2B model is a ₹25,000/month SaaS subscription for hospital billing desks, while remaining 100% free for Indian families.*
> 
> *And when the family leaves, our **DPDP Act Hard Delete** guarantees total data erasure.*
> 
> *Thank you—we are Team Crazy Coders, and this is LifeEvent AI."*

---

## 🎯 Anticipated Judge Q&A Cheat Sheet

#### Q1: "What if the venue Wi-Fi drops or the Gemini API experiences rate limits?"
> **Answer**: *"We engineered a dual-engine architecture. While the live app connects directly to Google Gemini via the new `google-genai` SDK, our system has a deterministic LangGraph fixture shield (`fixtures.py`) that executes identical state transitions offline. The app is 100% resilient to network failure."*

#### Q2: "How do you guarantee that you don't hallucinate policy coverage limits?"
> **Answer**: *"We built our citation validator (`citation_validator.py`) which normalizes and checks substring matches character-by-character against per-page extracted text in `document_pages`. If an LLM suggests a clause not verified in the source PDF, `verified_against_source` evaluates to `False` and an amber badge is displayed requiring hospital counter confirmation."*

#### Q3: "How do you handle Aadhaar masking without accidentally masking 10-digit mobile numbers?"
> **Answer**: *"We implemented the Indian Verhoeff dihedral group $D_5$ check-digit algorithm in `security.py`. It specifically validates 12-digit Indian Aadhaar numbers against multiplication and permutation tables. Phone numbers (10 digits) and policy strings fail the length and checksum tests and are never touched. You can test it live in `/documents`."*

#### Q4: "Why do you show an estimated range instead of an exact out-of-pocket amount?"
> **Answer**: *"In Indian health insurance, claiming an exact liability before final billing is medically and legally impossible because final bills depend on proportionate room-rent deductions, co-pay tiers, and fluctuating consumable charges. Showing an honest estimated range (e.g. ₹1.44L–₹1.76L) with transparent assumptions builds genuine trust with families and hospitals."*

