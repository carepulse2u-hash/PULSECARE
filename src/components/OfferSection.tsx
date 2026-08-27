"use client";

import { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import { productData } from "../config/product";
import CountdownTimer, { CountdownDuration } from "./CountdownTimer";

export default function OfferSection() {
  const [qty, setQty] = useState(1);
  const [productInfo, setProductInfo] = useState({
    price: productData.price,
    compareAtPrice: productData.compareAtPrice || 2999,
    offerCountdownDuration: (productData.offerCountdownDuration ?? { days: 2, hours: 5, minutes: 45 }) as CountdownDuration,
    shippingText: productData.shippingText,
    warrantyText: productData.warrantyText,
    productName: productData.productName,
    offerCountdownStartedAt: undefined as number | undefined,
    serverTime: undefined as number | undefined,
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: ""
  });
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"form" | "processing">("form");
  const [success, setSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [placedPaymentMethod, setPlacedPaymentMethod] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProductInfo({
            price: data.product.price ?? productData.price,
            compareAtPrice: data.product.compareAtPrice ?? productData.compareAtPrice,
            offerCountdownDuration: data.product.offerCountdownDuration ?? productData.offerCountdownDuration ?? { days: 2, hours: 5, minutes: 45 },
            shippingText: data.product.shippingText || productData.shippingText,
            warrantyText: data.product.warrantyText || productData.warrantyText,
            productName: data.product.productName || productData.productName,
            offerCountdownStartedAt: data.product.offerCountdownStartedAt,
            serverTime: data.serverTime,
          });
        }
      })
      .catch((err) => console.error("Failed to load offer section product info:", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQtyChange = (val: number) => {
    if (qty + val >= 1) {
      setQty(qty + val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setError("Please fill out all required shipping fields.");
      return;
    }
    
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const cleanPincode = formData.pincode.replace(/\D/g, "");
    if (cleanPincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    if (paymentMethod === "online") {
      setPaymentStep("processing");
      // Simulate gateway authorization
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    const selectedPaymentLabel = paymentMethod === "online" 
      ? "Online Payment" 
      : "Cash on Delivery (COD)";

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          phone: cleanPhone,
          address: formData.address,
          pincode: cleanPincode,
          city: formData.city,
          state: formData.state,
          qty,
          paymentMethod: selectedPaymentLabel
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPlacedOrderId(data.order.orderId);
        setPlacedPaymentMethod(selectedPaymentLabel);
        setSuccess(true);
      } else {
        setError(data.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
      setPaymentStep("form");
    }
  };

  const totalPrice = productInfo.price * qty;
  const originalTotalPrice = productInfo.compareAtPrice ? productInfo.compareAtPrice * qty : 0;
  const savings = originalTotalPrice - totalPrice;

  return (
    <section className={`${styles.offerSection} section-padding`} id="order-form">
      <div className={styles.container}>
        <div className={styles.offerCardGrid}>
          <div className={styles.offerDetails}>
            <div className={styles.specialOfferBadge}>Special Launch Offer</div>
            
            <h2 className={styles.sectionTitle} style={{ textAlign: "left", margin: "0" }}>
              Get Your PulseCare Wrist Monitor Today
            </h2>
            <p className={styles.sectionDesc} style={{ margin: "0" }}>
              Take charge of your wellness routine. Start checking your vitals easily at home with voice-guided reassurance.
            </p>

            <div className={styles.offerPriceBox}>
              {originalTotalPrice > 0 && (
                <span className={styles.offerOriginalPrice}>
                  ₹{originalTotalPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className={styles.offerCurrentPrice}>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
              {savings > 0 && (
                <p style={{ color: "#10b981", fontSize: "14px", fontWeight: "700" }}>
                  You save ₹{savings.toLocaleString("en-IN")} ({Math.round((savings / originalTotalPrice) * 100)}% Off)
                </p>
              )}
            </div>

            <CountdownTimer 
              duration={productInfo.offerCountdownDuration}
              startedAt={productInfo.offerCountdownStartedAt}
              serverTime={productInfo.serverTime}
            />

            <div className={styles.offerInclusions}>
              <div className={styles.inclusionItem}>
                <span className={`material-icons ${styles.inclusionIcon}`}>check</span>
                <span>{productInfo.shippingText}</span>
              </div>
              <div className={styles.inclusionItem}>
                <span className={`material-icons ${styles.inclusionIcon}`}>check</span>
                <span>Cash on Delivery Available (Pay at your doorstep)</span>
              </div>
              <div className={styles.inclusionItem}>
                <span className={`material-icons ${styles.inclusionIcon}`}>check</span>
                <span>{productInfo.warrantyText}</span>
              </div>
            </div>

            <div className={styles.guaranteeText}>
              <span className={`material-icons ${styles.guaranteeIcon}`}>verified_user</span>
              <span>
                <strong>100% Satisfaction Guarantee:</strong> We offer a seamless replacement process if your device has any manufacturing issues. Contact support via the details inside the manual.
              </span>
            </div>
          </div>

          <div className={styles.orderFormContainer}>
            {success ? (
              <div className={styles.successState}>
                <span className={`material-icons ${styles.successIcon}`}>task_alt</span>
                <h3 className={styles.successTitle}>Order Placed Successfully!</h3>
                <p className={styles.successText} style={{ color: "var(--primary)", fontWeight: "700", fontSize: "16px" }}>
                  Order ID: {placedOrderId}
                </p>
                <div style={{ background: "white", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border)", width: "100%" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>Payment Method:</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: "15px", fontWeight: "700", color: "#10b981" }}>
                    ✓ {placedPaymentMethod} {placedPaymentMethod.toLowerCase().includes("online") ? "(Paid ✅)" : "(Pay at Doorstep)"}
                  </p>
                </div>
                <p className={styles.successText}>
                  Thank you, <strong>{formData.name}</strong>. Your order for <strong>{qty}x {productInfo.productName}</strong> has been received.
                </p>
                <p className={styles.successText} style={{ fontSize: "14px" }}>
                  Total Amount: <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>. We will dispatch your package soon.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setPlacedOrderId("");
                    setFormData({ name: "", phone: "", address: "", pincode: "", city: "", state: "" });
                    setQty(1);
                  }}
                  className={styles.headerCTA}
                  style={{ width: "100%", padding: "14px" }}
                >
                  Place Another Order
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className={styles.formTitle}>Shipping & Payment Information</h3>
                
                {error && (
                  <div style={{ color: "#f43f5e", fontSize: "13px", fontWeight: "600", marginBottom: "16px" }}>
                    {error}
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Select Quantity</label>
                    <div className={styles.quantitySelector}>
                      <button type="button" onClick={() => handleQtyChange(-1)} className={styles.qtyBtn}>-</button>
                      <span className={styles.qtyVal}>{qty}</span>
                      <button type="button" onClick={() => handleQtyChange(1)} className={styles.qtyBtn}>+</button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="phone">Mobile Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="address">Delivery Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House/Flat No, Street, Landmark"
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="pincode">Pincode *</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6-digit pincode"
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Select Payment Option *</label>
                    <div className={styles.paymentMethods}>
                      <div className={styles.paymentOptionsGrid}>
                        {/* Online Payment Card */}
                        <div
                          className={`${styles.paymentOptionCard} ${
                            paymentMethod === "online" ? styles.paymentOptionSelected : ""
                          }`}
                          onClick={() => setPaymentMethod("online")}
                        >
                          <div className={styles.paymentOptionHeader}>
                            <span className="material-icons" style={{ color: "#0284c7" }}>credit_card</span>
                            <span>Online Payment</span>
                          </div>
                          <span className={styles.paymentOptionDesc}>
                            UPI, GPay, PhonePe, Cards, NetBanking (Fast & Instant)
                          </span>
                        </div>

                        {/* Cash on Delivery Card */}
                        <div
                          className={`${styles.paymentOptionCard} ${
                            paymentMethod === "cod" ? styles.paymentOptionSelected : ""
                          }`}
                          onClick={() => setPaymentMethod("cod")}
                        >
                          <div className={styles.paymentOptionHeader}>
                            <span className="material-icons" style={{ color: "#16a34a" }}>payments</span>
                            <span>Cash on Delivery</span>
                          </div>
                          <span className={styles.paymentOptionDesc}>
                            Pay cash at your doorstep when product arrives
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.formButton}
                  >
                    {loading
                      ? paymentStep === "processing"
                        ? "Processing Secure Payment..."
                        : "Placing Order..."
                      : paymentMethod === "online"
                      ? `PAY ONLINE NOW — ₹${totalPrice.toLocaleString("en-IN")}`
                      : `CONFIRM COD ORDER — ₹${totalPrice.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

