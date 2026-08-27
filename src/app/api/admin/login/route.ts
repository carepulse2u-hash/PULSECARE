import { NextResponse } from "next/server";
import { signSession } from "@/lib/auth";
import { getAuthStore } from "@/lib/authStore";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const authStore = await getAuthStore();
    const adminPassword = authStore.adminPassword;

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = await signSession(adminPassword);

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully"
    });

    // Set HttpOnly secure session cookie
    response.cookies.set("pulsecare_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication error" },
      { status: 500 }
    );
  }
}
