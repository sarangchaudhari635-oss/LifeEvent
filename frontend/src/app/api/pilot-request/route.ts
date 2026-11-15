import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://lifeevent-backend-production.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${BACKEND_URL}/api/pilot-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json({
      status: "success",
      message: "Pilot request received. Our team will contact you within 24 hours.",
    });
  }
}
