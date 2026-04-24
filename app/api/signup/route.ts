import { NextResponse, type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  
  try {
        const body = await request.json();
     
    // Forward to backend Express server
    
    const backendRes = await fetch(`${BACKEND_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const backendData = await backendRes.json();
    console.log("SIGNUP Backend response:", backendData);    
    const response = NextResponse.json(
      {
        ok: backendData.ok,
        token: backendData.token,
        user: backendData.user,
        error: backendData.error,
      },
      { status: backendRes.status }
    );

    if (backendData.ok && backendData.token) {
      response.cookies.set("auth-token", backendData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, 
      });
    }

    return response;
  } catch (error: any) {
    
    return NextResponse.json(
      { ok: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

