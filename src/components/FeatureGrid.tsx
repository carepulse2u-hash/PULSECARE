import styles from "../app/page.module.css";
import { productData } from "../config/product";

export default function FeatureGrid() {
  return (
    <section className={`${styles.features} section-padding`} id="features">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Advanced Features</span>
          <h2 className={styles.sectionTitle}>Everything you need for home monitoring.</h2>
          <p className={styles.sectionDesc}>
            Thoughtfully engineered with features that focus on convenience, readability, and ease of use.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {productData.features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featIconWrapper}>
                <span className={`material-icons ${styles.featIcon}`}>
                  {feature.icon}
                </span>
              </div>
              <h3 className={styles.featTitle}>{feature.title}</h3>
              <p className={styles.featDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
