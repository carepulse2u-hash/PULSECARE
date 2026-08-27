"use client";

import { useState } from "react";
import styles from "../app/page.module.css";
import { productData } from "../config/product";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className={`${styles.faqSection} section-padding`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Help Center</span>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionDesc}>
            Everything you need to know about the PulseCare wrist blood pressure monitor.
          </p>
        </div>

        <div className={styles.faqContainer}>
          {productData.faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemActive : ""}`}
              >
                <button
                  className={styles.faqQuestionButton}
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={`material-icons ${styles.faqChevron} ${isOpen ? styles.faqChevronActive : ""}`}>
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
