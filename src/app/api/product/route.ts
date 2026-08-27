import { NextResponse } from "next/server";
import { getProductConfig, saveProductConfig } from "@/lib/productDb";

export async function GET() {
  try {
    const config = await getProductConfig();
    return NextResponse.json({ 
      success: true, 
      product: config,
      serverTime: Date.now()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load product configuration" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid product payload" },
        { status: 400 }
      );
    }

    const currentConfig = await getProductConfig();

    const newDays = body.offerCountdownDuration?.days ?? 2;
    const newHours = body.offerCountdownDuration?.hours ?? 5;
    const newMinutes = body.offerCountdownDuration?.minutes ?? 45;

    const oldDays = currentConfig.offerCountdownDuration?.days;
    const oldHours = currentConfig.offerCountdownDuration?.hours;
    const oldMinutes = currentConfig.offerCountdownDuration?.minutes;

    const serverTime = Date.now();
    const offerCountdownStartedAt = serverTime;

    const offerCountdownDurationSeconds = (newDays * 24 * 3600) + (newHours * 3600) + (newMinutes * 60);

    const updatedConfig = {
      ...currentConfig,
      ...body,
      offerCountdownDays: newDays,
      offerCountdownHours: newHours,
      offerCountdownMinutes: newMinutes,
      offerCountdownStartedAt,
      offerCountdownDurationSeconds,
      images: {
        ...currentConfig.images,
        ...(body.images || {})
      },
      contact: {
        ...currentConfig.contact,
        ...(body.contact || {})
      }
    };

    const saved = await saveProductConfig(updatedConfig);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to persist changes to the database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product configuration updated successfully",
      product: updatedConfig,
      serverTime: Date.now()
    });
  } catch (error) {
    console.error("Error updating product config:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error while saving config" },
      { status: 500 }
    );
  }
}
