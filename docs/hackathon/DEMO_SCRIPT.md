# LifeEvent AI: 3-Minute Hackathon Demo Script

**Hackathon:** Paytm AI Hackathon (Build for India) — Pune  
**Target Duration:** 3 Minutes (180 Seconds)  
**Presenter:** Team Crazy Coders (Sarang Chaudhari, Sumit Kalr, Sanskar Thorat)  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Demo Flow Timeline (180 Seconds)

```mermaid
timeline
    title 3-Minute Live Hackathon Demo Walkthrough
    00:00 - 00:30 : The Hospital Counter Crisis & 5 Questions
    00:30 - 01:00 : Multilingual Voice Intake & Verhoeff Aadhaar Masking
    01:00 - 01:45 : Living Journey Dashboard & Honest Gap Math
    01:45 - 02:15 : Evidence Inspector & Planted Hallucination Trap
    02:15 - 02:40 : Dynamic TPA Re-planning (Live Re-plan Trigger)
    02:40 - 03:00 : Paytm UPI Instant Caution Deposit & Closing
```

---

## 2. Step-by-Step Presentation Script

### Minute 0:00 – 0:30: The Crisis at the Hospital Counter
- **Screen:** Landing Page (`http://localhost:3000/`)
- **Spoken Narrative:**  
  *"Judges, imagine it's 2:00 AM. Your 58-year-old father has been rushed to Ruby Hall Clinic ICU with acute chest pain. As the attendant standing at the admission counter, you are hit with five terrifying financial questions: What does our insurance cover? What documents are missing? How much out-of-pocket money must we arrange? Where do we get emergency cash? What is our single next best action right now?  
  Today, insurance desks, hospital billing, and loan apps operate in disconnected silos. This is LifeEvent AI—an AI-powered financial journey operating system that turns this crisis into a calm, coordinated, evidence-backed action plan."*

---

### Minute 0:30 – 1:00: Multilingual Voice Intake & Verhoeff Masking
- **Screen:** Navigate to `/intake`. Click microphone or one-click **"Load Cardiac Scenario"**.
- **Action:** Point out voice dictation in Hindi (`hi-IN`) and the entered Aadhaar number (`2341 2341 2346`).
- **Spoken Narrative:**  
  *"The attendant can speak naturally in Hindi, Marathi, or English. Notice the Aadhaar number entered. Instead of naive regex, our system runs the mathematical Verhoeff checksum algorithm on the client. It instantly masks to `XXXX-XXXX-2346` before any data touches the network or LLM. Zero PII leakage."*
- **Action:** Click **"Start Living Journey"**.

---

### Minute 1:00 – 1:45: Living Dashboard & Honest Gap Range
- **Screen:** Living Journey Dashboard (`/journey/demo-journey-cardiac-01`)
- **Action:** Highlight the Server-Sent Events (SSE) progress stream and the resulting **Honest Gap Range Card**.
- **Spoken Narrative:**  
  *"Within 2.8 seconds, our LangGraph pipeline completes ingestion. Look at this gap card: we NEVER show a single fake exact number. We show an honest range: ₹87,600 Low, ₹99,600 Expected, ₹1,20,600 High.  
  Why? Because our deterministic Python calculator applies statutory IRDAI formulas: factoring in ₹42,000 of non-payable consumables, a ₹49,350 room-rent proportional deduction penalty because ICU rent exceeded the 1% cap, and a 10% co-pay. The family is protected from discharge billing shock."*

---

### Minute 1:45 – 02:15: Evidence Inspector & Planted Hallucination Trap
- **Screen:** Navigate to `/journey/demo-journey-cardiac-01/coverage`.
- **Action:** Click on Room Rent coverage item to show modal with verbatim passage, page number, and clause reference. Then scroll to the planted trap: `"Hospital Five-Star Luxury Living Claim"`.
- **Spoken Narrative:**  
  *"How do we prevent hallucinations? Every covered rupee must point to an exact verbatim sentence in the policy contract with page and clause reference.  
  Look here: we planted an adversarial prompt trap claiming full coverage for a presidential suite under Clause 9.9. Our Citation Gate checked the page text, detected that no such sentence exists, flagged it as `Unverified`, and forced covered amount to exactly ₹0. Absolute trust by construction."*

---

### Minute 2:15 – 02:40: Dynamic TPA Re-planning
- **Screen:** Return to `/journey/demo-journey-cardiac-01`.
- **Action:** Click **"Simulate TPA Pre-Auth Query"**.
- **Spoken Narrative:**  
  *"Real emergencies are living workflows. Watch what happens when the insurer issues an unexpected query demanding a baseline ECG strip.  
  We trigger the re-plan. Instantly, our Financial Journey Graph mutates: the urgent task 'Collect Casualty Admission ECG Strip' is prepended to the top of the checklist, the stage shifts to `tpa_query_pending`, and the pinned Next Best Action updates in real time on the family's mobile screen."*

---

### Minute 2:40 – 03:00: Paytm UPI Caution Deposit & Closing
- **Screen:** Navigate to `/journey/demo-journey-cardiac-01/funding`.
- **Action:** Click **"Instant Caution Deposit via Paytm UPI"**. Show the Customer Approval Gateway consent modal and one-click deposit clearance.
- **Spoken Narrative:**  
  *"Finally, the hospital demands a ₹50,000 caution deposit before transferring the patient to the Cath Lab. Through our Customer Approval Gateway, the attendant authorizes a zero-interest ₹50,000 buffer via Paytm UPI. The hospital billing ledger clears instantly, and the patient is wheeled into treatment.  
  LifeEvent AI makes insurance transparent, lending accessible, and fintech deeply human. Thank you!"*

