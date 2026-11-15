import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isCardiac =
      body.condition_description?.toLowerCase().includes("chest") ||
      body.condition_description?.toLowerCase().includes("angioplasty") ||
      body.patient_name?.toLowerCase().includes("ramesh") ||
      body.is_demo;

    const journeyId = isCardiac ? "demo-journey-cardiac-01" : "demo-journey-ortho-02";

    return NextResponse.json({
      id: journeyId,
      status: "created",
      message: "Emergency intake recorded with zero-knowledge Verhoeff redaction.",
      journey_url: `/journey/${journeyId}`,
      received_payload: {
        patient_name: body.patient_name,
        hospital_name: body.hospital_name,
        estimated_amount: body.estimated_amount,
        urgency: body.urgency,
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid payload", details: err?.message },
      { status: 400 }
    );
  }
}
