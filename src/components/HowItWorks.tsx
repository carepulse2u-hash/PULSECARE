import styles from "../app/page.module.css";

const steps = [
  {
    num: "01",
    title: "Wrap",
    desc: "Wrap the cuff securely around your left wrist, about 1-2 cm below your palm, with the display facing you."
  },
  {
    num: "02",
    title: "Press",
    desc: "Sit comfortably, raise your wrist to heart level, and press the Start button."
  },
  {
    num: "03",
    title: "Measure",
    desc: "Remain still and quiet while the monitor inflates automatically and registers your readings."
  },
  {
    num: "04",
    title: "Read",
    desc: "View your blood pressure and heart rate on the bright LED screen, or listen to the optional voice output."
  }
];

export default function HowItWorks() {
  return (
    <section className={`${styles.howItWorks} section-padding`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Simple Process</span>
          <h2 className={styles.sectionTitle}>Get your readings in 4 steps.</h2>
          <p className={styles.sectionDesc}>
            Checking your blood pressure at home shouldn't be complicated. The PulseCare workflow is designed for quick checks.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.stepCard}>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
          <p className={styles.noteText}>
            * Note: For clinical decisions or diagnostic purposes, always follow the advice of a doctor. Ensure you read the supplied product manual for correct body posture and measurement technique.
          </p>
        </div>
      </div>
    </section>
  );
}
