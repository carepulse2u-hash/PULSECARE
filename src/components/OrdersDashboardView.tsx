"use client";

import { useEffect, useState } from "react";
import styles from "../app/orders/orders.module.css";

export interface Order {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  qty: number;
  totalPrice: number;
  paymentMethod?: string;
  paymentStatus?: string;
  status: string;
  createdAt: string;
}

export type DateFilterType = "all" | "today" | "yesterday" | "this_week" | "custom";

export default function OrdersDashboardView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Date Filter states
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (response.ok && data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || "Failed to load orders");
      }
    } catch (err) {
      setError("Failed to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper date functions
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Filter orders by date & search query
  const filteredOrders = orders.filter((order) => {
    // 1. Search filter
    const term = search.toLowerCase();
    const matchesSearch =
      order.orderId.toLowerCase().includes(term) ||
      order.name.toLowerCase().includes(term) ||
      order.phone.toLowerCase().includes(term) ||
      order.city.toLowerCase().includes(term) ||
      (order.paymentMethod && order.paymentMethod.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    // 2. Date filter
    if (!order.createdAt) return true;
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    if (dateFilter === "today") {
      return isSameDay(orderDate, now);
    }

    if (dateFilter === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return isSameDay(orderDate, yesterday);
    }

    if (dateFilter === "this_week") {
      const startOfWeek = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      return orderDate >= startOfWeek && orderDate <= now;
    }

    if (dateFilter === "custom") {
      if (customStartDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) return false;
      }
      if (customEndDate) {
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) return false;
      }
      return true;
    }

    return true; // "all"
  });

  // Calculate statistics for filtered list
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Export to Excel / CSV format
  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      alert("No orders available to export for the selected filter.");
      return;
    }

    // Prepare CSV header and rows
    const headers = [
      "Order ID",
      "Date & Time",
      "Customer Name",
      "Mobile Number",
      "Delivery Address",
      "Pincode",
      "City",
      "State",
      "Quantity",
      "Total Amount (INR)",
      "Payment Method",
      "Payment Status",
      "Order Status"
    ];

    const rows = filteredOrders.map((order) => [
      `"${order.orderId}"`,
      `"${new Date(order.createdAt).toLocaleString("en-IN")}"`,
      `"${order.name.replace(/"/g, '""')}"`,
      `"${order.phone}"`,
      `"${order.address.replace(/"/g, '""')}"`,
      `"${order.pincode}"`,
      `"${(order.city || "").replace(/"/g, '""')}"`,
      `"${(order.state || "").replace(/"/g, '""')}"`,
      order.qty,
      order.totalPrice,
      `"${(order.paymentMethod || "Cash on Delivery (COD)").replace(/"/g, '""')}"`,
      `"${order.paymentStatus || (order.paymentMethod?.toLowerCase().includes("online") ? "Paid" : "Pending COD")}"`,
      `"${order.status}"`
    ]);

    // UTF-8 BOM byte order mark for Excel compatibility
    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `PulseCare_Orders_${dateFilter}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Loading / Error States */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <span className="material-icons animate-pulse-ring" style={{ fontSize: "48px", color: "var(--primary)" }}>
            sync
          </span>
          <p style={{ marginTop: "16px", color: "var(--text-muted)", fontWeight: 600 }}>Loading Orders...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <span className="material-icons" style={{ fontSize: "48px", color: "#f43f5e" }}>error_outline</span>
          <p style={{ marginTop: "16px", color: "#f43f5e", fontWeight: 700 }}>{error}</p>
          <button onClick={fetchOrders} className={styles.backBtn} style={{ marginTop: "16px", display: "inline-flex" }}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.stat1}`}>
                <span className="material-icons">shopping_bag</span>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Filtered Orders</span>
                <span className={styles.statVal}>{totalOrders}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.stat2}`}>
                <span className="material-icons">payments</span>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Total Revenue</span>
                <span className={styles.statVal}>₹{totalRevenue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.stat3}`}>
                <span className="material-icons">trending_up</span>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Average Order Value</span>
                <span className={styles.statVal}>₹{avgOrderValue.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Controls Bar: Date Filter + Search + Export to Excel */}
          <div className={styles.controlsBar} style={{ flexWrap: "wrap", gap: "16px" }}>
            {/* Search Input */}
            <div className={styles.searchWrapper} style={{ flex: "1 1 280px" }}>
              <span className={`material-icons ${styles.searchIcon}`}>search</span>
              <input
                type="text"
                placeholder="Search by Order ID, Customer, Phone, City, Payment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Date Filter Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span className="material-icons" style={{ color: "#64748b", fontSize: "20px" }}>calendar_today</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilterType)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: "white",
                  cursor: "pointer"
                }}
              >
                <option value="all">📅 All Time</option>
                <option value="today">☀️ Today</option>
                <option value="yesterday">🕒 Yesterday</option>
                <option value="this_week">📊 This Week</option>
                <option value="custom">⚙️ Custom Date Range</option>
              </select>

              {/* Custom Date Pickers */}
              {dateFilter === "custom" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px" }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px" }}
                  />
                </div>
              )}

              {/* Export to Excel Button */}
              <button
                onClick={handleExportExcel}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#16a34a",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(22, 163, 74, 0.2)",
                  transition: "background 0.2s"
                }}
              >
                <span className="material-icons" style={{ fontSize: "18px" }}>file_download</span>
                Export to Excel (.csv)
              </button>
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={`material-icons ${styles.emptyIcon}`}>inbox</span>
              <h3 className={styles.emptyTitle}>No Orders Found</h3>
              <p className={styles.emptyDesc}>
                {search || dateFilter !== "all"
                  ? "No orders match your selected date range or search criteria."
                  : "Orders placed on the landing page will appear here."}
              </p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date & Time</th>
                    <th>Customer Details</th>
                    <th>Address</th>
                    <th>Qty</th>
                    <th>Total Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className={styles.orderIdCell}>{order.orderId}</td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <span className={styles.customerName}>{order.name}</span>
                        <span className={styles.customerPhone}>{order.phone}</span>
                      </td>
                      <td>
                        <div className={styles.addressCell} title={`${order.address}, ${order.city} - ${order.pincode}`}>
                          {order.address}, {order.city} - {order.pincode}
                        </div>
                      </td>
                      <td className={styles.qtyCell}>{order.qty}</td>
                      <td className={styles.priceCell}>₹{order.totalPrice.toLocaleString("en-IN")}</td>
                      <td>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: order.paymentMethod?.toLowerCase().includes("online") ? "#0284c7" : "#16a34a" }}>
                          {order.paymentMethod || "Cash on Delivery (COD)"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            order.status === "Pending" ? styles.statusPending : styles.statusConfirmed
                          }`}
                        >
                          <span className="material-icons" style={{ fontSize: "14px" }}>
                            {order.status === "Pending" ? "schedule" : "check"}
                          </span>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
