import type { Metadata } from "next";
import Link from "next/link";
import styles from "../policy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | PulseCare",
  description: "PulseCare's Privacy Policy explains how we collect, use, store, and protect your personal information when you shop with us.",
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>
          Back to Home
        </Link>
        <div className={styles.badge}>
          <span className="material-icons" style={{ fontSize: 14 }}>lock</span>
          Privacy Policy
        </div>
        <h1 className={styles.heroTitle}>Your Privacy Matters</h1>
        <p className={styles.heroSubtitle}>
          We are committed to protecting your personal information and being transparent about how we use it.
        </p>
      </div>

      {/* Content */}
      <div className={styles.content}>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">info</span>
            </div>
            <h2 className={styles.cardTitle}>1. Introduction</h2>
          </div>
          <div className={styles.body}>
            <p>
              PulseCare (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates this website to sell the PulseCare Rechargeable Wrist Blood Pressure Monitor directly to consumers in India. This Privacy Policy explains what personal information we collect, why we collect it, how we use and protect it, and the choices available to you.
            </p>
            <p>
              By placing an order or using our website, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">person</span>
            </div>
            <h2 className={styles.cardTitle}>2. Information We Collect</h2>
          </div>
          <div className={styles.body}>
            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>assignment</span>
              Information You Provide
            </h3>
            <p>When you place an order, we collect:</p>
            <ul className={styles.list}>
              <li>Full name</li>
              <li>Delivery address (house/flat number, street, city, state, pin code)</li>
              <li>Phone number</li>
              <li>Email address (if provided)</li>
              <li>Order details and product preferences</li>
            </ul>

            <h3 className={styles.sectionHeading}>
              <span className="material-icons" style={{ fontSize: 18 }}>analytics</span>
              Information Collected Automatically
            </h3>
            <p>When you visit our website, we may automatically receive:</p>
            <ul className={styles.list}>
              <li>IP address and approximate geographic location</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website or source</li>
              <li>Device type (desktop / mobile / tablet)</li>
            </ul>
            <p>This data is collected through standard server logs and may be used via analytics tools to improve our website performance.</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">manage_search</span>
            </div>
            <h2 className={styles.cardTitle}>3. How We Use Your Information</h2>
          </div>
          <div className={styles.body}>
            <p>We use the information we collect to:</p>
            <ul className={styles.list}>
              <li>Process and fulfil your orders and arrange delivery</li>
              <li>Send order confirmations, shipping updates, and delivery notifications</li>
              <li>Respond to your customer service queries, return or replacement requests</li>
              <li>Maintain our internal order management records</li>
              <li>Improve our website, products, and services based on usage patterns</li>
              <li>Comply with legal obligations under applicable Indian law</li>
            </ul>
            <p>
              We do <strong>not</strong> sell, rent, or trade your personal information to third parties for their own marketing purposes.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">share</span>
            </div>
            <h2 className={styles.cardTitle}>4. Sharing of Information</h2>
          </div>
          <div className={styles.body}>
            <p>
              We may share your personal information only in the following limited circumstances:
            </p>
            <ul className={styles.list}>
              <li><strong>Logistics Partners:</strong> Your name, address, and phone number are shared with our courier or logistics partners solely to facilitate delivery of your order.</li>
              <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating our website or conducting our business, subject to confidentiality obligations.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to a valid request from a governmental authority.</li>
            </ul>
            <div className={styles.alertBox + " " + styles.info}>
              <span className={`material-icons ${styles.alertIcon}`}>info</span>
              <p>
                All third-party partners we work with are bound by contractual obligations to keep your information secure and use it only for the specified purpose.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">security</span>
            </div>
            <h2 className={styles.cardTitle}>5. Data Security</h2>
          </div>
          <div className={styles.body}>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our order data is stored securely on our server infrastructure.
            </p>
            <p>
              However, please be aware that no method of electronic storage or internet transmission is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">cookie</span>
            </div>
            <h2 className={styles.cardTitle}>6. Cookies</h2>
          </div>
          <div className={styles.body}>
            <p>
              Our website may use cookies — small text files stored on your device — to enhance your browsing experience. Cookies help us understand how visitors use our site and allow certain features to function correctly.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being set. However, if you do not accept cookies, some parts of our website may not function as intended.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">child_care</span>
            </div>
            <h2 className={styles.cardTitle}>7. Children&apos;s Privacy</h2>
          </div>
          <div className={styles.body}>
            <p>
              Our website and products are not directed at children under the age of 18. We do not knowingly collect personal information from minors. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">edit</span>
            </div>
            <h2 className={styles.cardTitle}>8. Your Rights</h2>
          </div>
          <div className={styles.body}>
            <p>You have the right to:</p>
            <ul className={styles.list}>
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction of any inaccurate personal information</li>
              <li>Request deletion of your personal information (subject to legal obligations)</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at our support email address.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <span className="material-icons">update</span>
            </div>
            <h2 className={styles.cardTitle}>9. Changes to This Policy</h2>
          </div>
          <div className={styles.body}>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically. Continued use of our website after changes are posted constitutes acceptance of the revised policy.
            </p>
          </div>
          <p className={styles.updatedNote}>Last updated: August 2025</p>
        </div>

      </div>
    </div>
  );
}
