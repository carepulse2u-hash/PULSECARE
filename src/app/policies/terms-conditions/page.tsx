import type { Metadata } from "next";
import Link from "next/link";
import styles from "../policy.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions | PulseCare",
  description: "Read PulseCare's Terms & Conditions governing the purchase and use of our Wrist Blood Pressure Monitor.",
};

export default function TermsConditions() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>
          Back to Home
        </Link>
        <div className={styles.badge}>
          <span className="material-icons" style={{ fontSize: 14 }}>gavel</span>
          Terms &amp; Conditions
        </div>
        <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
        <p className={styles.heroSubtitle}>
          Please read these terms carefully before placing an order or using our website.
        </p>
      </div>

      {/* Content */}
      <div className={styles.content}>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">article</span>
            </div>
            <h2 className={styles.cardTitle}>1. Acceptance of Terms</h2>
          </div>
          <div className={styles.body}>
            <p>
              By accessing or using the PulseCare website (&quot;Site&quot;) or by placing an order for any product offered on the Site, you agree to be bound by these Terms &amp; Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Site or place any orders.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you (&quot;Customer&quot; or &quot;User&quot;) and PulseCare (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">shopping_cart</span>
            </div>
            <h2 className={styles.cardTitle}>2. Products &amp; Orders</h2>
          </div>
          <div className={styles.body}>
            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>inventory</span>
              Product Information
            </h3>
            <p>
              We make every effort to display product descriptions, images, and specifications as accurately as possible. However, we do not warrant that product descriptions or other content on the Site are error-free, complete, or current. We reserve the right to correct any errors and to update information at any time without prior notice.
            </p>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>fact_check</span>
              Order Acceptance
            </h3>
            <p>
              Placing an order constitutes an offer to purchase a product. We reserve the right to accept or decline any order at our sole discretion. An order is confirmed only upon our explicit confirmation (via SMS or email). We may cancel orders due to stock unavailability, pricing errors, or suspected fraudulent activity, and will notify you promptly in such cases.
            </p>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>payments</span>
              Payment
            </h3>
            <p>
              We currently offer Cash on Delivery (COD) as the primary payment method. You agree to pay the full invoiced amount at the time of delivery. Refusal to accept delivery after an order is confirmed may result in cancellation fees or restriction of future orders.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">local_shipping</span>
            </div>
            <h2 className={styles.cardTitle}>3. Delivery</h2>
          </div>
          <div className={styles.body}>
            <p>
              Delivery timelines are estimates and are subject to the logistics partner&apos;s schedule and external factors. PulseCare is not liable for delays caused by courier companies, natural disasters, strikes, government orders, or other circumstances beyond our control.
            </p>
            <p>
              Risk of loss and title of products pass to you upon delivery. Please inspect your package at the time of delivery. Any visible damage should be noted with the delivery agent.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">medical_information</span>
            </div>
            <h2 className={styles.cardTitle}>4. Medical Disclaimer</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.alertBox}>
              <span className={`material-icons ${styles.alertIcon}`}>warning_amber</span>
              <p>
                The PulseCare Wrist Blood Pressure Monitor is intended for personal health monitoring only. It is <strong>not a medical device</strong> for clinical diagnosis and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
            <p>
              Always consult a qualified physician or licensed healthcare professional before making any decisions based on the readings from this device. PulseCare is not responsible for any health outcomes resulting from reliance on device measurements.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">block</span>
            </div>
            <h2 className={styles.cardTitle}>5. Prohibited Use</h2>
          </div>
          <div className={styles.body}>
            <p>You agree not to:</p>
            <ul className={styles.list}>
              <li>Use the Site for any unlawful purpose or in violation of any regulations</li>
              <li>Submit false, misleading, or fraudulent orders or personal information</li>
              <li>Attempt to gain unauthorized access to any part of the Site, server, or database</li>
              <li>Reproduce, duplicate, copy, sell, or exploit any portion of the Site without express written permission from PulseCare</li>
              <li>Use automated tools, bots, or scrapers to extract data from the Site</li>
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">copyright</span>
            </div>
            <h2 className={styles.cardTitle}>6. Intellectual Property</h2>
          </div>
          <div className={styles.body}>
            <p>
              All content on this Site — including text, graphics, logos, images, product names, and software — is the exclusive property of PulseCare or its content suppliers and is protected under applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">balance</span>
            </div>
            <h2 className={styles.cardTitle}>7. Limitation of Liability</h2>
          </div>
          <div className={styles.body}>
            <p>
              To the maximum extent permitted by applicable law, PulseCare shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className={styles.list}>
              <li>Your use of or inability to use the Site or products</li>
              <li>Any unauthorized access to or use of our servers or personal data</li>
              <li>Any interruption or cessation of transmission to or from the Site</li>
              <li>Any errors, inaccuracies, or omissions in any content on the Site</li>
            </ul>
            <p>
              Our total liability to you for any claim arising from or in connection with these Terms or your purchase shall not exceed the amount actually paid by you for the product in question.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">gavel</span>
            </div>
            <h2 className={styles.cardTitle}>8. Governing Law &amp; Dispute Resolution</h2>
          </div>
          <div className={styles.body}>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with these Terms, including any question regarding their existence, validity, or termination, shall be subject to the exclusive jurisdiction of the courts located in India.
            </p>
            <p>
              We encourage you to contact our support team first to resolve any disputes informally before pursuing legal remedies.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">update</span>
            </div>
            <h2 className={styles.cardTitle}>9. Changes to These Terms</h2>
          </div>
          <div className={styles.body}>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Site. Your continued use of the Site or placement of orders after any such changes constitutes your acceptance of the new Terms. We recommend reviewing these Terms periodically.
            </p>
          </div>
          <p className={styles.updatedNote}>Last updated: August 2025</p>
        </div>

      </div>
    </div>
  );
}
