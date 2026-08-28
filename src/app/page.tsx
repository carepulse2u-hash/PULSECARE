import styles from "./page.module.css";
import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import ProblemSolution from "../components/ProblemSolution";
import FeatureGrid from "../components/FeatureGrid";
import HowItWorks from "../components/HowItWorks";
import ProductDemo from "../components/ProductDemo";
import WhatsInTheBox from "../components/WhatsInTheBox";
import ProductBenefits from "../components/ProductBenefits";
import OfferSection from "../components/OfferSection";
import Reviews from "../components/Reviews";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import StickyCTA from "../components/StickyCTA";

export default function Home() {
  return (
    <div className={styles.appWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <span className={`material-icons ${styles.logoIcon}`}>favorite</span>
            <span>PulseCare</span>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <a href="#my-orders" className={styles.headerSecondaryCTA}>
              MY ORDERS
            </a>
            <a href="#order-form" className={styles.headerCTA}>
              ORDER NOW
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Hero />
        <TrustStrip />
        <ProblemSolution />
        <FeatureGrid />
        <HowItWorks />
        <ProductDemo />
        <WhatsInTheBox />
        <ProductBenefits />
        <OfferSection />
        <Reviews />
        <FAQ />
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Buy Now */}
      <StickyCTA />
    </div>
  );
}
