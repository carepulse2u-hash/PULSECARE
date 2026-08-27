"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../app/page.module.css";
import { productData } from "../config/product";
import CountdownTimer, { CountdownDuration } from "./CountdownTimer";

export default function Hero() {
  const [data, setData] = useState({
    price: productData.price,
    compareAtPrice: productData.compareAtPrice || 2999,
    offerCountdownDuration: (productData.offerCountdownDuration ?? { days: 2, hours: 5, minutes: 45 }) as CountdownDuration,
    offerCountdownStartedAt: undefined as number | undefined,
    serverTime: undefined as number | undefined,
    tagline: productData.tagline,
    description: productData.description,
    shippingText: productData.shippingText,
    warrantyText: productData.warrantyText,
    heroImage: productData.images.hero,
  });

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.product) {
          const p = resData.product;
          setData({
            price: p.price ?? productData.price,
            compareAtPrice: p.compareAtPrice ?? productData.compareAtPrice,
            offerCountdownDuration: p.offerCountdownDuration ?? productData.offerCountdownDuration ?? { days: 2, hours: 5, minutes: 45 },
            offerCountdownStartedAt: p.offerCountdownStartedAt,
            serverTime: resData.serverTime,
            tagline: p.tagline || productData.tagline,
            description: p.description || productData.description,
            shippingText: p.shippingText || productData.shippingText,
            warrantyText: p.warrantyText || productData.warrantyText,
            heroImage: p.images?.hero || productData.images.hero,
          });
        }
      })
      .catch((err) => console.error("Failed to load hero product data:", err));
  }, []);

  const discount = Math.round(
    ((data.compareAtPrice - data.price) / data.compareAtPrice) * 100
  );

  return (
    <section className={`${styles.hero} styles.section-padding`}>
      <div className={`${styles.container} ${styles.heroGrid} section-padding`}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className="material-icons">verified_user</span>
            <span>Premium D2C Health Care</span>
          </div>
          <h1 className={styles.heroTitle}>
            {data.tagline}
          </h1>
          <p className={styles.heroSubtitle}>
            {data.description}
          </p>

          <div className={styles.heroFeatures}>
            <div className={styles.heroFeatureItem}>
              <span className={`material-icons ${styles.heroFeatureIcon}`}>check_circle</span>
              <span>One-Touch Automatic Measurement</span>
            </div>
            <div className={styles.heroFeatureItem}>
              <span className={`material-icons ${styles.heroFeatureIcon}`}>check_circle</span>
              <span>Voice Guidance Announcement</span>
            </div>
            <div className={styles.heroFeatureItem}>
              <span className={`material-icons ${styles.heroFeatureIcon}`}>check_circle</span>
              <span>USB Rechargeable Battery</span>
            </div>
            <div className={styles.heroFeatureItem}>
              <span className={`material-icons ${styles.heroFeatureIcon}`}>check_circle</span>
              <span>Large Digital LED Display</span>
            </div>
          </div>

          <div className={styles.priceWrapper}>
            <span className={styles.currentPrice}>₹{data.price.toLocaleString("en-IN")}</span>
            {data.compareAtPrice > 0 && (
              <>
                <span className={styles.originalPrice}>₹{data.compareAtPrice.toLocaleString("en-IN")}</span>
                <span className={styles.discountBadge}>{discount}% OFF</span>
              </>
            )}
          </div>

          <CountdownTimer 
            duration={data.offerCountdownDuration}
            startedAt={data.offerCountdownStartedAt}
            serverTime={data.serverTime}
          />

          <div className={styles.ctaGroup}>
            <a href="#order-form" className={styles.primaryButton}>
              BUY NOW — ₹{data.price.toLocaleString("en-IN")}
            </a>
            <div className={styles.reassuranceList}>
              <div className={styles.reassuranceItem}>
                <span className="material-icons" style={{ fontSize: "14px", color: "var(--primary)" }}>local_shipping</span>
                <span>{data.shippingText}</span>
              </div>
              <div className={styles.reassuranceItem}>
                <span className="material-icons" style={{ fontSize: "14px", color: "var(--primary)" }}>payments</span>
                <span>Cash on Delivery Available</span>
              </div>
              <div className={styles.reassuranceItem}>
                <span className="material-icons" style={{ fontSize: "14px", color: "var(--primary)" }}>verified</span>
                <span>{data.warrantyText}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroImageContainer}>
          <Image
            src={data.heroImage}
            alt="PulseCare Rechargeable Wrist BP Monitor"
            width={480}
            height={480}
            className={styles.heroImage}
            priority
          />
          {/* Floating UI Elements */}
          <div className={`${styles.floatingBadge} ${styles.fb1} ${styles.animateFloat}`}>
            <span className={`material-icons ${styles.fbIcon}`}>battery_charging_full</span>
            <span>Rechargeable</span>
          </div>
          <div className={`${styles.floatingBadge} ${styles.fb2} ${styles.animateFloat}`} style={{ animationDelay: "1.5s" }}>
            <span className={`material-icons ${styles.fbIcon}`}>volume_up</span>
            <span>Voice Guided</span>
          </div>
          <div className={`${styles.floatingBadge} ${styles.fb3} ${styles.animateFloat}`} style={{ animationDelay: "3s" }}>
            <span className={`material-icons ${styles.fbIcon}`}>touch_app</span>
            <span>One Touch</span>
          </div>
          <div className={`${styles.floatingBadge} ${styles.fb4} ${styles.animateFloat}`} style={{ animationDelay: "4.5s" }}>
            <span className={`material-icons ${styles.fbIcon}`}>flight_takeoff</span>
            <span>Portable</span>
          </div>
        </div>
      </div>
    </section>
  );
}

