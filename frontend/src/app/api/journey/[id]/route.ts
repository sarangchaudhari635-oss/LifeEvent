import { NextResponse } from "next/server";

const CARDIAC_JOURNEY = {
  id: "demo-journey-cardiac-01",
  intake: {
    patient_name: "Ramesh Kulkarni",
    hospital_name: "Sample City Hospital (Apollo Pune Network)",
    condition_description: "Acute chest pain, acute coronary syndrome, immediate angioplasty recommended.",
    urgency: "critical",
    estimated_amount: 420000,
    known_insurer: "Sample Health Insurance Co."
  },
  coverage_findings: [
    {
      category: "Room Rent & Nursing Expenses",
      estimated_cost: 34000,
      likely_covered: 20000,
      out_of_pocket: 14000,
      confidence: "High",
      evidence_doc: "Sample_Health_Policy_Document.pdf",
      evidence_page: 3,
      evidence_passage: "The company shall indemnify room, boarding, and nursing expenses up to a maximum of INR 5,000 per day for standard category rooms.",
      clause_ref: "Section 2.1 (Room Rent Cap)",
      verified_against_source: true
    },
    {
      category: "Cath Lab, Angioplasty & Stent Hardware",
      estimated_cost: 240000,
      likely_covered: 240000,
      out_of_pocket: 0,
      confidence: "High",
      evidence_doc: "Hospital_PreAuth_Estimate.pdf",
      evidence_page: 1,
      evidence_passage: "Treatment Plan: PTCA with Drug Eluting Stent. Total Estimated Cost: INR 4,20,000.",
      clause_ref: "Clinical Estimate 1.1",
      verified_against_source: true
    },
    {
      category: "Hospital Non-Payable Consumables & Admin Kits",
      estimated_cost: 42000,
      likely_covered: 0,
      out_of_pocket: 42000,
      confidence: "Medium",
      evidence_doc: "Sample_Health_Policy_Document.pdf",
      evidence_page: 7,
      evidence_passage: "Expenses incurred on non-medical items such as gloves, cotton, sanitizer, thermometers, and administrative files are not payable under this policy schedule.",
      clause_ref: "General Exclusions 4.8",
      verified_against_source: true
    },
    {
      category: "Unverified Five-Star Luxury Upgrade (Planted Trap)",
      estimated_cost: 25000,
      likely_covered: 0,
      out_of_pocket: 25000,
      confidence: "Unverified",
      evidence_doc: "Sample_Health_Policy_Document.pdf",
      evidence_page: 1,
      evidence_passage: "Hospital promises suite room reimbursement under VIP tier without policy rider backing.",
      clause_ref: "Unverified Adversarial Note 9.9",
      verified_against_source: false
    }
  ],
  gap: {
    estimated_total_cost: 420000,
    likely_covered_total: 260000,
    gap_expected: 160000,
    gap_low: 140000,
    gap_high: 185000,
    non_payable_consumables: 42000,
    room_rent_penalty: 49350,
    copay_amount: 0,
    assumptions: [
      "Room rent capped at ₹5,000/day. Patient admitted to ₹8,500/day Deluxe room triggers 41% proportional cut across associated doctors & ICU charges.",
      "Consumables (gloves, syringes, drapes, administrative files) not payable under IRDAI 2024 Schedule.",
      "Stent hardware qualified under CGHS ceiling cap."
    ]
  },
  checklist: [
    {
      id: "chk-01",
      title: "Submit Signed Pre-Auth Form Part B",
      responsible_party: "Attendant (Patient Family)",
      status: "done",
      deadline_minutes: 30,
      required_doc: "Hospital Form Part B"
    },
    {
      id: "chk-02",
      title: "Upload Insurer Cashless Card / Policy PDF",
      responsible_party: "Attendant (Patient Family)",
      status: "done",
      deadline_minutes: 45,
      required_doc: "Health Card"
    },
    {
      id: "chk-03",
      title: "Hospital Medical History & Initial Vital Chart",
      responsible_party: "Hospital TPA Desk (Apollo)",
      status: "in_progress",
      deadline_minutes: 60,
      required_doc: "Triage Vitals Summary"
    }
  ],
  funding_options: [
    {
      id: "offer-paytm-credit",
      provider: "Paytm Instant Health Credit",
      type: "0% EMI Emergency Bridge",
      amount_limit: 150000,
      tenure_months: 6,
      monthly_emi: 25000,
      interest_rate_annual: 0.0,
      disbursal_speed_minutes: 10,
      required_docs: ["Aadhaar OTP", "Bank Account Statement"]
    }
  ],
  timeline_events: [
    {
      id: "evt-01",
      timestamp: "10:30 AM",
      title: "Emergency Casualty Admission",
      description: "Patient Ramesh Kulkarni arrived at casualty triage with acute chest pain. Vitals recorded.",
      actor: "Casualty Desk",
      status: "completed"
    },
    {
      id: "evt-02",
      timestamp: "10:42 AM",
      title: "Initial Pre-Auth Documents Ingested",
      description: "Policy Schedule PDF and Hospital Pre-Auth form parsed. Verhoeff Aadhaar redaction applied.",
      actor: "LifeEvent AI Engine",
      status: "completed"
    },
    {
      id: "evt-03",
      timestamp: "10:48 AM",
      title: "TPA Cashless Query Pending",
      description: "Awaiting submission of signed Part B form to Hospital Insurance Desk (Counter #4).",
      actor: "Hospital Counter #4",
      status: "in_progress"
    }
  ],
  current_stage: "preauth_pending",
  next_best_action: "Submit Patient Aadhaar and Signed Form Part B to Hospital Insurance Desk (Counter #4)",
  is_demo: true
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return NextResponse.json({
    ...CARDIAC_JOURNEY,
    id: resolvedParams.id
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return NextResponse.json({
    success: true,
    purged_id: resolvedParams.id,
    message: "Zero-knowledge purge executed. All session records and temporary tokens hard-deleted."
  });
}
