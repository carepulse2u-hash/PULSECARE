"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../app/page.module.css";
import { productData } from "../config/product";

export default function WhatsInTheBox() {
  const [images, setImages] = useState({
    hero: productData.images.hero,
    box: productData.images.box,
  });

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product?.images) {
          setImages({
            hero: data.product.images.hero || productData.images.hero,
            box: data.product.images.box || productData.images.box,
          });
        }
      })
      .catch((err) => console.error("Failed to load box images:", err));
  }, []);

  const boxItems = [
    {
      title: "Wrist BP Monitor",
      qty: "1 Unit",
      image: images.hero,
    },
    {
      title: "USB-C Charging Cable",
      qty: "1 Unit",
      image: null,
      icon: "usb"
    },
    {
      title: "User Manual",
      qty: "1 Unit",
      image: null,
      icon: "menu_book"
    },
    {
      title: "Product Packaging",
      qty: "1 Unit",
      image: images.box,
    }
  ];

  return (
    <section className={`${styles.boxSection} section-padding`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Unboxing</span>
          <h2 className={styles.sectionTitle}>What's in the box?</h2>
          <p className={styles.sectionDesc}>
            Every package contains all the essential items you need to start monitoring immediately.
          </p>
        </div>

        <div className={styles.boxGrid}>
          {boxItems.map((item, idx) => (
            <div key={idx} className={styles.boxItemCard}>
              <div className={styles.boxImgWrapper}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className={styles.boxImg}
                  />
                ) : (
                  <div className={styles.boxPlaceholderImg}>
                    <span className="material-icons" style={{ fontSize: "48px", color: "var(--primary)" }}>{item.icon}</span>
                  </div>
                )}
              </div>
              <div className={styles.boxCardContent}>
                <h3 className={styles.boxItemTitle}>{item.title}</h3>
                <span className={styles.boxItemQty}>{item.qty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

