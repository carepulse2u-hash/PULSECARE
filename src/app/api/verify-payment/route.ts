import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    const bodyToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(bodyToSign)
      .digest("hex");

    // Perform timing-safe comparison to prevent timing attacks
    const isSignatureValid =
      generatedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "utf-8"),
        Buffer.from(razorpay_signature, "utf-8")
      );

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed: Signature mismatch" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment signature verified successfully",
    });
  } catch (error: any) {
    console.error("Razorpay payment verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 400 }
    );
  }
}
