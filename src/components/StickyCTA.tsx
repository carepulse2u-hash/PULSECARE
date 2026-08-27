import styles from "../app/page.module.css";
import { productData } from "../config/product";

export default function StickyCTA() {
  return (
    <div className={styles.stickyCtaWrapper}>
      <div className={styles.stickyCtaPrice}>
        <span className={styles.stickyCtaPriceVal}>
          ₹{productData.price.toLocaleString("en-IN")}
        </span>
        <span className={styles.stickyCtaPriceLabel}>Special Price</span>
      </div>
      <a href="#order-form" className={styles.stickyCtaBtn}>
        BUY NOW
      </a>
    </div>
  );
}
