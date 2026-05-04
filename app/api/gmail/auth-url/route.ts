import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Support both Authorization header and cookie
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("auth-token")?.value;
    const token = authHeader?.split(" ")[1] || cookieToken;

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 401 });
    }

    // Optional redirect destination after OAuth completes (e.g. "campaigns/new")
    const redirectTo = req.nextUrl.searchParams.get("redirect") || "inbox";

    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const response = await fetch(
      `${backendUrl}/api/gmail/auth-url?redirect=${encodeURIComponent(redirectTo)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("🔴 [gmail/auth-url] Error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
