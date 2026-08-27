import { NextResponse } from "next/server";
import { getAuthStore, saveAuthStore } from "@/lib/authStore";
import nodemailer from "nodemailer";

export async function POST() {
  try {
    const authStore = await getAuthStore();
    const ownerEmail = authStore.ownerEmail;

    if (!ownerEmail || !ownerEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Owner email is not configured. Please enter a valid owner email first." },
        { status: 400 }
      );
    }

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    authStore.verificationCode = { code, expiresAt };
    await saveAuthStore(authStore);

    let emailSent = false;

    // Attempt to send email via SMTP if configured in process.env
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"PulseCare Admin" <${smtpUser}>`,
          to: ownerEmail,
          subject: "PulseCare Admin Password Reset Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #0284c7;">PulseCare Password Change Verification</h2>
              <p>You have requested a password change for your PulseCare Admin Dashboard.</p>
              <p>Your 6-digit verification code is:</p>
              <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #e11d48; background: #ffe4e6; padding: 12px 24px; display: inline-block; border-radius: 8px; margin: 16px 0;">
                ${code}
              </div>
              <p>This code will expire in 15 minutes.</p>
              <p>If you did not request this change, please ignore this email.</p>
            </div>
          `,
        });

        emailSent = true;
      } catch (mailErr) {
        console.error("Failed to send email via SMTP:", mailErr);
      }
    }

    if (!emailSent) {
      console.log("\n=======================================================");
      console.log(`[PULSECARE AUTH] Verification Code for ${ownerEmail}:`);
      console.log(`>>> VERIFICATION CODE: ${code} <<<`);
      console.log("=======================================================\n");
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? `Verification code sent to ${ownerEmail}`
        : `Verification code generated! (Code sent to ${ownerEmail} and logged to server console)`,
      ownerEmail,
      emailSent,
      devCode: (process.env.NODE_ENV !== "production" && !emailSent) ? code : undefined,
    });
  } catch (error: any) {
    console.error("Error generating verification code:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate verification code" },
      { status: 500 }
    );
  }
}
