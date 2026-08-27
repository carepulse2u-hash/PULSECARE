import type { Metadata } from "next";
import Link from "next/link";
import styles from "../policy.module.css";

export const metadata: Metadata = {
  title: "Shipping Policy | PulseCare",
  description: "Learn about PulseCare's shipping timelines, dispatch schedule, and delivery process for your Wrist Blood Pressure Monitor order.",
};

export default function ShippingPolicy() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>
          Back to Home
        </Link>
        <div className={styles.badge}>
          <span className="material-icons" style={{ fontSize: 14 }}>local_shipping</span>
          Shipping Policy
        </div>
        <h1 className={styles.heroTitle}>Fast &amp; Reliable Delivery</h1>
        <p className={styles.heroSubtitle}>
          We dispatch your order the very next business day and ensure it reaches you promptly.
        </p>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Summary Grid */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">rocket_launch</span>
            </div>
            <h2 className={styles.cardTitle}>At a Glance</h2>
          </div>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Dispatch Time</span>
              <span className={styles.summaryValue}>Next Business Day</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Estimated Delivery</span>
              <span className={styles.summaryValue}>5 – 7 Working Days</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Shipping Coverage</span>
              <span className={styles.summaryValue}>Pan India</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Order Tracking</span>
              <span className={styles.summaryValue}>Via Email / SMS</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">inventory_2</span>
            </div>
            <h2 className={styles.cardTitle}>Dispatch &amp; Delivery Details</h2>
          </div>
          <div className={styles.body}>
            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>schedule</span>
              Same-Day Processing
            </h3>
            <p>
              All orders placed on PulseCare are processed <strong>the very next business day</strong>. Once your order is confirmed, our warehouse team picks, packs, and hands it over to our logistics partner within 24 hours (excluding Sundays and national public holidays).
            </p>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>map</span>
              Delivery Timeline
            </h3>
            <p>
              After dispatch, your package is delivered within <strong>5 to 7 working days</strong> depending on your pin code and the logistics partner&apos;s regional schedule. Metro cities and tier-1 towns generally receive deliveries sooner, while remote or rural pin codes may take the full 7 working days.
            </p>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>track_changes</span>
              Order Tracking
            </h3>
            <p>
              A tracking ID and courier partner details will be shared with you via <strong>email and/or SMS</strong> once your order is dispatched. You can use this ID on the respective courier website to monitor your shipment in real time.
            </p>

            <div className={styles.alertBox + " " + styles.info}>
              <span className={`material-icons ${styles.alertIcon}`}>info</span>
              <p>
                <strong>Note:</strong> Working days exclude Sundays and gazetted public holidays. Delivery estimates are indicative and may vary slightly due to logistics conditions, natural events, or high-volume seasons (e.g., festivals).
              </p>
            </div>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>payments</span>
              Shipping Charges
            </h3>
            <p>
              PulseCare offers <strong>free shipping</strong> on all orders across India. There are no hidden logistics fees at checkout.
            </p>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>support_agent</span>
              Shipping Support
            </h3>
            <p>
              If your package has not arrived within the estimated window, or if the tracking link shows no update for more than 48 hours, please contact us at our support email. We will coordinate with the logistics partner and resolve your concern at the earliest.
            </p>
          </div>
          <p className={styles.updatedNote}>Last updated: August 2025</p>
        </div>

      </div>
    </div>
  );
}
