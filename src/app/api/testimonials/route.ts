import { NextResponse } from "next/server";
import { getProductConfig, saveProductConfig } from "@/lib/productDb";
import { ReviewItem } from "@/config/product";

export async function GET() {
  try {
    const config = await getProductConfig();
    return NextResponse.json({
      success: true,
      reviews: config.reviews || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to load testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { author, rating, content, location } = body;

    // Validation & Sanitization
    const trimmedAuthor = typeof author === "string" ? author.trim().slice(0, 80) : "";
    const trimmedContent = typeof content === "string" ? content.trim().slice(0, 1000) : "";
    const trimmedLocation = typeof location === "string" ? location.trim().slice(0, 60) : "";
    const numRating = parseInt(String(rating), 10);

    if (!trimmedAuthor) {
      return NextResponse.json(
        { success: false, error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!trimmedContent || trimmedContent.length < 5) {
      return NextResponse.json(
        { success: false, error: "Please write a brief testimonial (at least 5 characters)." },
        { status: 400 }
      );
    }

    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5 stars." },
        { status: 400 }
      );
    }

    // Format current date e.g. "October 26, 2026"
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Create new review object
    const authorWithLocation = trimmedLocation
      ? `${trimmedAuthor} (${trimmedLocation})`
      : trimmedAuthor;

    const newReview: ReviewItem & { id: string; location?: string } = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      author: authorWithLocation,
      rating: numRating,
      content: trimmedContent,
      date: formattedDate,
      verified: true,
      location: trimmedLocation || undefined,
    };

    // Load current config, prepend new review and persist
    const config = await getProductConfig();
    const currentReviews = Array.isArray(config.reviews) ? config.reviews : [];
    const updatedReviews = [newReview, ...currentReviews];

    const saved = await saveProductConfig({
      ...config,
      reviews: updatedReviews,
    });

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to save testimonial. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your testimonial has been posted successfully.",
        review: newReview,
        reviews: updatedReviews,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Testimonial submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}
