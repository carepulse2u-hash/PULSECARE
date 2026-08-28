"use client";

import { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import { productData } from "../config/product";
import CountdownTimer, { CountdownDuration } from "./CountdownTimer";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface CustomerOrder {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  qty: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  // Customer Orders & Tabs
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"checkout" | "my-orders">("checkout");
  const [searchPhone, setSearchPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResultMsg, setSearchResultMsg] = useState("");

  // Load customer orders from localStorage & check hash
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pulsecare_customer_orders");
      if (saved) {
        setCustomerOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load local customer orders:", e);
    }

    const handleHashChange = () => {
      if (window.location.hash === "#my-orders" || window.location.hash === "#my-orders-section") {
        setActiveTab("my-orders");
      } else if (window.location.hash === "#order-form") {
        setActiveTab("checkout");
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href === "#order-form") {
          setActiveTab("checkout");
        } else if (href === "#my-orders" || href === "#my-orders-section") {
          setActiveTab("my-orders");
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

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

  const saveOrderToLocalStorage = (newOrder: CustomerOrder) => {
    setCustomerOrders((prev) => {
      const filtered = prev.filter((o) => o.orderId !== newOrder.orderId);
      const updated = [newOrder, ...filtered];
      try {
        localStorage.setItem("pulsecare_customer_orders", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist order in localStorage:", e);
      }
      return updated;
    });
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Allow only numbers, max 10 digits
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: digits }));
      }
      return;
    }

    if (name === "pincode") {
      // Allow only numbers, max 6 digits
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 6) {
        setFormData((prev) => ({ ...prev, [name]: digits }));
        
        // Auto-fetch City name when exactly 6 digits are entered (Indian post offices)
        if (digits.length === 6 && /^[1-9]\d{5}$/.test(digits)) {
          try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${digits}`);
            const data = await res.json();
            if (Array.isArray(data) && data[0]?.Status === "Success") {
              const postOffices = data[0].PostOffice;
              if (Array.isArray(postOffices) && postOffices.length > 0) {
                // Find District or Division
                const cityFound = postOffices[0].District || postOffices[0].Division;
                if (cityFound) {
                  setFormData((prev) => ({ ...prev, city: cityFound }));
                }
              }
            }
          } catch (err) {
            console.error("Pincode lookup error:", err);
          }
        }
      }
      return;
    }

    if (name === "city") {
      // Allow letters and spaces only
      const cleanVal = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanVal }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQtyChange = (val: number) => {
    if (qty + val >= 1) {
      setQty(qty + val);
    }
  };

  const handlePlaceAnotherOrder = () => {
    setSuccess(false);
    setPlacedOrderId("");
    setPlacedPaymentMethod("");
    setError("");
    setActiveTab("checkout");
  };

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResultMsg("");
    const cleanSearchPhone = searchPhone.replace(/\D/g, "");
    if (cleanSearchPhone.length < 10) {
      setSearchResultMsg("Please enter a valid 10-digit phone number.");
      return;
    }

    setSearching(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.orders)) {
        const matched = data.orders.filter((ord: any) =>
          ord.phone && ord.phone.replace(/\D/g, "").endsWith(cleanSearchPhone.slice(-10))
        );

        if (matched.length > 0) {
          setCustomerOrders((prev) => {
            const map = new Map();
            [...matched, ...prev].forEach((o) => map.set(o.orderId, o));
            const combined = Array.from(map.values());
            try {
              localStorage.setItem("pulsecare_customer_orders", JSON.stringify(combined));
            } catch (e) {}
            return combined;
          });
          setSearchResultMsg(`Found ${matched.length} order(s) for ${cleanSearchPhone}`);
        } else {
          setSearchResultMsg(`No orders found matching phone number ${cleanSearchPhone}.`);
        }
      } else {
        setSearchResultMsg("Failed to search orders. Please try again.");
      }
    } catch (err) {
      setSearchResultMsg("Network error while searching orders.");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setError("Please fill out all required shipping fields.");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number (should start with 6, 7, 8, or 9).");
      return;
    }

    const cleanPincode = formData.pincode.replace(/\D/g, "");
    if (!/^[1-9]\d{5}$/.test(cleanPincode)) {
      setError("Please enter a valid 6-digit Indian pincode (should start with 1-9).");
      return;
    }

    if (!formData.city || formData.city.trim().length === 0) {
      setError("Please specify the city name.");
      return;
    }

    setLoading(true);
    const totalAmount = productInfo.price * qty;

    if (paymentMethod === "online") {
      setPaymentStep("processing");

      try {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          setError("Razorpay SDK failed to load. Please check your internet connection.");
          setLoading(false);
          setPaymentStep("form");
          return;
        }

        const orderResponse = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
          })
        });

        const orderData = await orderResponse.json();
        if (!orderResponse.ok || !orderData.success) {
          setError(orderData.error || "Failed to initialize payment gateway.");
          setLoading(false);
          setPaymentStep("form");
          return;
        }

        const razorpayKey = orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TV4R4mAfbFjqxY";

        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "PulseCare",
          description: `${qty}x ${productInfo.productName}`,
          order_id: orderData.order_id,
          prefill: {
            name: formData.name,
            contact: cleanPhone
          },
          theme: { color: "#0284c7" },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            setPaymentStep("processing");
            try {
              const verifyResponse = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const verifyData = await verifyResponse.json();
              if (verifyResponse.ok && verifyData.success) {
                const saveOrderResponse = await fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: formData.name,
                    phone: cleanPhone,
                    address: formData.address,
                    pincode: cleanPincode,
                    city: formData.city,
                    state: formData.state,
                    qty,
                    paymentMethod: "Online Payment (Razorpay)"
                  })
                });

                const saveOrderData = await saveOrderResponse.json();
                if (saveOrderResponse.ok && saveOrderData.success) {
                  const newOrd: CustomerOrder = {
                    orderId: saveOrderData.order.orderId,
                    name: formData.name,
                    phone: cleanPhone,
                    address: formData.address,
                    pincode: cleanPincode,
                    city: formData.city,
                    state: formData.state,
                    qty,
                    totalPrice: totalAmount,
                    paymentMethod: "Online Payment (Razorpay)",
                    paymentStatus: "Paid",
                    status: "Confirmed",
                    createdAt: saveOrderData.order.createdAt || new Date().toISOString()
                  };
                  saveOrderToLocalStorage(newOrd);
                  setPlacedOrderId(saveOrderData.order.orderId);
                  setPlacedPaymentMethod("Online Payment (Razorpay)");
                  setSuccess(true);
                } else {
                  setError(saveOrderData.error || "Payment succeeded but order recording failed.");
                }
              } else {
                setError(verifyData.error || "Payment signature verification failed.");
              }
            } catch (err) {
              setError("Network error during payment verification.");
            } finally {
              setLoading(false);
              setPaymentStep("form");
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setPaymentStep("form");
              setError("Payment modal closed by user.");
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on("payment.failed", function (response: any) {
          setLoading(false);
          setPaymentStep("form");
          setError(`Payment failed: ${response.error?.description || "Transaction declined"}`);
        });
        razorpayInstance.open();
      } catch (err) {
        setError("Failed to initiate Razorpay checkout.");
        setLoading(false);
        setPaymentStep("form");
      }
    } else {
      // Cash on Delivery Flow
      const selectedPaymentLabel = "Cash on Delivery (COD)";
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          const newOrd: CustomerOrder = {
            orderId: data.order.orderId,
            name: formData.name,
            phone: cleanPhone,
            address: formData.address,
            pincode: cleanPincode,
            city: formData.city,
            state: formData.state,
            qty,
            totalPrice: totalAmount,
            paymentMethod: selectedPaymentLabel,
            paymentStatus: "Pending COD",
            status: "Pending",
            createdAt: data.order.createdAt || new Date().toISOString()
          };
          saveOrderToLocalStorage(newOrd);
          setPlacedOrderId(data.order.orderId);
          setPlacedPaymentMethod(selectedPaymentLabel);
          setSuccess(true);
        } else {
          setError(data.error || "Failed to place order.");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
        setPaymentStep("form");
      }
    }
  };

  const totalPrice = productInfo.price * qty;
  const originalTotalPrice = productInfo.compareAtPrice ? productInfo.compareAtPrice * qty : 0;
  const savings = originalTotalPrice - totalPrice;

  return (
    <section className={`${styles.offerSection} section-padding`} id="order-form">
      <div className={styles.container} id="my-orders">
        <div className={styles.offerCardGrid}>
          {/* Left Side: Product Offer Details */}
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

          {/* Right Side: Order Container with Tabs */}
          <div className={styles.orderFormContainer}>
            {/* Top Tab Bar: CHECKOUT vs MY ORDERS */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-surface)",
                borderRadius: "10px",
                padding: "4px",
                border: "1px solid var(--border)",
                marginBottom: "20px",
                gap: "4px"
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab("checkout")}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "checkout" ? "var(--primary)" : "transparent",
                  color: activeTab === "checkout" ? "#ffffff" : "var(--text-muted)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <span className="material-icons" style={{ fontSize: "18px" }}>shopping_cart</span>
                <span>Checkout</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("my-orders")}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "my-orders" ? "var(--primary)" : "transparent",
                  color: activeTab === "my-orders" ? "#ffffff" : "var(--text-muted)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <span className="material-icons" style={{ fontSize: "18px" }}>inventory_2</span>
                <span>MY ORDERS</span>
                {customerOrders.length > 0 && (
                  <span
                    style={{
                      background: activeTab === "my-orders" ? "#ffffff" : "var(--primary)",
                      color: activeTab === "my-orders" ? "var(--primary)" : "#ffffff",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "2px 8px",
                      marginLeft: "4px"
                    }}
                  >
                    {customerOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: CHECKOUT / FORM */}
            {activeTab === "checkout" && (
              <>
                {success ? (
                  <div className={styles.successState} style={{ padding: "20px 0" }}>
                    <span className={`material-icons ${styles.successIcon}`}>task_alt</span>
                    <h3 className={styles.successTitle}>Order Placed Successfully!</h3>
                    <p className={styles.successText} style={{ color: "var(--primary)", fontWeight: "700", fontSize: "18px", margin: "4px 0" }}>
                      Order ID: {placedOrderId}
                    </p>
                    <div style={{ background: "white", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border)", width: "100%", textAlign: "left" }}>
                      <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>Payment Method:</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "15px", fontWeight: "700", color: "#10b981" }}>
                        ✓ {placedPaymentMethod} {placedPaymentMethod.toLowerCase().includes("online") ? "(Paid ✅)" : "(Pay at Doorstep)"}
                      </p>
                    </div>
                    <p className={styles.successText} style={{ fontSize: "15px", margin: "0" }}>
                      Thank you, <strong>{formData.name}</strong>. Your order for <strong>{qty}x {productInfo.productName}</strong> has been received.
                    </p>
                    <p className={styles.successText} style={{ fontSize: "14px", margin: "0" }}>
                      Total Amount: <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>. We will dispatch your package soon.
                    </p>

                    {/* Action Buttons: Order Again & View Orders */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "12px" }}>
                      <button
                        onClick={handlePlaceAnotherOrder}
                        className={styles.headerCTA}
                        style={{
                          width: "100%",
                          padding: "16px",
                          fontSize: "16px",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                          background: "#10b981"
                        }}
                      >
                        <span className="material-icons">add_shopping_cart</span>
                        <span>+ PLACE ANOTHER ORDER</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("my-orders")}
                        type="button"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--primary)",
                          background: "white",
                          color: "var(--primary)",
                          fontWeight: "700",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          cursor: "pointer"
                        }}
                      >
                        <span className="material-icons" style={{ fontSize: "18px" }}>receipt_long</span>
                        <span>VIEW ALL MY ORDERS ({customerOrders.length})</span>
                      </button>
                    </div>
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
                                UPI, GPay, PhonePe, Cards, NetBanking (Razorpay)
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
              </>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === "my-orders" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 className={styles.formTitle} style={{ margin: 0 }}>
                    MY ORDERS
                  </h3>
                  <button
                    onClick={handlePlaceAnotherOrder}
                    type="button"
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: "16px" }}>add</span>
                    <span>Order Again</span>
                  </button>
                </div>

                {/* Search by Mobile Number */}
                <form onSubmit={handlePhoneSearch} style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <input
                    type="tel"
                    placeholder="Search by 10-digit phone number"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className={styles.formInput}
                    style={{ flex: 1, padding: "10px 12px", fontSize: "13px" }}
                  />
                  <button
                    type="submit"
                    disabled={searching}
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      border: "none",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {searching ? "Searching..." : "Find Orders"}
                  </button>
                </form>

                {searchResultMsg && (
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, fontWeight: "600" }}>
                    {searchResultMsg}
                  </p>
                )}

                {/* Orders List */}
                {customerOrders.length === 0 ? (
                  <div
                    style={{
                      background: "white",
                      border: "1px dashed var(--border)",
                      borderRadius: "12px",
                      padding: "36px 20px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: "48px", color: "var(--text-muted)" }}>
                      shopping_bag
                    </span>
                    <h4 style={{ margin: 0, fontSize: "16px", color: "var(--text-primary)" }}>No Orders Placed Yet</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", maxWidth: "280px" }}>
                      Place your first order to track shipping, view invoice details, and manage orders.
                    </p>
                    <button
                      onClick={handlePlaceAnotherOrder}
                      type="button"
                      className={styles.headerCTA}
                      style={{ marginTop: "8px", padding: "12px 24px" }}
                    >
                      START ORDER NOW
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "460px", overflowY: "auto", paddingRight: "4px" }}>
                    {customerOrders.map((ord, idx) => (
                      <div
                        key={ord.orderId || idx}
                        style={{
                          background: "white",
                          border: "1px solid var(--border)",
                          borderRadius: "10px",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--primary)" }}>
                              {ord.orderId}
                            </span>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px" }}>
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : ""}
                            </span>
                          </div>
                          <span
                            style={{
                              background: ord.paymentStatus?.toLowerCase().includes("paid") ? "#dcfce7" : "#fef3c7",
                              color: ord.paymentStatus?.toLowerCase().includes("paid") ? "#15803d" : "#b45309",
                              fontSize: "12px",
                              fontWeight: "700",
                              padding: "4px 10px",
                              borderRadius: "12px"
                            }}
                          >
                            {ord.paymentStatus?.toLowerCase().includes("paid") ? "Paid ✅" : "COD Pending"}
                          </span>
                        </div>

                        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "8px", fontSize: "13px" }}>
                          <p style={{ margin: 0, fontWeight: "700", color: "var(--text-primary)" }}>
                            {ord.qty || 1}x {productInfo.productName}
                          </p>
                          <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "12px" }}>
                            Customer: <strong>{ord.name}</strong> ({ord.phone})
                          </p>
                          <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "12px" }}>
                            Deliver to: {ord.address}, {ord.city || ""} {ord.pincode}
                          </p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #f1f5f9", paddingTop: "8px" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            Payment: <strong>{ord.paymentMethod || "Online"}</strong>
                          </span>
                          <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)" }}>
                            ₹{(ord.totalPrice || productInfo.price * (ord.qty || 1)).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handlePlaceAnotherOrder}
                      type="button"
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "8px",
                        background: "var(--primary)",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span className="material-icons">add_shopping_cart</span>
                      <span>+ PLACE ANOTHER ORDER</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </section>
  );
}
