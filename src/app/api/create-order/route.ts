import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay API credentials missing" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, currency = "INR", receipt } = body;

    const parsedAmount = typeof amount === "number" ? amount : parseInt(amount, 10);

    if (isNaN(parsedAmount) || parsedAmount < 100) {
      return NextResponse.json(
        { success: false, error: "Minimum amount must be at least 100 paise" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(parsedAmount),
      currency: currency || "INR",
      receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay create order error:", error);
    const statusCode = error.statusCode || error.status || 500;
    
    let errorMsg = error.message || "Failed to create Razorpay order";
    if (statusCode === 401 || (error.error && error.error.description && error.error.description.toLowerCase().includes("auth"))) {
      errorMsg = "Razorpay Authentication Failed: The API Key ID or Secret is invalid or expired. Please check your environment variables in Vercel/local .env.";
    }

    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: statusCode === 401 ? 401 : 500 }
    );
  }
}
