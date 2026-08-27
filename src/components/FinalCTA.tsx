import styles from "../app/page.module.css";
import { productData } from "../config/product";

export default function FinalCTA() {
  return (
    <section className={`${styles.finalCta} section-padding`}>
      <div className={`${styles.container} ${styles.finalCtaContainer}`}>
        <h2 className={styles.finalCtaTitle}>
          Make BP monitoring part of your routine.
        </h2>
        <p className={styles.finalCtaPrice}>
          ₹{productData.price.toLocaleString("en-IN")}
        </p>
        <p className={styles.finalCtaReassurance}>
          Free Delivery &bull; Cash on Delivery Available
        </p>
        <a href="#order-form" className={styles.finalCtaBtn}>
          GET YOURS NOW
        </a>
      </div>
    </section>
  );
}
