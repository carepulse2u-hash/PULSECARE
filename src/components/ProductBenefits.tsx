"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../app/page.module.css";
import { productData } from "../config/product";

const benefits = [
  {
    title: "Small enough to carry.",
    desc: "Compact dimensions let you take it anywhere in its travel case."
  },
  {
    title: "Simple enough for everyday use.",
    desc: "A single-button process removes all complexity from monitoring."
  },
  {
    title: "Easy to recharge.",
    desc: "Connects to any standard phone charger. No battery changes needed."
  },
  {
    title: "Easy to read.",
    desc: "The bright LED display presents bold, legible digits even in dim light."
  },
  {
    title: "Easy to use.",
    desc: "The pre-formed cuff makes wrapping it around your wrist simple."
  }
];

export default function ProductBenefits() {
  const [benefitsImg, setBenefitsImg] = useState(
    productData.images.benefits || productData.images.lifestyle
  );

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product?.images) {
          setBenefitsImg(
            data.product.images.benefits || data.product.images.lifestyle || productData.images.lifestyle
          );
        }
      })
      .catch((err) => console.error("Failed to load benefits image:", err));
  }, []);

  return (
    <section className={`${styles.benefitsSection} section-padding`}>
      <div className={styles.container}>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitsLeft}>
            <span className={styles.benefitLabel}>Everyday Wellness</span>
            <h2 className={styles.benefitHeading}>Designed for everyday convenience.</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "16px" }}>
              {benefits.map((benefit, idx) => (
                <div key={idx} className={styles.benefitItem}>
                  <span className={`material-icons ${styles.benefitCheck}`}>check</span>
                  <div className={styles.benefitTextWrapper}>
                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                    <p className={styles.benefitDesc}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Image
              src={benefitsImg}
              alt="Close-up of PulseCare wrist blood pressure monitor showing premium aesthetics"
              width={600}
              height={500}
              className={styles.benefitsRightImg}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

