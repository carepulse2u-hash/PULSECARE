import { NextResponse } from "next/server";
import { getAuthStore, saveAuthStore } from "@/lib/authStore";

export async function POST(request: Request) {
  try {
    const { ownerEmail } = await request.json();

    if (!ownerEmail || typeof ownerEmail !== "string" || !ownerEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const authStore = await getAuthStore();
    authStore.ownerEmail = ownerEmail.trim();
    await saveAuthStore(authStore);

    return NextResponse.json({
      success: true,
      message: "Owner email updated successfully",
      ownerEmail: authStore.ownerEmail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to update email address" },
      { status: 500 }
    );
  }
}
