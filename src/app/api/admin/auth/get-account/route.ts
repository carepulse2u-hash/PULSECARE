import { NextResponse } from "next/server";
import { getAuthStore } from "@/lib/authStore";

export async function GET() {
  try {
    const authStore = await getAuthStore();
    return NextResponse.json({
      success: true,
      ownerEmail: authStore.ownerEmail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch account info" },
      { status: 500 }
    );
  }
}
