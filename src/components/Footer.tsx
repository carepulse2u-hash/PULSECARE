"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../app/page.module.css";

export default function Footer() {
  const [contact, setContact] = useState({
    email: "support@pulsecare.in",
    phone: "+91 98765 43210",
    hours: "Mon - Sat, 10 AM - 6 PM",
    address: "101 PulseCare Towers, Health Tech Park, Mumbai, Maharashtra 400001",
    location: "Mumbai, India"
  });

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product?.contact) {
          setContact(data.product.contact);
        }
      })
      .catch((err) => console.error("Failed to load contact info:", err));
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <div className={styles.footerLogo}>
              <span className={`material-icons ${styles.logoIcon}`} style={{ fontSize: "24px" }}>favorite</span>
              <span>PulseCare</span>
            </div>
            <p className={styles.footerText}>
              A modern D2C health tech brand dedicated to making daily wellness checks comfortable, digital, and reachable for everyone.
            </p>

          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Shop</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="#features" className={styles.footerLink}>Features</a>
              </li>
              <li>
                <a href="#order-form" className={styles.footerLink}>Pricing</a>
              </li>
              <li>
                <a href="#order-form" className={styles.footerLink}>Order Form</a>
              </li>

            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Policies</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/policies/shipping-policy" className={styles.footerLink}>Shipping Policy</Link>
              </li>
              <li>
                <Link href="/policies/return-replacement" className={styles.footerLink}>Return &amp; Replacement</Link>
              </li>
              <li>
                <Link href="/policies/warranty" className={styles.footerLink}>Warranty Terms</Link>
              </li>
              <li>
                <Link href="/policies/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/terms-conditions" className={styles.footerLink}>Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Contact & Address</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerText}>
                <strong>Email:</strong> {contact.email}
              </li>
              <li className={styles.footerText}>
                <strong>Phone:</strong> {contact.phone}
              </li>
              <li className={styles.footerText}>
                <strong>Hours:</strong> {contact.hours}
              </li>
              <li className={styles.footerText}>
                <strong>Address:</strong> {contact.address}
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.disclaimerBox}>
          <p className={styles.disclaimerText}>
            <strong>Medical Disclaimer:</strong> This device is intended for personal blood-pressure monitoring and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified physician or healthcare provider for interpreting measurement values or before making any medical decisions.
          </p>
        </div>

        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} PulseCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
