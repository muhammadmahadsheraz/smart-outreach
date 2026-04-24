import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.cookies.get("auth-token")?.value;

    console.log("🔵 [frontend /api/margot/product POST] token:", token ? "present" : "missing");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const backendRes = await fetch("http://localhost:4000/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const backendData = await backendRes.json();
    console.log("🔵 [frontend /api/margot/product POST] backend response:", backendData);
    return NextResponse.json(backendData, { status: backendRes.status });
  } catch (error: any) {
    console.error("Product save error:", error?.message);
    return NextResponse.json(
      { ok: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    console.log("🔵 [frontend /api/margot/product GET] token:", token ? "present" : "missing");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const backendRes = await fetch("http://localhost:4000/api/product", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const backendData = await backendRes.json();
    console.log("🔵 [frontend /api/margot/product GET] backend response:", backendData);
    return NextResponse.json(backendData, { status: backendRes.status });
  } catch (error: any) {
    console.error("Product fetch error:", error?.message);
    return NextResponse.json(
      { ok: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
