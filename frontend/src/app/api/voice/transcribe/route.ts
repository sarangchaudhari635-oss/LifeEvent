import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://lifeevent-backend-production.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const backendRes = await fetch(`${BACKEND_URL}/api/voice/transcribe`, {
      method: "POST",
      body: formData,
      // Note: do NOT set Content-Type; fetch will set multipart/form-data boundary automatically
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[voice/transcribe] Proxy error:", message);
    return NextResponse.json(
      {
        status: "error",
        message: "Voice transcription service unavailable. Please type your situation instead.",
        transcript: "",
      },
      { status: 503 }
    );
  }
}

export async function GET() {
  try {
    const BACKEND_URL_LOCAL = process.env.BACKEND_URL || "https://lifeevent-backend-production.up.railway.app";
    const backendRes = await fetch(`${BACKEND_URL_LOCAL}/api/voice/status`);
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json({ provider: "Sarvam AI", configured: false }, { status: 200 });
  }
}
