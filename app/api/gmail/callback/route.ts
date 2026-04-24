import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.redirect(new URL("/inbox?gmail=error&message=Missing+code+or+state", req.url));
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const response = await fetch(
      `${backendUrl}/api/gmail/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
      {
        method: "GET",
        redirect: "manual", // Don't follow redirects from backend
      }
    );

    // Backend redirects to /inbox?gmail=connected on success
    // We handle the redirect here on the frontend side
    if (response.status >= 300 && response.status < 400) {
      return NextResponse.redirect(new URL("/inbox?gmail=connected", req.url));
    }

    if (!response.ok) {
      const text = await response.text();
      console.error("🔴 [gmail/callback] Backend error:", text);
      return NextResponse.redirect(new URL("/inbox?gmail=error", req.url));
    }

    // If backend returned OK without redirect
    return NextResponse.redirect(new URL("/inbox?gmail=connected", req.url));
  } catch (error: any) {
    console.error("🔴 [gmail/callback] Error:", error.message);
    return NextResponse.redirect(new URL("/inbox?gmail=error&message=" + encodeURIComponent(error.message), req.url));
  }
}
