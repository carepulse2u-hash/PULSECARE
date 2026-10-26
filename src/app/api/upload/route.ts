import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import fs from "fs";
import path from "path";

const BUCKET_NAME = "product-images";

// Map common extensions to MIME types
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in request" },
        { status: 400 }
      );
    }

    // Limit upload size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image size exceeds 10MB limit. Please upload a smaller image." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension and create unique filename
    const originalName = file.name || "uploaded_image.png";
    const ext = path.extname(originalName).toLowerCase() || ".png";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)
      ? ext
      : ".png";

    const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${safeExt}`;
    const contentType = file.type || MIME_TYPES[safeExt] || "image/png";

    // Primary: Upload to Supabase Storage if configured (production-safe & Vercel serverless compatible)
    if (isSupabaseConfigured) {
      try {
        // Upload file to product-images bucket
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, buffer, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          console.error("Supabase Storage upload error:", uploadError);
          // If bucket might not exist yet, try creating it and retry
          if (uploadError.message?.includes("Bucket not found") || (uploadError as any).statusCode === 404) {
            await supabase.storage.createBucket(BUCKET_NAME, {
              public: true,
              fileSizeLimit: 10485760,
            });
            const { error: retryError } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(fileName, buffer, { contentType, upsert: true });

            if (retryError) throw retryError;
          } else {
            throw uploadError;
          }
        }

        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        return NextResponse.json({
          success: true,
          url: urlData.publicUrl,
          fileName,
        });
      } catch (sbError: any) {
        console.error("Supabase storage upload failed, attempting local fallback:", sbError);
      }
    }

    // Fallback: Local filesystem (for local offline dev environments)
    try {
      const uploadDir = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/images/${fileName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName,
      });
    } catch (fsError: any) {
      console.error("Local file save error:", fsError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to store image: filesystem is read-only and cloud storage failed.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("General upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
