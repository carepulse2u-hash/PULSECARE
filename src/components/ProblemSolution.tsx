"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../app/page.module.css";
import { productData } from "../config/product";

export default function ProblemSolution() {
  const [lifestyleImg, setLifestyleImg] = useState(productData.images.lifestyle);

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product?.images?.lifestyle) {
          setLifestyleImg(data.product.images.lifestyle);
        }
      })
      .catch((err) => console.error("Failed to load lifestyle image:", err));
  }, []);

  return (
    <section className={`${styles.problemSolution} section-padding`}>
      <div className={styles.container}>
        <div className={styles.splitGrid}>
          <div className={styles.splitContent}>
            <div className={styles.sectionHeader} style={{ textAlign: "left", margin: "0" }}>
              <span className={styles.sectionSubtitle}>D2C Innovation</span>
              <h2 className={styles.sectionTitle}>Your BP machine doesn't have to be bulky.</h2>
              <p className={styles.sectionDesc}>
                Traditional upper-arm blood pressure monitors are often heavy, awkward to set up, and difficult to travel with. This makes tracking your blood pressure feel like a chore.
              </p>
            </div>

            <div className={styles.comparisonBox}>
              <h3 className={styles.compTitle}>Sleek Wrist Format</h3>
              <p className={styles.compText}>
                The PulseCare monitor straps comfortably around your wrist. It's compact enough to store in a drawer or pack in your bag, so you can check your status anytime, anywhere.
              </p>
            </div>

            <div className={styles.comparisonBox}>
              <h3 className={styles.compTitle}>No More Battery Swaps</h3>
              <p className={styles.compText}>
                No need to keep buying AA batteries. Just plug in the USB Type-C cable to charge it, just like your smartphone, and get weeks of regular use on a single charge.
              </p>
            </div>
          </div>

          <div className={styles.splitImageWrapper}>
            <Image
              src={lifestyleImg}
              alt="Person using the PulseCare wrist BP monitor in a bright home setting"
              width={600}
              height={480}
              className={styles.splitImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

