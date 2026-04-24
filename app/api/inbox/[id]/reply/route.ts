import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const token = req.cookies.get("auth-token")?.value;

    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:4000'}/api/inbox/${id}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.ok ? 200 : response.status });
  } catch (error: any) {
    console.error("Reply proxy error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
