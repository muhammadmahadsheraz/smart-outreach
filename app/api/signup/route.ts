import { NextResponse } from "next/server";
import { createUser } from "@/lib/userStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, password } = body ?? {};

    if (!email || !password || !firstName) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const name = lastName ? `${firstName} ${lastName}` : firstName;

    await createUser({
      email,
      name,
      company,
      password,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error instanceof Error && error.message === "User already exists") {
      return NextResponse.json(
        { ok: false, error: "User already exists" },
        { status: 409 }
      );
    }

    console.error("Signup error", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

