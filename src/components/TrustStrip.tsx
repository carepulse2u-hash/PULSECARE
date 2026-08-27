import styles from "../app/page.module.css";

export default function TrustStrip() {
  return (
    <section className={styles.trustStrip}>
      <div className={`${styles.container} ${styles.trustContainer}`}>
        <div className={styles.trustItem}>
          <span className={`material-icons ${styles.trustIcon}`}>security</span>
          <span>100% Secure Checkout</span>
        </div>
        <div className={styles.trustItem}>
          <span className={`material-icons ${styles.trustIcon}`}>local_shipping</span>
          <span>Free Pan-India Delivery</span>
        </div>
        <div className={styles.trustItem}>
          <span className={`material-icons ${styles.trustIcon}`}>payments</span>
          <span>Cash on Delivery</span>
        </div>
        <div className={styles.trustItem}>
          <span className={`material-icons ${styles.trustIcon}`}>cached</span>
          <span>Easy Replacements</span>
        </div>
        <div className={styles.trustItem}>
          <span className={`material-icons ${styles.trustIcon}`}>support_agent</span>
          <span>Dedicated Support</span>
        </div>
      </div>
    </section>
  );
}
