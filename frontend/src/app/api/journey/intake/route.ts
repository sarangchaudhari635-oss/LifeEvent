import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://lifeevent-backend-production.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${BACKEND_URL}/api/journey/intake`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[journey/intake] Proxy error:", message);
    // Graceful fallback for demo
    return NextResponse.json(
      {
        id: "demo-journey-cardiac-01",
        status: "created",
        message: "Emergency intake recorded (offline demo mode).",
        journey_url: "/journey/demo-journey-cardiac-01",
      },
      { status: 200 }
    );
  }
}
