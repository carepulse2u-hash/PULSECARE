"use client";

import Link from "next/link";
import styles from "./orders.module.css";
import OrdersDashboardView from "@/components/OrdersDashboardView";

export default function OrdersDashboard() {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/admin/login";
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      alert("Error connecting to server for logout.");
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className="container">
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.titleGroup}>
            <h1 className={styles.dashboardTitle}>PulseCare D2C Dashboard</h1>
            <p className={styles.dashboardSubtitle}>
              Monitor incoming orders, sort by date range (Today, Yesterday, This Week, Custom), and export data to Excel.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link href="/admin" className={styles.backBtn}>
              <span className="material-icons" style={{ fontSize: "18px" }}>settings</span>
              Backend CMS
            </Link>
            <Link href="/" className={styles.backBtn}>
              <span className="material-icons" style={{ fontSize: "18px" }}>arrow_back</span>
              Back to Shop
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <span className="material-icons" style={{ fontSize: "18px" }}>logout</span>
              Log Out
            </button>
          </div>
        </div>

        <OrdersDashboardView />
      </div>
    </div>
  );
}


