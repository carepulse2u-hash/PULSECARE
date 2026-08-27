import type { Metadata } from "next";
import Link from "next/link";
import styles from "../policy.module.css";

export const metadata: Metadata = {
  title: "Warranty Terms | PulseCare",
  description: "PulseCare offers a 12-month limited warranty covering software malfunctions. Learn what is covered and what is excluded.",
};

export default function WarrantyTerms() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>
          Back to Home
        </Link>
        <div className={styles.badge}>
          <span className="material-icons" style={{ fontSize: 14 }}>verified_user</span>
          Warranty Terms
        </div>
        <h1 className={styles.heroTitle}>12-Month Limited Warranty</h1>
        <p className={styles.heroSubtitle}>
          Every PulseCare device is backed by a 12-month warranty against software malfunctions.
        </p>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Summary */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">shield</span>
            </div>
            <h2 className={styles.cardTitle}>Warranty Summary</h2>
          </div>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Warranty Period</span>
              <span className={styles.summaryValue}>12 Months</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Coverage Type</span>
              <span className={styles.summaryValue}>Software / Firmware</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Water Damage</span>
              <span className={styles.summaryValue}>Not Covered</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Physical Damage</span>
              <span className={styles.summaryValue}>Not Covered</span>
            </div>
          </div>
        </div>

        {/* What is Covered */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">check_circle</span>
            </div>
            <h2 className={styles.cardTitle}>What is Covered</h2>
          </div>
          <div className={styles.body}>
            <p>
              The PulseCare Wrist Blood Pressure Monitor carries a <strong>12-month limited warranty</strong> from the date of original purchase. This warranty covers defects arising from <strong>software or firmware malfunctions</strong> under normal use conditions.
            </p>
            <ul className={styles.list}>
              <li>Device fails to power on due to an internal software fault</li>
              <li>Measurement readings become inconsistent or erroneous due to firmware issues</li>
              <li>Display malfunction not caused by physical impact or moisture</li>
              <li>Connectivity or synchronisation issues arising from a software defect</li>
              <li>Any other malfunction confirmed by our technical team to be software-origin</li>
            </ul>
            <p>
              Under a valid warranty claim, PulseCare will repair or replace the defective unit at no additional cost to you.
            </p>
          </div>
        </div>

        {/* What is NOT Covered */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ background: "#fff7ed" }}>
              <span className="material-icons" style={{ color: "#ea580c" }}>block</span>
            </div>
            <h2 className={styles.cardTitle}>What is Not Covered</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.alertBox}>
              <span className={`material-icons ${styles.alertIcon}`}>warning_amber</span>
              <p>
                This warranty is strictly limited to software malfunctions. It does <strong>not</strong> cover any form of physical or accidental damage.
              </p>
            </div>
            <ul className={styles.list}>
              <li><strong>Water damage</strong> — exposure to rain, submersion, sweat, or any other liquid</li>
              <li><strong>Physical damage</strong> — cracks, dents, broken display, or any damage from dropping or impact</li>
              <li>Damage caused by unauthorized repair, modification, or tampering</li>
              <li>Normal wear and tear, including strap degradation and cosmetic scratches</li>
              <li>Damage caused by improper use, storage in extreme temperatures, or use with incompatible accessories</li>
              <li>Consumable parts such as straps or batteries (unless defective at the time of purchase)</li>
              <li>Loss or theft of the device</li>
            </ul>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>email</span>
              How to Claim Warranty
            </h3>
            <p>
              To raise a warranty claim, contact our support team via email with your <strong>Order ID, purchase date, a detailed description of the issue</strong>, and any relevant photos or videos demonstrating the malfunction. Our technical team will assess your claim and respond within 3–5 business days.
            </p>
            <div className={styles.alertBox + " " + styles.info}>
              <span className={`material-icons ${styles.alertIcon}`}>info</span>
              <p>
                The warranty is <strong>non-transferable</strong> and applies only to the original purchaser. Proof of purchase (order confirmation) is required for all warranty claims.
              </p>
            </div>
          </div>
          <p className={styles.updatedNote}>Last updated: August 2025</p>
        </div>

      </div>
    </div>
  );
}
