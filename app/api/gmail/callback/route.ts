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
        redirect: "manual",
      }
    );

    // Read redirect destination from state (format: "userId|redirectPath")
    // Backend may encode it as "userId:redirectPath" — we parse it out
    let redirectPath = "inbox";
    try {
      // State format from backend: plain userId OR "userId|redirectPath"
      const decoded = decodeURIComponent(state);
      if (decoded.includes("|")) {
        redirectPath = decoded.split("|")[1] || "inbox";
      }
    } catch {
      // fallback to inbox
    }

    const successUrl = `/${redirectPath}?gmail=connected`;
    const errorUrl = `/inbox?gmail=error`;

    if (response.status >= 300 && response.status < 400) {
      return NextResponse.redirect(new URL(successUrl, req.url));
    }

    if (!response.ok) {
      const text = await response.text();
      console.error("🔴 [gmail/callback] Backend error:", text);
      return NextResponse.redirect(new URL(errorUrl, req.url));
    }

    return NextResponse.redirect(new URL(successUrl, req.url));
  } catch (error: any) {
    console.error("🔴 [gmail/callback] Error:", error.message);
    return NextResponse.redirect(
      new URL("/inbox?gmail=error&message=" + encodeURIComponent(error.message), req.url)
    );
  }
}
