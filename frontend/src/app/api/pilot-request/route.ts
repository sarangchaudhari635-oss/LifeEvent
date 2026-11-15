import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      requestId: `PILOT-${Date.now().toString(36).toUpperCase()}`,
      message: `Pilot onboarding request received for ${body.hospital_name || "Hospital Network"}. Our Institutional Operations Team will reach out within 2 hours.`,
      received: {
        hospital_name: body.hospital_name,
        contact_name: body.contact_name,
        email: body.email,
        phone: body.phone,
        bed_count: body.bed_count,
        city: body.city,
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid request payload", details: err?.message },
      { status: 400 }
    );
  }
}
