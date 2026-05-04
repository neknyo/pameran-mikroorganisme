import { useState, useEffect, useRef } from "react";

const TARGET_DATE = new Date("2026-06-20T08:00:00+07:00").getTime();

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "mins", label: "Minutes" },
  { key: "secs", label: "Seconds" },
];

function calcTimeLeft() {
  const distance = TARGET_DATE - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    mins: Math.floor((distance % 3600000) / 60000),
    secs: Math.floor((distance % 60000) / 1000),
  };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function DigitRoller({ value }) {
  const prev = useRef(value);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (prev.current !== value) {
      setAnimKey((k) => k + 1);
      prev.current = value;
    }
  }, [value]);

  return (
    <div style={{ position: "relative", overflow: "hidden", height: "1em", lineHeight: "1em" }}>
      <span
        key={animKey}
        style={{
          display: "block",
          animation: animKey > 0 ? "rollIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
        }}
      >
        {pad(value)}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());
  const [btnHover, setBtnHover] = useState(false);
  const [btnPress, setBtnPress] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  const done = Object.values(timeLeft).every((v) => v === 0);

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@400;500&family=Stack+Sans+Text:wght@400;500;600;700&display=swap');
        @keyframes rollIn {
          from { transform: translateY(-60%); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Stack Sans Text', bold",
          fontSize: "clamp(40px, 8vw, 80px)",
          fontWeight: 400,
          color: "#dedede",
          letterSpacing: "0.02em",
          lineHeight: 1,
          marginBottom: 40,
          textAlign: "center",
            
        }}
      >
        {done ? "We're Here" : "Coming Soon"}
      </h1>

      {/* countdown */}
      <div
        style={{
          display: "flex",
          gap: "clamp(16px, 3vw, 32px)",
          alignItems: "center",
          marginBottom: 64,
        }}
      >
        {UNITS.map(({ key, label }, i) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
           
            {/* circles */}
            <div
              style={{
                width: "clamp(80px, 12vw, 120px)",
                height: "clamp(80px, 12vw, 120px)",
                background: "#ffffff",
                borderRadius: "50%",
                boxShadow:
                  "0 2px 0 rgba(180,160,130,0.25), 0 8px 24px rgba(0,0,0,0.07), inset 0 1px 2px rgba(255,255,255,0.9)",
                border: "1px solid rgba(220,210,195,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "'Stack Sans Text'",
                  fontSize: "clamp(28px, 4.5vw, 46px)",
                  fontWeight: 500,
                  color: "#dedede",
                  letterSpacing: "-0.02em",
                }}
              >
                <DigitRoller value={timeLeft[key]} />
              </div>
            </div>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                letterSpacing: "0.3em",
                color: "#9c8c72",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* button */}
      <button
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => { setBtnHover(false); setBtnPress(false); }}
        onMouseDown={() => setBtnPress(true)}
        onMouseUp={() => setBtnPress(false)}
        onClick={() => window.open("rsvp_thing")}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: btnHover ? "#dedede" : "#dedede",
          background: btnHover
            ? "white"
            : "white",
          border: "1px solid rgba(180,160,130,0.6)",
          borderRadius: 100,
          padding: "16px 42px",
          cursor: "pointer",
          transform: btnPress ? "scale(0.97) translateY(1px)" : btnHover ? "scale(1.02) translateY(-1px)" : "scale(1)",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: btnHover
            ? "0 12px 40px rgba(60,48,40,0.22), 0 2px 8px rgba(0,0,0,0.12)"
            : "0 2px 0 rgba(180,160,130,0.3), 0 4px 16px rgba(0,0,0,0.06)",
          outline: "none",
          marginBottom: 14,
        }}
      >
        Get Your Ticket
      </button>
    </div>
  );
}