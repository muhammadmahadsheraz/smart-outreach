import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/settings/billing`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Billing info update error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update billing info" },
      { status: 500 }
    );
  }
}
