"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./admin.module.css";
import { FullProductConfig } from "@/lib/productDb";
import { ReviewItem } from "@/config/product";
import OrdersDashboardView from "@/components/OrdersDashboardView";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "pricing" | "images" | "contact" | "reviews" | "security">("orders");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState<FullProductConfig | null>(null);

  // Security & Account state
  const [ownerEmail, setOwnerEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [requestCodeLoading, setRequestCodeLoading] = useState(false);
  const [changePassLoading, setChangePassLoading] = useState(false);
  const [codeSentMessage, setCodeSentMessage] = useState<string | null>(null);

  // Review editing modal state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<Partial<ReviewItem>>({
    rating: 5,
    author: "",
    content: "",
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
    verified: true,
  });

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/product");
      const data = await res.json();
      if (res.ok && data.success) {
        setForm(data.product);
      } else {
        showToast(data.error || "Failed to load product configuration", "error");
      }
    } catch (err) {
      showToast("Error connecting to server", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountInfo = async () => {
    try {
      const res = await fetch("/api/admin/auth/get-account");
      const data = await res.json();
      if (res.ok && data.success && data.ownerEmail) {
        setOwnerEmail(data.ownerEmail);
      }
    } catch (err) {
      console.error("Failed to load account info:", err);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchAccountInfo();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/admin/login";
      } else {
        showToast("Logout failed. Please try again.", "error");
      }
    } catch (err) {
      showToast("Error connecting to server for logout", "error");
    }
  };

  const handleSave = async () => {
    if (!form) return;

    // Validate countdown duration
    const dur = form.offerCountdownDuration ?? { days: 0, hours: 0, minutes: 0 };
    if (dur.days === 0 && dur.hours === 0 && dur.minutes === 0) {
      showToast("Offer Countdown Duration cannot be all zeros. Please enter at least 1 minute.", "error");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForm(data.product);
        showToast("Changes saved successfully to product.json!", "success");
      } else {
        showToast(data.error || "Failed to save changes", "error");
      }
    } catch (err) {
      showToast("Server error while saving changes", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle Image Upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, imageKey: "hero" | "lifestyle" | "box" | "benefits") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      showToast("Uploading image...", "success");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForm((prev) =>
          prev
            ? {
                ...prev,
                images: {
                  ...prev.images,
                  [imageKey]: data.url,
                },
              }
            : prev
        );
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast(data.error || "Failed to upload image", "error");
      }
    } catch (err) {
      showToast("Error uploading file", "error");
    }
  };

  // Review handlers
  const handleSaveReview = () => {
    if (!form) return;
    if (!reviewForm.author || !reviewForm.content) {
      showToast("Author and Review content are required", "error");
      return;
    }

    let updatedReviews = [...form.reviews];
    if (editingReviewId) {
      // Update existing
      updatedReviews = updatedReviews.map((r: any) =>
        (r.id || r.author) === editingReviewId
          ? ({ ...r, ...reviewForm } as any)
          : r
      );
    } else {
      // Add new
      const newRev = {
        id: `rev_${Date.now()}`,
        rating: Number(reviewForm.rating) || 5,
        content: reviewForm.content || "",
        author: reviewForm.author || "Anonymous",
        date: reviewForm.date || "Just now",
        verified: reviewForm.verified !== false,
      };
      updatedReviews.unshift(newRev);
    }

    setForm({ ...form, reviews: updatedReviews });
    setEditingReviewId(null);
    setReviewForm({
      rating: 5,
      author: "",
      content: "",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      verified: true,
    });
    showToast("Review list updated! Click 'Save All Changes' to make it live.", "success");
  };

  const handleDeleteReview = (reviewId: string) => {
    if (!form) return;
    const filtered = form.reviews.filter((r: any) => (r.id || r.author) !== reviewId);
    setForm({ ...form, reviews: filtered });
    showToast("Review deleted! Click 'Save All Changes' to persist.", "success");
  };

  const startEditReview = (rev: any) => {
    setEditingReviewId(rev.id || rev.author);
    setReviewForm({
      rating: rev.rating,
      author: rev.author,
      content: rev.content,
      date: rev.date,
      verified: rev.verified,
    });
  };

  const handleSaveOwnerEmail = async () => {
    if (!ownerEmail || !ownerEmail.includes("@")) {
      showToast("Please enter a valid owner email address", "error");
      return;
    }

    try {
      setSavingEmail(true);
      const res = await fetch("/api/admin/auth/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Owner email updated successfully!", "success");
      } else {
        showToast(data.error || "Failed to update owner email", "error");
      }
    } catch (err) {
      showToast("Error connecting to server", "error");
    } finally {
      setSavingEmail(false);
    }
  };

  const handleRequestCode = async () => {
    if (!ownerEmail || !ownerEmail.includes("@")) {
      showToast("Please save a valid Owner Email address first", "error");
      return;
    }

    try {
      setRequestCodeLoading(true);
      setCodeSentMessage(null);
      const res = await fetch("/api/admin/auth/request-code", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCodeSentMessage(data.message);
        showToast(data.message, "success");
      } else {
        showToast(data.error || "Failed to generate verification code", "error");
      }
    } catch (err) {
      showToast("Error requesting verification code", "error");
    } finally {
      setRequestCodeLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 4) {
      showToast("New password must be at least 4 characters long", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match. Please verify new password.", "error");
      return;
    }

    if (!verificationCode || verificationCode.trim().length !== 6) {
      showToast("Please enter the 6-digit verification code sent to your email", "error");
      return;
    }

    try {
      setChangePassLoading(true);
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: verificationCode.trim(),
          newPassword: newPassword.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Password changed successfully!", "success");
        setNewPassword("");
        setConfirmPassword("");
        setVerificationCode("");
        setCodeSentMessage(null);
      } else {
        showToast(data.error || "Failed to change password", "error");
      }
    } catch (err) {
      showToast("Error changing password", "error");
    } finally {
      setChangePassLoading(false);
    }
  };

  if (loading || !form) {
    return (
      <div className={styles.adminWrapper} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <span className="material-icons animate-spin" style={{ fontSize: "48px", color: "#0284c7" }}>
            sync
          </span>
          <p style={{ marginTop: "12px", color: "#64748b", fontWeight: 600 }}>Loading CMS Backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminWrapper}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContent}`}>
          <div className={styles.titleGroup}>
            <div className={styles.logoIcon}>
              <span className="material-icons">settings</span>
            </div>
            <div>
              <h1 className={styles.title}>PulseCare Backend CMS</h1>
              <p className={styles.subtitle}>Modify website content, pricing, images, address, contact & reviews</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Link href="/" className={styles.btnSecondary} target="_blank">
              <span className="material-icons" style={{ fontSize: "16px" }}>visibility</span>
              View Live Site
            </Link>
            <Link href="/orders" className={styles.btnSecondary}>
              <span className="material-icons" style={{ fontSize: "16px" }}>shopping_bag</span>
              Orders Dashboard
            </Link>
            <button onClick={handleSave} disabled={saving} className={styles.btnPrimary}>
              <span className="material-icons" style={{ fontSize: "18px" }}>
                {saving ? "sync" : "save"}
              </span>
              {saving ? "Saving..." : "Save All Changes"}
            </button>
            <button onClick={handleLogout} className={styles.btnDanger}>
              <span className="material-icons" style={{ fontSize: "16px" }}>logout</span>
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        {/* Toast Notification */}
        {toast && (
          <div
            className={`${styles.statusToast} ${
              toast.type === "success" ? styles.toastSuccess : styles.toastError
            }`}
          >
            <span className="material-icons">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            {toast.message}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className={styles.tabsRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === "orders" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>shopping_bag</span>
            Orders & Sales
          </button>

          <button
            className={`${styles.tabBtn} ${activeTab === "pricing" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("pricing")}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>sell</span>
            Pricing & General
          </button>

          <button
            className={`${styles.tabBtn} ${activeTab === "images" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("images")}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>image</span>
            Images & Media
          </button>

          <button
            className={`${styles.tabBtn} ${activeTab === "contact" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>contact_support</span>
            Address & Contact
          </button>

          <button
            className={`${styles.tabBtn} ${activeTab === "reviews" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>rate_review</span>
            Manage Reviews ({form.reviews?.length || 0})
          </button>

          <button
            className={`${styles.tabBtn} ${activeTab === "security" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>security</span>
            Account & Security
          </button>
        </div>

        {/* TAB 1: Orders & Sales Dashboard */}
        {activeTab === "orders" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className="material-icons" style={{ color: "#0284c7" }}>analytics</span>
              Orders & Sales Dashboard
            </h2>
            <p className={styles.cardSubtitle}>
              Filter orders by Today, Yesterday, This Week, or Custom Date Range and export formatted records to Excel.
            </p>
            <div style={{ marginTop: "20px" }}>
              <OrdersDashboardView />
            </div>
          </div>
        )}

        {/* TAB 2: Pricing & General Details */}
        {activeTab === "pricing" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className="material-icons" style={{ color: "#0284c7" }}>price_change</span>
              Product Pricing & Details
            </h2>
            <p className={styles.cardSubtitle}>
              Update product titles, pricing details, warranties, and stock settings.
            </p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Name</label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Selling Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Compare At / Original Price (₹)</label>
                <input
                  type="number"
                  value={form.compareAtPrice || 0}
                  onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })}
                  className={styles.input}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Offer Countdown Duration</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginTop: "4px",
                  }}
                >
                  {/* Days */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label
                      htmlFor="countdown-days"
                      style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}
                    >
                      Days
                    </label>
                    <input
                      id="countdown-days"
                      type="number"
                      min={0}
                      value={form.offerCountdownDuration?.days ?? 2}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setForm({
                          ...form,
                          offerCountdownDuration: {
                            days: val,
                            hours: form.offerCountdownDuration?.hours ?? 0,
                            minutes: form.offerCountdownDuration?.minutes ?? 0,
                          },
                        });
                      }}
                      className={styles.input}
                    />
                  </div>

                  {/* Hours */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label
                      htmlFor="countdown-hours"
                      style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}
                    >
                      Hours (0-23)
                    </label>
                    <input
                      id="countdown-hours"
                      type="number"
                      min={0}
                      max={23}
                      value={form.offerCountdownDuration?.hours ?? 5}
                      onChange={(e) => {
                        const val = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
                        setForm({
                          ...form,
                          offerCountdownDuration: {
                            days: form.offerCountdownDuration?.days ?? 0,
                            hours: val,
                            minutes: form.offerCountdownDuration?.minutes ?? 0,
                          },
                        });
                      }}
                      className={styles.input}
                    />
                  </div>

                  {/* Minutes */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label
                      htmlFor="countdown-minutes"
                      style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}
                    >
                      Minutes (0-59)
                    </label>
                    <input
                      id="countdown-minutes"
                      type="number"
                      min={0}
                      max={59}
                      value={form.offerCountdownDuration?.minutes ?? 45}
                      onChange={(e) => {
                        const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                        setForm({
                          ...form,
                          offerCountdownDuration: {
                            days: form.offerCountdownDuration?.days ?? 0,
                            hours: form.offerCountdownDuration?.hours ?? 0,
                            minutes: val,
                          },
                        });
                      }}
                      className={styles.input}
                    />
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px", display: "block" }}>
                  Set how long the countdown should run. Example: 2 days, 5 hours and 45 minutes.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Stock Status</label>
                <select
                  value={form.stockStatus}
                  onChange={(e) => setForm({ ...form, stockStatus: e.target.value as any })}
                  className={styles.select}
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Warranty Notice</label>
                <input
                  type="text"
                  value={form.warrantyText}
                  onChange={(e) => setForm({ ...form, warrantyText: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Shipping Notice</label>
                <input
                  type="text"
                  value={form.shippingText}
                  onChange={(e) => setForm({ ...form, shippingText: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Product Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Images Management */}
        {activeTab === "images" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className="material-icons" style={{ color: "#0284c7" }}>photo_library</span>
              Website Product Images
            </h2>
            <p className={styles.cardSubtitle}>
              Upload custom image files or enter image URLs to change any image on the site.
            </p>

            <div className={styles.imageCardGrid}>
              {/* Hero Image */}
              <div className={styles.imageBox}>
                <h4 style={{ margin: 0, fontWeight: 700 }}>1. Main Hero Product Image</h4>
                <div className={styles.imagePreviewWrapper}>
                  {form.images?.hero ? (
                    <img src={form.images.hero} alt="Hero Preview" className={styles.previewImg} />
                  ) : (
                    <span style={{ color: "#94a3b8" }}>No Image</span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Image Path / URL</label>
                  <input
                    type="text"
                    value={form.images?.hero || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        images: { ...form.images, hero: e.target.value },
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.uploadControls}>
                  <label className={styles.fileUploadLabel}>
                    <span className="material-icons" style={{ fontSize: "16px" }}>cloud_upload</span>
                    Upload New File
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleImageUpload(e, "hero")}
                    />
                  </label>
                </div>
              </div>

              {/* Lifestyle Image */}
              <div className={styles.imageBox}>
                <h4 style={{ margin: 0, fontWeight: 700 }}>2. Lifestyle / Demonstration Image</h4>
                <div className={styles.imagePreviewWrapper}>
                  {form.images?.lifestyle ? (
                    <img src={form.images.lifestyle} alt="Lifestyle Preview" className={styles.previewImg} />
                  ) : (
                    <span style={{ color: "#94a3b8" }}>No Image</span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Image Path / URL</label>
                  <input
                    type="text"
                    value={form.images?.lifestyle || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        images: { ...form.images, lifestyle: e.target.value },
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.uploadControls}>
                  <label className={styles.fileUploadLabel}>
                    <span className="material-icons" style={{ fontSize: "16px" }}>cloud_upload</span>
                    Upload New File
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleImageUpload(e, "lifestyle")}
                    />
                  </label>
                </div>
              </div>

              {/* Box Image */}
              <div className={styles.imageBox}>
                <h4 style={{ margin: 0, fontWeight: 700 }}>3. Packaging / Box Image</h4>
                <div className={styles.imagePreviewWrapper}>
                  {form.images?.box ? (
                    <img src={form.images.box} alt="Box Preview" className={styles.previewImg} />
                  ) : (
                    <span style={{ color: "#94a3b8" }}>No Image</span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Image Path / URL</label>
                  <input
                    type="text"
                    value={form.images?.box || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        images: { ...form.images, box: e.target.value },
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.uploadControls}>
                  <label className={styles.fileUploadLabel}>
                    <span className="material-icons" style={{ fontSize: "16px" }}>cloud_upload</span>
                    Upload New File
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleImageUpload(e, "box")}
                    />
                  </label>
                </div>
              </div>

              {/* Everyday Wellness / Benefits Image */}
              <div className={styles.imageBox}>
                <h4 style={{ margin: 0, fontWeight: 700 }}>4. Everyday Wellness / Benefits Image</h4>
                <div className={styles.imagePreviewWrapper}>
                  {form.images?.benefits ? (
                    <img src={form.images.benefits} alt="Everyday Wellness Preview" className={styles.previewImg} />
                  ) : (
                    <span style={{ color: "#94a3b8" }}>No Image</span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Image Path / URL</label>
                  <input
                    type="text"
                    value={form.images?.benefits || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        images: { ...form.images, benefits: e.target.value },
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.uploadControls}>
                  <label className={styles.fileUploadLabel}>
                    <span className="material-icons" style={{ fontSize: "16px" }}>cloud_upload</span>
                    Upload New File
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleImageUpload(e, "benefits")}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Address & Contact Details */}
        {activeTab === "contact" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className="material-icons" style={{ color: "#0284c7" }}>location_on</span>
              Address & Contact Details
            </h2>
            <p className={styles.cardSubtitle}>
              Update your customer support email, phone number, operating hours, and business address displayed on the site.
            </p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Support Email Address</label>
                <input
                  type="email"
                  value={form.contact?.email || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact: { ...form.contact, email: e.target.value },
                    })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Support Phone Number</label>
                <input
                  type="text"
                  value={form.contact?.phone || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact: { ...form.contact, phone: e.target.value },
                    })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Working Hours</label>
                <input
                  type="text"
                  value={form.contact?.hours || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact: { ...form.contact, hours: e.target.value },
                    })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>City / Region</label>
                <input
                  type="text"
                  value={form.contact?.location || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact: { ...form.contact, location: e.target.value },
                    })
                  }
                  className={styles.input}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Full Business Physical Address</label>
                <textarea
                  value={form.contact?.address || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact: { ...form.contact, address: e.target.value },
                    })
                  }
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Manage Customer Reviews */}
        {activeTab === "reviews" && (
          <div>
            {/* Add / Edit Review Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className="material-icons" style={{ color: "#0284c7" }}>
                  {editingReviewId ? "edit" : "add_circle"}
                </span>
                {editingReviewId ? "Edit Customer Review" : "Add New Customer Review"}
              </h2>
              <p className={styles.cardSubtitle}>
                {editingReviewId
                  ? "Update the details of the selected review below."
                  : "Insert a new verified customer review into the website testinomial list."}
              </p>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Customer Name / Author</label>
                  <input
                    type="text"
                    value={reviewForm.author}
                    onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                    placeholder="e.g. Ramesh Krishnan"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Star Rating (1 to 5)</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className={styles.select}
                  >
                    <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                    <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                    <option value={3}>3 Stars ⭐⭐⭐</option>
                    <option value={2}>2 Stars ⭐⭐</option>
                    <option value={1}>1 Star ⭐</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Date</label>
                  <input
                    type="text"
                    value={reviewForm.date}
                    onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>Review Content</label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    placeholder="Write customer review content..."
                    className={styles.textarea}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button onClick={handleSaveReview} className={styles.btnPrimary}>
                  <span className="material-icons" style={{ fontSize: "18px" }}>
                    {editingReviewId ? "check_circle" : "add"}
                  </span>
                  {editingReviewId ? "Update Review" : "Add Review"}
                </button>

                {editingReviewId && (
                  <button
                    onClick={() => {
                      setEditingReviewId(null);
                      setReviewForm({
                        rating: 5,
                        author: "",
                        content: "",
                        date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
                        verified: true,
                      });
                    }}
                    className={styles.btnSecondary}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            {/* List of Current Reviews */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Live Reviews ({form.reviews?.length || 0})</h3>
              <div className={styles.reviewsList}>
                {form.reviews?.map((rev: any, idx: number) => {
                  const revId = rev.id || rev.author || `rev_${idx}`;
                  return (
                    <div key={revId} className={styles.reviewCard}>
                      <div>
                        <div className={styles.reviewHeader}>
                          <span className={styles.authorName}>{rev.author}</span>
                          <div className={styles.stars}>
                            {"★".repeat(rev.rating)}
                            {"☆".repeat(5 - rev.rating)}
                          </div>
                          <span className={styles.reviewMeta}>{rev.date}</span>
                        </div>
                        <p className={styles.reviewContent}>{rev.content}</p>
                      </div>

                      <div className={styles.reviewActions}>
                        <button onClick={() => startEditReview(rev)} className={styles.btnEdit}>
                          <span className="material-icons" style={{ fontSize: "14px" }}>edit</span>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteReview(revId)} className={styles.btnDanger}>
                          <span className="material-icons" style={{ fontSize: "14px" }}>delete</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Account & Security */}
        {activeTab === "security" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className="material-icons" style={{ color: "#0284c7" }}>shield</span>
              Account & Security Settings
            </h2>
            <p className={styles.cardSubtitle}>
              Manage the owner's email address and change the administrative password using email verification.
            </p>

            <div style={{ marginTop: "24px", display: "grid", gap: "28px" }}>
              {/* Section 1: Owner's Email Configuration */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-icons" style={{ color: "#0284c7", fontSize: "20px" }}>email</span>
                  Owner's Email Address
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                  Verification codes for password updates and administrative notifications will be sent to this email address.
                </p>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 300px" }}>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="owner@pulsecare.in"
                      className={styles.input}
                    />
                  </div>
                  <button
                    onClick={handleSaveOwnerEmail}
                    disabled={savingEmail}
                    className={styles.btnPrimary}
                    style={{ padding: "10px 20px" }}
                  >
                    <span className="material-icons" style={{ fontSize: "18px" }}>
                      {savingEmail ? "sync" : "save"}
                    </span>
                    {savingEmail ? "Saving..." : "Save Email"}
                  </button>
                </div>
              </div>

              {/* Section 2: Password Change via Email Verification */}
              <div
                style={{
                  background: "#fff1f2",
                  border: "1px solid #fecdd3",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#be123c", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-icons" style={{ color: "#e11d48", fontSize: "20px" }}>lock_reset</span>
                  Change Admin Password (Email Verification Required)
                </h3>
                <p style={{ fontSize: "13px", color: "#9f1239", marginBottom: "16px" }}>
                  To change your password, request a 6-digit verification code. The code will be sent to <strong>{ownerEmail || "your configured email"}</strong>.
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 4 characters)"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={handleRequestCode}
                    disabled={requestCodeLoading}
                    className={styles.btnSecondary}
                    style={{ padding: "10px 18px", border: "1px solid #fda4af", color: "#be123c", background: "#ffffff" }}
                  >
                    <span className="material-icons" style={{ fontSize: "18px" }}>
                      {requestCodeLoading ? "sync" : "send"}
                    </span>
                    {requestCodeLoading ? "Sending Code..." : "Request 6-Digit Code"}
                  </button>

                  <div style={{ flex: "1 1 200px", maxWidth: "250px" }}>
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="6-Digit Verification Code"
                      className={styles.input}
                      style={{ letterSpacing: "2px", fontWeight: "700", textAlign: "center" }}
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={changePassLoading}
                    className={styles.btnDanger}
                    style={{ padding: "10px 24px", background: "#e11d48", border: "none" }}
                  >
                    <span className="material-icons" style={{ fontSize: "18px" }}>
                      {changePassLoading ? "sync" : "check_circle"}
                    </span>
                    {changePassLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>

                {codeSentMessage && (
                  <div style={{ marginTop: "14px", padding: "10px 14px", background: "#ffffff", border: "1px solid #f43f5e", borderRadius: "6px", color: "#9f1239", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="material-icons" style={{ fontSize: "18px", color: "#e11d48" }}>info</span>
                    <span>{codeSentMessage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
