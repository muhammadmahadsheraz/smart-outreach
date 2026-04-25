import { NextResponse, type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.cookies.get("auth-token")?.value;

    console.log("🔵 [frontend /api/margot/client POST] token:", token ? "present" : "missing");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const backendData = await backendRes.json();
    console.log("🔵 [frontend /api/margot/client POST] backend response:", backendData);
    return NextResponse.json(backendData, { status: backendRes.status });
  } catch (error: any) {
    console.error("Client save error:", error?.message);
    return NextResponse.json(
      { ok: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    console.log("🔵 [frontend /api/margot/client GET] token:", token ? "present" : "missing");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/client`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const backendData = await backendRes.json();
    console.log("🔵 [frontend /api/margot/client GET] backend response:", backendData);
    return NextResponse.json(backendData, { status: backendRes.status });
  } catch (error: any) {
    console.error("Client fetch error:", error?.message);
    return NextResponse.json(
      { ok: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
