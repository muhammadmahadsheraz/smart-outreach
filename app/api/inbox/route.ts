import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    console.log("🔵 [inbox] Calling backend:", `${backendUrl}/api/inbox`);
    
    const response = await fetch(`${backendUrl}/api/inbox`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("🔵 [inbox] Backend response status:", response.status);
    const text = await response.text();
    console.log("🔵 [inbox] Backend response:", text.substring(0, 200));

    if (!response.ok) {
      console.error("🔴 [inbox] Backend error status:", response.status);
      try {
        const data = JSON.parse(text);
        return NextResponse.json(data, { status: response.status });
      } catch {
        return NextResponse.json({ ok: false, error: text }, { status: response.status });
      }
    }

    const data = JSON.parse(text);
    console.log("✅ [inbox] Inbox fetched successfully");
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔴 [inbox] Error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
