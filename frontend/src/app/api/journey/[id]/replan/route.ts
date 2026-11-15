import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return NextResponse.json({
    success: true,
    journey_id: resolvedParams.id,
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
      urgency: "critical"
    },
    message: "Dynamic state machine re-planned: new task prepended to checklist via SSE."
  });
}
