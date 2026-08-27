"use client";

import { useEffect, useState } from "react";
import styles from "../app/page.module.css";

type SimStep = "wear" | "press" | "measure" | "result";

export default function ProductDemo() {
  const [activeStep, setActiveStep] = useState<SimStep>("wear");
  const [systolic, setSystolic] = useState(0);
  const [diastolic, setDiastolic] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [inflating, setInflating] = useState(false);
  const [simText, setSimText] = useState("Ready");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStep === "press") {
      setInflating(true);
      setSimText("Inflating...");
      let currentPressure = 0;
      interval = setInterval(() => {
        currentPressure += 25;
        if (currentPressure >= 160) {
          clearInterval(interval);
          setActiveStep("measure");
        } else {
          setSystolic(currentPressure);
        }
      }, 300);
    } else if (activeStep === "measure") {
      setInflating(false);
      setSimText("Measuring...");
      let currentPressure = 160;
      interval = setInterval(() => {
        currentPressure -= 15;
        if (currentPressure <= 110) {
          clearInterval(interval);
          setSystolic(118);
          setDiastolic(78);
          setPulse(72);
          setActiveStep("result");
        } else {
          setSystolic(currentPressure);
        }
      }, 400);
    } else if (activeStep === "result") {
      setSimText("Result");
    } else if (activeStep === "wear") {
      setSimText("Ready");
      setSystolic(0);
      setDiastolic(0);
      setPulse(0);
    }
    return () => clearInterval(interval);
  }, [activeStep]);

  const handleStepClick = (step: SimStep) => {
    setActiveStep(step);
  };

  return (
    <section className={`${styles.demoSection} section-padding`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Interactive Demo</span>
          <h2 className={styles.sectionTitle}>See how it works in real-time.</h2>
          <p className={styles.sectionDesc}>
            Experience the automated measurement process. Click the steps below to simulate a measurement.
          </p>
        </div>

        <div className={styles.demoContainer}>
          <div className={styles.demoStepper}>
            <button
              onClick={() => handleStepClick("wear")}
              className={`${styles.stepButton} ${activeStep === "wear" ? styles.stepButtonActive : ""}`}
            >
              1. Wear
            </button>
            <button
              onClick={() => handleStepClick("press")}
              className={`${styles.stepButton} ${activeStep === "press" ? styles.stepButtonActive : ""}`}
            >
              2. Press
            </button>
            <button
              onClick={() => handleStepClick("measure")}
              className={`${styles.stepButton} ${activeStep === "measure" ? styles.stepButtonActive : ""}`}
            >
              3. Measure
            </button>
            <button
              onClick={() => handleStepClick("result")}
              className={`${styles.stepButton} ${activeStep === "result" ? styles.stepButtonActive : ""}`}
            >
              4. Result
            </button>
          </div>

          <div className={styles.demoDisplay}>
            <div className={styles.demoVisual}>
              {activeStep === "wear" && (
                <>
                  <span className={`material-icons ${styles.demoIconLarge}`}>back_hand</span>
                  <div className={styles.deviceScreenSim}>
                    <div className={styles.screenLabel}>Status</div>
                    <div className={styles.screenVal}>READY</div>
                    <div className={styles.screenSubVal}>Cuff wrapped</div>
                  </div>
                  <p className={styles.demoActionDesc}>Place the monitor securely on your wrist</p>
                  <p className={styles.demoDetails}>
                    Wrap the adjustable strap snugly around your left wrist, about 1-2 cm below your palm, with the screen facing up. Keep your hand relaxed.
                  </p>
                </>
              )}

              {activeStep === "press" && (
                <>
                  <span className={`material-icons ${styles.demoIconLarge} ${styles.animatePulseRing}`}>touch_app</span>
                  <div className={styles.deviceScreenSim}>
                    <div className={styles.screenLabel}>Pressure (mmHg)</div>
                    <div className={styles.screenVal}>{systolic}</div>
                    <div className={styles.screenSubVal}>Inflating...</div>
                  </div>
                  <p className={styles.demoActionDesc}>Press the START button</p>
                  <p className={styles.demoDetails}>
                    With a single press, the device starts inflating the wrist cuff automatically. You will feel a gentle pressure as it begins.
                  </p>
                </>
              )}

              {activeStep === "measure" && (
                <>
                  <span className={`material-icons ${styles.demoIconLarge}`}>favorite</span>
                  <div className={styles.deviceScreenSim}>
                    <div className={styles.screenLabel}>Systolic (mmHg)</div>
                    <div className={styles.screenVal}>{systolic}</div>
                    <div className={styles.screenSubVal}>Analyzing pulse...</div>
                  </div>
                  <p className={styles.demoActionDesc}>Remain still and quiet</p>
                  <p className={styles.demoDetails}>
                    Keep your wrist at heart level. Do not speak or move your hand. The intelligent sensor detects small pressure variations to measure your BP.
                  </p>
                </>
              )}

              {activeStep === "result" && (
                <>
                  <span className={`material-icons ${styles.demoIconLarge}`} style={{ color: "#10b981" }}>volume_up</span>
                  <div className={styles.deviceScreenSim} style={{ borderColor: "#10b981", color: "#34d399" }}>
                    <div className={styles.screenLabel}>SYS / DIA / PUL</div>
                    <div className={styles.screenVal} style={{ fontSize: "28px" }}>
                      118 / 78
                    </div>
                    <div className={styles.screenSubVal}>PULSE: 72 bpm</div>
                  </div>
                  <p className={styles.demoActionDesc}>Read results & hear voice announcement</p>
                  <p className={styles.demoDetails}>
                    The final reading is clearly shown on the high-contrast LED. The voice guidance reads out: "Your blood pressure is 118 over 78, heart rate is 72 beats per minute. Your measurement is normal."
                  </p>
                </>
              )}
            </div>

            {activeStep === "wear" && (
              <button onClick={() => setActiveStep("press")} className={styles.headerCTA} style={{ padding: "12px 36px" }}>
                Start Measurement Simulation
              </button>
            )}

            {activeStep === "result" && (
              <button onClick={() => setActiveStep("wear")} className={styles.headerCTA} style={{ padding: "12px 36px", background: "var(--accent)" }}>
                Reset Simulation
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
