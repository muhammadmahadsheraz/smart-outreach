import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/userStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await verifyUser(email, password);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // For now we just return a success payload; no real session handling
    return NextResponse.json({
      ok: true,
      user: { email: user.email, name: user.name, company: user.company },
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

