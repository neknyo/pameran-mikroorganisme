import { useState, useEffect, useRef } from "react";

const INITIAL_SCORES = [
  //cuma placeholder aja, nanti pindahin top 5 dari supabase
  { id: 1, name: "Musganteng_", score: 13323, avatar: "M" },
  { id: 2, name: "Andindindun", score: 12002, avatar: "A" },
  { id: 3, name: "Eyen Yeager", score: 10823, avatar: "E" },
  { id: 4, name: "Vavalele_", score: 8342, avatar: "V" },
  { id: 5, name: "Hira.hito", score: 4006, avatar: "H" },
];

const RANK_COLORS = [
  { bg: "linear-gradient(135deg,#f5c842,#e8a000)", text: "#7a5000", glow: "rgba(245,200,66,0.4)" },
  { bg: "linear-gradient(135deg,#d4d4d4,#a0a0a0)", text: "#3a3a3a", glow: "rgba(180,180,180,0.35)" },
  { bg: "linear-gradient(135deg,#d4915a,#a05530)", text: "#5a2a00", glow: "rgba(180,120,70,0.35)" },
  { bg: "linear-gradient(135deg,#6c8cbf,#3a5a9a)", text: "#e8f0ff", glow: "rgba(80,120,200,0.25)" },
  { bg: "linear-gradient(135deg,#7fbd8e,#3d8a52)", text: "#e8fff0", glow: "rgba(80,180,100,0.25)" },
];

// Animated gear SVG
function Gear({ size = 80, x = 0, y = 0, speed = 8, reverse = false, opacity = 0.18, color = "#1a1a2e" }) {
  const r = size / 2;
  const inner = r * 0.38;
  const hole = r * 0.16;
  const teeth = 10;
  const toothH = r * 0.22;
  const toothW = (2 * Math.PI * r) / (teeth * 2.4);

  const points = [];
  for (let i = 0; i < teeth; i++) {
    const angle1 = (i / teeth) * 2 * Math.PI - Math.PI / teeth / 2;
    const angle2 = (i / teeth) * 2 * Math.PI + Math.PI / teeth / 2;
    const angle3 = (i / teeth) * 2 * Math.PI + Math.PI / teeth * 0.8;
    const angle4 = ((i + 1) / teeth) * 2 * Math.PI - Math.PI / teeth * 0.8;
    points.push(`${(r + inner + Math.cos(angle1) * 0) * 0},${0}`);
    const ox1 = Math.cos(angle1) * r, oy1 = Math.sin(angle1) * r;
    const ox2 = Math.cos(angle2) * r, oy2 = Math.sin(angle2) * r;
    const ix1 = Math.cos(angle1) * (r + toothH), iy1 = Math.sin(angle1) * (r + toothH);
    const ix2 = Math.cos(angle2) * (r + toothH), iy2 = Math.sin(angle2) * (r + toothH);
    const nx3 = Math.cos(angle3) * r, ny3 = Math.sin(angle3) * r;
    const nx4 = Math.cos(angle4) * r, ny4 = Math.sin(angle4) * r;
    if (i === 0) points.push(`M ${ox1},${oy1}`);
    else points.push(`L ${ox1},${oy1}`);
    points.push(`L ${ix1},${iy1} L ${ix2},${iy2} L ${ox2},${oy2} L ${nx3},${ny3} L ${nx4},${ny4}`);
  }

  const animId = `gear-anim-${Math.random().toString(36).slice(2)}`;

  return (
    <svg
      width={size * 2 + toothH * 2}
      height={size * 2 + toothH * 2}
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        pointerEvents: "none",
        overflow: "visible",
      }}
      viewBox={`${-r - toothH} ${-r - toothH} ${(r + toothH) * 2} ${(r + toothH) * 2}`}
    >
      <defs>
        <style>{`
          @keyframes ${animId} {
            from { transform: rotate(0deg); }
            to { transform: rotate(${reverse ? "-" : ""}360deg); }
          }
        `}</style>
      </defs>
      <g style={{ animation: `${animId} ${speed}s linear infinite`, transformOrigin: "0 0" }}>
        {/* Body */}
        <circle cx={0} cy={0} r={r} fill={color} />
        {/* Teeth */}
        {Array.from({ length: teeth }).map((_, i) => {
          const a1 = (i / teeth) * 2 * Math.PI - (Math.PI / teeth) * 0.5;
          const a2 = (i / teeth) * 2 * Math.PI + (Math.PI / teeth) * 0.5;
          const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
          const x2 = Math.cos(a1) * (r + toothH), y2 = Math.sin(a1) * (r + toothH);
          const x3 = Math.cos(a2) * (r + toothH), y3 = Math.sin(a2) * (r + toothH);
          const x4 = Math.cos(a2) * r, y4 = Math.sin(a2) * r;
          return <polygon key={i} points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`} fill={color} />;
        })}
        {/* Inner ring */}
        <circle cx={0} cy={0} r={inner} fill="rgba(255,255,255,0.12)" />
        {/* Center hole */}
        <circle cx={0} cy={0} r={hole} fill="rgba(255,255,255,0.5)" />
        {/* Bolts */}
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * 2 * Math.PI;
          return (
            <circle
              key={i}
              cx={Math.cos(a) * inner * 0.6}
              cy={Math.sin(a) * inner * 0.6}
              r={hole * 0.55}
              fill="rgba(255,255,255,0.45)"
            />
          );
        })}
      </g>
    </svg>
  );
}

function AnimatedScore({ target }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    const dur = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(Math.round(ease * target));
      if (prog < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target]);
  return <span>{val.toLocaleString()}</span>;
}

export default function GameSection() {
  const [hoverBtn, setHoverBtn] = useState(false);
  const [scores] = useState(INITIAL_SCORES);
  const [btnHover, setBtnHover] = useState(false);
  const [btnPress, setBtnPress] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Syne', 'Helvetica Neue', sans-serif",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@400;500&family=Stack+Sans+Text:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px #fffff, 0 0 60px #ffffff; }
          50% { box-shadow: 0 0 30px #dedede, 0 0 80px #dedede; }
        }
      `}</style>

      <div style={{
        display: "flex",
        gap: "clamp(24px, 4vw, 56px)",
        alignItems: "center",
        maxWidth: 1000,
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
      }}>

        {/* ── LEADERBOARD CARD ── */}
        <div
          style={{
            background: "white",
            borderRadius: 28,
            border: "1px solid #dedede",
            width: "clamp(300px, 44vw, 420px)",
            padding: "28px 24px 28px",
            position: "relative",
            overflow: "hidden",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        >
          {/* Gear decorations */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 28, pointerEvents: "none" }}>
            <Gear size={72} x={-30} y={-20} speed={14} color="#dedede" opacity={0.13} />
            <Gear size={50} x={10} y={60} speed={10} reverse color="#dededf" opacity={0.1} />
            <Gear size={85} x={-15} y={130} speed={18} color="#dedeff" opacity={0.09} />
          </div>

          {/* Header */}
          <div style={{ marginBottom: 22, paddingLeft: 4 }}>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: "#dedede", letterSpacing: "-0.02em" }}>
              Leaderboard
            </h2>
          </div>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scores.map((player, i) => {
              const rc = RANK_COLORS[i];
              return (
                <div
                  key={player.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "#dedede",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 40,
                    padding: "10px 14px",
                    animation: `fadeSlideUp 0.4s ease both`,
                    animationDelay: `${i * 0.08}s`,
                    transition: "background 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "gray"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#dedede"}
                >
                  {/* Rank badge */}
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'transparent',
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'white', fontFamily: "'Space Mono', monospace" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Name */}
                  <span style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "white",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                  }}>
                    {player.name}
                  </span>

                  {/* Score */}
                  <span style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "'Space Mono', monospace",
                    color: "white",
                    letterSpacing: "-0.02em",
                  }}>
                    <AnimatedScore target={player.score} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* kanan */}
        <div style={{ maxWidth: 380, animation: "fadeSlideUp 0.5s ease 0.2s both" }}>

          <h1 style={{
            fontSize: "clamp(40px, 7vw, 68px)",
            fontWeight: 800,
            color: "#dedede",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 20,
          }}>
            Games
          </h1>

          <p style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: "#94a3b8",
            marginBottom: 36,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 400,
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis...
          </p>

          {/* CTA Button */}
          <button
              onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => { setBtnHover(false); setBtnPress(false); }}
            onMouseDown={() => setBtnPress(true)}
            onMouseUp={() => setBtnPress(false)}
            onClick={() => window.open("game")}
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
        Play Now!
      </button>
        </div>
      </div>
    </div>
  );
}