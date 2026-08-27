import type { Metadata } from "next";
import Link from "next/link";
import styles from "../policy.module.css";

export const metadata: Metadata = {
  title: "Return & Replacement Policy | PulseCare",
  description: "Understand PulseCare's return and replacement process — including the unboxing video requirement and eligibility criteria.",
};

export default function ReturnReplacement() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>
          Back to Home
        </Link>
        <div className={styles.badge}>
          <span className="material-icons" style={{ fontSize: 14 }}>swap_horiz</span>
          Return &amp; Replacement
        </div>
        <h1 className={styles.heroTitle}>Returns &amp; Replacements</h1>
        <p className={styles.heroSubtitle}>
          We stand behind every product we ship. Here&apos;s how we handle returns and replacements fairly.
        </p>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Critical Warning */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ background: "#fff7ed" }}>
              <span className="material-icons" style={{ color: "#ea580c" }}>videocam</span>
            </div>
            <h2 className={styles.cardTitle}>Unboxing Video — Mandatory Requirement</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.alertBox}>
              <span className={`material-icons ${styles.alertIcon}`}>warning_amber</span>
              <p>
                <strong>A clear, uninterrupted box-opening (unboxing) video is mandatory</strong> for all return and replacement requests. Claims submitted without a valid unboxing video will not be processed under any circumstance. Please record this video before opening any seal or packaging.
              </p>
            </div>
            <p>
              The unboxing video must clearly show:
            </p>
            <ul className={styles.list}>
              <li>The outer box / packaging with your name and address label visible</li>
              <li>The box being opened from a sealed condition (all seals intact at the start)</li>
              <li>The contents as removed from the box, showing any damage or discrepancy</li>
              <li>The product and all accessories as received</li>
            </ul>
            <p>
              Along with the video, you must also submit <strong>clear photographs</strong> of the product and packaging condition at the time of delivery.
            </p>
          </div>
        </div>

        {/* Return Policy */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">assignment_return</span>
            </div>
            <h2 className={styles.cardTitle}>Return Policy</h2>
          </div>
          <div className={styles.body}>
            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>check_circle</span>
              Eligible for Return
            </h3>
            <p>
              Returns are accepted <strong>only when the product delivered is not the same as what was ordered</strong> — i.e., you receive a completely wrong item. This is a strict eligibility criterion and no other reason qualifies for a full return.
            </p>
            <ul className={styles.list}>
              <li>Wrong product delivered (different model or variant than ordered)</li>
            </ul>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>cancel</span>
              Not Eligible for Return
            </h3>
            <ul className={styles.list}>
              <li>Change of mind after delivery</li>
              <li>Product not matching personal expectations or preferences</li>
              <li>Damage caused after delivery (physical or water damage)</li>
              <li>Issues arising from improper use or storage</li>
            </ul>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>email</span>
              How to Initiate a Return
            </h3>
            <p>
              All return requests must be submitted via <strong>email</strong> to our support address. Your request must include:
            </p>
            <ul className={styles.list}>
              <li>Your Order ID</li>
              <li>Your registered name and contact number</li>
              <li>A clear description of the issue</li>
              <li>The unboxing video (as an attachment or sharable link)</li>
              <li>Photographs of the product and packaging</li>
            </ul>
            <p>
              Our team will review your submission within <strong>2–3 business days</strong> and communicate the resolution.
            </p>
          </div>
        </div>

        {/* Replacement Policy */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">autorenew</span>
            </div>
            <h2 className={styles.cardTitle}>Replacement Policy</h2>
          </div>
          <div className={styles.body}>
            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>check_circle</span>
              Eligible for Replacement
            </h3>
            <p>
              For all complaints other than a wrong product delivery — such as a defective unit, damaged product on arrival, or non-functional device — we offer a <strong>replacement only</strong>. No cash refund will be issued in such cases.
            </p>
            <ul className={styles.list}>
              <li>Product received in physically damaged condition (transit damage)</li>
              <li>Device not functioning on first use (dead on arrival)</li>
              <li>Missing accessories from the box as listed in the product description</li>
            </ul>

            <div className={styles.alertBox + " " + styles.info}>
              <span className={`material-icons ${styles.alertIcon}`}>info</span>
              <p>
                Replacement requests are subject to the same unboxing video and photograph requirements. Requests made after 48 hours of delivery may not be accepted.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
