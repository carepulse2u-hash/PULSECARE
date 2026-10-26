"use client";

import { useEffect, useState, FormEvent } from "react";
import styles from "../app/page.module.css";
import { productData, ReviewItem } from "../config/product";

const RATING_LABELS: Record<number, string> = {
  5: "5.0 — Excellent (Highly Recommended)",
  4: "4.0 — Very Good",
  3: "3.0 — Good / Average",
  2: "2.0 — Needs Improvement",
  1: "1.0 — Poor Experience",
};

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(productData.reviews);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product?.reviews) {
          setReviews(data.product.reviews);
        }
      })
      .catch((err) => console.error("Failed to load live reviews:", err));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!author.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!content.trim() || content.trim().length < 5) {
      setErrorMsg("Please share your honest experience (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim(),
          location: location.trim(),
          rating,
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg("Thank you! Your testimonial has been posted successfully.");
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
        }
        // Reset form fields
        setAuthor("");
        setLocation("");
        setContent("");
        setRating(5);
        setTimeout(() => {
          setSuccessMsg("");
          setShowForm(false);
        }, 3000);
      } else {
        setErrorMsg(data.error || "Failed to submit testimonial. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <section className={`${styles.reviewsSection} section-padding`} id="testimonials">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Testimonials</span>
          <h2 className={styles.sectionTitle}>What our users say.</h2>
          <p className={styles.sectionDesc}>
            Read honest feedback from people who have integrated PulseCare into their daily wellness routines.
          </p>
        </div>

        {/* Action Button to Open Submission Form */}
        <div className={styles.reviewActionHeader}>
          <button
            type="button"
            className={styles.writeReviewBtn}
            onClick={() => {
              setShowForm(!showForm);
              setErrorMsg("");
              setSuccessMsg("");
            }}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>
              {showForm ? "close" : "rate_review"}
            </span>
            {showForm ? "Close Form" : "Share Your Experience"}
          </button>
        </div>

        {/* Interactive Testimonial Entry Form */}
        {showForm && (
          <div className={styles.reviewFormCard}>
            <div className={styles.reviewFormTop}>
              <div>
                <h3 className={styles.reviewFormTitle}>
                  <span className="material-icons" style={{ color: "var(--primary)", fontSize: "22px" }}>
                    rate_review
                  </span>
                  Write a Testimonial
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Your honest feedback helps other families make the right choice for health monitoring.
                </p>
              </div>
              <button
                type="button"
                className={styles.reviewFormCloseBtn}
                onClick={() => setShowForm(false)}
                title="Close"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {successMsg && (
              <div className={styles.reviewSuccessNotice} style={{ marginBottom: "16px" }}>
                <span className="material-icons" style={{ fontSize: "20px" }}>check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className={styles.reviewErrorNotice} style={{ marginBottom: "16px" }}>
                <span className="material-icons" style={{ fontSize: "20px" }}>error_outline</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.reviewFormBody}>
              {/* Star Rating Selection */}
              <div className={styles.starRatingField}>
                <label className={styles.starRatingLabel}>Your Overall Rating</label>
                <div className={styles.interactiveStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.starBtn} ${
                        star <= activeRating ? styles.starBtnActive : ""
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      title={`${star} Star${star > 1 ? "s" : ""}`}
                    >
                      <span className="material-icons">star</span>
                    </button>
                  ))}
                  <span className={styles.starRatingText}>{RATING_LABELS[activeRating] || ""}</span>
                </div>
              </div>

              {/* Name & City / Location */}
              <div className={styles.formRowTwo}>
                <div className={styles.formField}>
                  <label htmlFor="review-author" className={styles.formLabel}>
                    Your Name <span style={{ color: "#e11d48" }}>*</span>
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    required
                    placeholder="e.g. Ramesh Krishnan"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="review-location" className={styles.formLabel}>
                    City / State <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>(Optional)</span>
                  </label>
                  <input
                    id="review-location"
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* Review Content */}
              <div className={styles.formField}>
                <label htmlFor="review-content" className={styles.formLabel}>
                  Your Experience / Review <span style={{ color: "#e11d48" }}>*</span>
                </label>
                <textarea
                  id="review-content"
                  required
                  rows={4}
                  placeholder="Tell us how PulseCare helped you or your family (ease of use, voice guidance, battery life, accuracy, etc.)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              {/* Action Buttons */}
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelReviewBtn}
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitReviewBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-icons" style={{ fontSize: "16px", animation: "spin 1s linear infinite" }}>
                        sync
                      </span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="material-icons" style={{ fontSize: "16px" }}>send</span>
                      Submit Testimonial
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing & Live Reviews Grid */}
        <div className={styles.reviewsGrid}>
          {reviews.map((review, idx) => (
            <div key={review.id || idx} className={styles.reviewCard}>
              <div className={styles.stars}>
                {[...Array(review.rating || 5)].map((_, i) => (
                  <span key={i} className="material-icons" style={{ fontSize: "18px" }}>star</span>
                ))}
              </div>
              <p className={styles.reviewContent}>
                "{review.content}"
              </p>
              <div className={styles.reviewAuthorMeta}>
                <span className={styles.authorName}>
                  {review.author}
                  {review.verified && (
                    <span className={`material-icons ${styles.verifiedBadge}`} title="Verified User">check_circle</span>
                  )}
                </span>
                <span className={styles.reviewDate}>{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
