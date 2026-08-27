"use client";

import { useEffect, useState, useRef } from "react";

export interface CountdownDuration {
  days: number;
  hours: number;
  minutes: number;
}

interface CountdownTimerProps {
  duration?: CountdownDuration;
  startedAt?: number;
  serverTime?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_DURATION: CountdownDuration = { days: 2, hours: 5, minutes: 45 };

export default function CountdownTimer({
  duration = DEFAULT_DURATION,
  startedAt,
  serverTime,
  className,
  style,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  }>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Store the server-to-client clock offset so ticks stay drift-free.
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    // Total cycle duration in milliseconds.
    const totalMs =
      (duration.days * 24 * 60 * 60 +
        duration.hours * 60 * 60 +
        duration.minutes * 60) *
      1000;

    // Compute the offset between server clock and client clock once on mount.
    // offset = serverTime - clientTimeAtMount  →  serverNow ≈ Date.now() + offset
    if (startedAt !== undefined && serverTime !== undefined) {
      offsetRef.current = serverTime - Date.now();
    } else {
      offsetRef.current = 0;
    }

    // Use the actual startedAt or fall back to "now" on the server clock.
    const origin = startedAt ?? (Date.now() + offsetRef.current);

    const updateTimer = () => {
      if (totalMs <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      // Current server time approximated via client clock + offset.
      const serverNow = Date.now() + offsetRef.current;

      // Total elapsed milliseconds since the very first cycle started.
      const elapsed = serverNow - origin;

      // Position within the current repeating cycle (modulo).
      // If elapsed < 0 (client clock ahead of server), clamp to 0.
      const cyclePosition = elapsed >= 0 ? elapsed % totalMs : 0;

      // Remaining time in the current cycle.
      let remaining = totalMs - cyclePosition;

      // Guard against displaying negative or zero-flicker values.
      if (remaining <= 0) remaining = totalMs;

      const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [duration.days, duration.hours, duration.minutes, startedAt, serverTime]);

  const hasDays = parseInt(timeLeft.days) > 0;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
        border: "1.5px solid #fda4af",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13.5px",
        fontWeight: "700",
        color: "#be123c",
        boxShadow: "0 2px 6px rgba(225, 29, 72, 0.08)",
        margin: "8px 0",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span className="material-icons" style={{ fontSize: "18px", color: "#e11d48" }}>
          local_fire_department
        </span>
        <span>Offer ends in:</span>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontFamily: "monospace, sans-serif",
          fontSize: "14px",
          fontWeight: "800",
          background: "#e11d48",
          color: "white",
          padding: "3px 8px",
          borderRadius: "6px",
          letterSpacing: "0.5px",
        }}
      >
        {hasDays && (
          <>
            <span>{timeLeft.days}d</span>
            <span>:</span>
          </>
        )}
        <span>{timeLeft.hours}h</span>
        <span>:</span>
        <span>{timeLeft.minutes}m</span>
        <span>:</span>
        <span>{timeLeft.seconds}s</span>
      </div>
    </div>
  );
}
