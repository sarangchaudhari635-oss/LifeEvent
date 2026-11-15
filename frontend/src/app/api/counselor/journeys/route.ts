import { NextResponse } from "next/server";

const COUNSELOR_JOURNEYS = [
  {
    id: "demo-journey-cardiac-01",
    patient_name: "Ramesh Kulkarni",
    hospital_name: "Sample City Hospital (Apollo Pune Network)",
    urgency: "critical",
    estimated_cost: 420000,
    gap_expected: 160000,
    current_stage: "preauth_pending",
    next_action: "Submit Patient Aadhaar and Signed Form Part B to Hospital Insurance Desk (Counter #4)",
    tasks_done: 1,
    tasks_total: 3
  },
  {
    id: "demo-journey-ortho-02",
    patient_name: "Sunita Patil",
    hospital_name: "Sample Metropolitan Hospital",
    urgency: "urgent",
    estimated_cost: 185000,
    gap_expected: 45000,
    current_stage: "admitted",
    next_action: "Upload implant vendor invoice for TPA cashless clearance",
    tasks_done: 2,
    tasks_total: 2
  }
];

export async function GET() {
  return NextResponse.json(COUNSELOR_JOURNEYS);
}
