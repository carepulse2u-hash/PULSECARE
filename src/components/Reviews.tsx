"use client";

import { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import { productData, ReviewItem } from "../config/product";

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(productData.reviews);

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

  return (
    <section className={`${styles.reviewsSection} section-padding`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Testimonials</span>
          <h2 className={styles.sectionTitle}>What our users say.</h2>
          <p className={styles.sectionDesc}>
            Read honest feedback from people who have integrated PulseCare into their daily wellness routines.
          </p>
        </div>

        <div className={styles.reviewsGrid}>
          {reviews.map((review, idx) => (
            <div key={idx} className={styles.reviewCard}>
              <div className={styles.stars}>
                {[...Array(review.rating)].map((_, i) => (
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
                    <span className={`material-icons ${styles.verifiedBadge}`} title="Verified Buyer">check_circle</span>
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

