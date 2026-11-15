import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://lifeevent-backend-production.up.railway.app";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/journey/${id}/replan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    // Fallback demo replan response
    return NextResponse.json({
      success: true,
      journey_id: id,
      replan_trigger: "tpa_query_ecg_deficiency",
      current_stage: "tpa_query_active",
      next_best_action: "URGENT: Request Casualty Doctor to upload 12-lead baseline ECG strip for TPA approval",
      new_task: {
        id: `task-ecg-${Date.now()}`,
        title: "Collect Casualty Admission ECG Strip",
        responsible_party: "Casualty Doctor / Nursing Station",
        status: "in_progress",
        deadline_minutes: 20,
        required_doc: "12-Lead Baseline ECG Strip",
        urgency: "critical",
      },
      message: "Dynamic state machine re-planned: new task prepended to checklist.",
    });
  }
}
