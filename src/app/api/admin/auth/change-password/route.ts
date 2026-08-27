import { NextResponse } from "next/server";
import { getAuthStore, saveAuthStore } from "@/lib/authStore";

export async function POST(request: Request) {
  try {
    const { code, newPassword } = await request.json();

    if (!code || typeof code !== "string" || code.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 6-digit verification code" },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 4 characters long" },
        { status: 400 }
      );
    }

    const authStore = await getAuthStore();
    const storedVerification = authStore.verificationCode;

    if (!storedVerification) {
      return NextResponse.json(
        { success: false, error: "No active verification code found. Please click 'Request Verification Code' first." },
        { status: 400 }
      );
    }

    if (Date.now() > storedVerification.expiresAt) {
      authStore.verificationCode = null;
      await saveAuthStore(authStore);
      return NextResponse.json(
        { success: false, error: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (storedVerification.code.trim() !== code.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code. Please check your email/console and try again." },
        { status: 400 }
      );
    }

    // Code is valid! Update password and clear verification code.
    authStore.adminPassword = newPassword.trim();
    authStore.verificationCode = null;
    await saveAuthStore(authStore);

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully! Your new password is now active.",
    });
  } catch (error: any) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { success: false, error: "Failed to change password" },
      { status: 500 }
    );
  }
}
