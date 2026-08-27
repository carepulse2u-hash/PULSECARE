"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!password.trim()) {
      setError("Please enter the administrator password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const from = searchParams.get("from") || "/admin";
        router.push(from);
        router.refresh();
      } else {
        setError(data.error || "Authentication failed. Incorrect password.");
      }
    } catch (err) {
      setError("Could not connect to the authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.logoGroup}>
        <div className={styles.logoIcon}>
          <span className="material-icons">favorite</span>
        </div>
        <span className={styles.brandName}>PulseCare</span>
      </div>

      <h2 className={styles.title}>Welcome Back</h2>
      <p className={styles.subtitle}>Enter the administrator password to access orders and manage site settings.</p>

      {error && (
        <div className={styles.errorAlert}>
          <span className="material-icons" style={{ fontSize: "18px" }}>error_outline</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">Admin Password</label>
          <div className={styles.inputWrapper}>
            <span className={`material-icons ${styles.inputIcon}`}>lock</span>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              autoFocus
            />
          </div>
        </div>

        <button type="submit" className={styles.btnSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className={`material-icons ${styles.animateSpin}`}>sync</span>
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span className="material-icons">login</span>
              <span>Sign In to Dashboard</span>
            </>
          )}
        </button>
      </form>

      <div className={styles.footer}>
        <span>Not an admin? </span>
        <Link href="/" className={styles.footerLink}>
          Return to Store
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.loginWrapper}>
      <Suspense fallback={
        <div className={styles.loginCard}>
          <span className="material-icons animate-spin" style={{ fontSize: "32px", color: "#0284c7" }}>sync</span>
          <p style={{ marginTop: "12px", color: "#64748b" }}>Loading Login Screen...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
