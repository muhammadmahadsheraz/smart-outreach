import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    console.log("🔵 [sync-mail] Calling backend:", `${backendUrl}/api/demo/sync-mail`);
    
    const response = await fetch(`${backendUrl}/api/demo/sync-mail`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("🔵 [sync-mail] Backend response status:", response.status);
    const text = await response.text();
    console.log("🔵 [sync-mail] Backend response:", text.substring(0, 200));

    if (!response.ok) {
      console.error("🔴 [sync-mail] Backend error status:", response.status);
      try {
        const data = JSON.parse(text);
        return NextResponse.json(data, { status: response.status });
      } catch {
        return NextResponse.json({ ok: false, error: text }, { status: response.status });
      }
    }

    const data = JSON.parse(text);
    console.log("✅ [sync-mail] Sync completed:", data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔴 [sync-mail] Error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
