import { useState, useEffect, useRef } from "react";

const CIRCLES = [
  {
    id: 0,
    img: "https://cdn.discordapp.com/attachments/1492177075556323330/1499101335440588850/ASTAGFIRULLLAHHHH.png?ex=69f9812a&is=69f82faa&hm=b4d4c30e62c768b74008c6cea6996e0457cde0edb23055601469a7c6ab5394df&",
    text: "lorem ipsum dolor sit amet.",
    size: 130,
    basePos: { x: -38, y: -42 },
    floatAmp: { x: 18, y: 14 },
    floatDur: { x: 6.2, y: 5.1 },
    floatOff: { x: 0, y: 1.2 },
  },
  {
    id: 1,
    img: "https://cdn.discordapp.com/attachments/1492177075556323330/1499101335440588850/ASTAGFIRULLLAHHHH.png?ex=69f9812a&is=69f82faa&hm=b4d4c30e62c768b74008c6cea6996e0457cde0edb23055601469a7c6ab5394df&",
    text: "lorem ipsum dolor sit amet.",
    size: 110,
    basePos: { x: -44, y: 22 },
    floatAmp: { x: 14, y: 20 },
    floatDur: { x: 7.4, y: 6.3 },
    floatOff: { x: 2.1, y: 0.7 },
  },
  {
    id: 2,
    img: "https://cdn.discordapp.com/attachments/1492177075556323330/1499101335440588850/ASTAGFIRULLLAHHHH.png?ex=69f9812a&is=69f82faa&hm=b4d4c30e62c768b74008c6cea6996e0457cde0edb23055601469a7c6ab5394df&",
    text: "lorem ipsum dolor sit amet.",
    size: 95,
    basePos: { x: -20, y: 50 },
    floatAmp: { x: 16, y: 12 },
    floatDur: { x: 5.8, y: 7.1 },
    floatOff: { x: 1.5, y: 3.0 },
  },
  {
    id: 3,
    img: "https://cdn.discordapp.com/attachments/1492177075556323330/1499101335440588850/ASTAGFIRULLLAHHHH.png?ex=69f9812a&is=69f82faa&hm=b4d4c30e62c768b74008c6cea6996e0457cde0edb23055601469a7c6ab5394df&",
    text: "lorem ipsum dolor sit amet.",
    size: 118,
    basePos: { x: 38, y: -38 },
    floatAmp: { x: 12, y: 18 },
    floatDur: { x: 6.9, y: 5.5 },
    floatOff: { x: 0.8, y: 2.3 },
  },
  {
    id: 4,
    img: "https://cdn.discordapp.com/attachments/1492177075556323330/1499101335440588850/ASTAGFIRULLLAHHHH.png?ex=69f9812a&is=69f82faa&hm=b4d4c30e62c768b74008c6cea6996e0457cde0edb23055601469a7c6ab5394df&",
    text: "amorvia so good.",
    size: 100,
    basePos: { x: 44, y: 32 },
    floatAmp: { x: 20, y: 15 },
    floatDur: { x: 5.3, y: 8.0 },
    floatOff: { x: 3.4, y: 1.1 },
  },
];

function useFloatPosition(circle) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frameRef = useRef();

  useEffect(() => {
    const animate = () => {
      const t = performance.now() / 1000;
      const x =
        Math.sin(t / circle.floatDur.x + circle.floatOff.x) * circle.floatAmp.x +
        Math.cos(t / (circle.floatDur.x * 1.3) + circle.floatOff.y) * (circle.floatAmp.x * 0.4);
      const y =
        Math.cos(t / circle.floatDur.y + circle.floatOff.y) * circle.floatAmp.y +
        Math.sin(t / (circle.floatDur.y * 1.4) + circle.floatOff.x) * (circle.floatAmp.y * 0.35);
      setPos({ x, y });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return pos;
}

function FloatingCircle({ circle, flipped, onFlip }) {
  const float = useFloatPosition(circle);

  const left = `calc(50% + ${circle.basePos.x}% + ${float.x}px)`;
  const top = `calc(50% + ${circle.basePos.y}% + ${float.y}px)`;
  const [CirHover, setCirHover] = useState(false);
  const [CirPress, setCirPress] = useState(false);
  
  return (
    <div
      onClick={onFlip}
      style={{
        position: "absolute",
        left,
        top,
        width: circle.size,
        height: circle.size,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        perspective: 800,
        zIndex: 10,
      }}
    >
      <div
        onMouseEnter={() => setCirHover(true)}
        onMouseLeave={() => { setCirHover(false); setCirPress(false); }}
        onMouseDown={() => setCirPress(true)}
        onMouseUp={() => setCirPress(false)}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          // Menggabungkan efek flip dan hover scale
          transform: `${flipped ? "rotateY(180deg)" : "rotateY(0deg)"} ${CirPress ? "scale(0.95)" : CirHover ? "scale(1.08)" : "scale(1)"}`,
        }}
      >
        {/* --- FRONT: IMAGE --- */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.08)",
            background: "linear-gradient(to bottom, #f0f0f0, #a0a0a0)",
          }}
        >
          <img
            src={circle.img}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* 👇 TAMBAHKAN OVERLAY INI DI BAWAH IMG 👇 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              // Kalau di-hover (CirHover = true), jadi hitam 40%. Kalau nggak, tembus pandang.
              backgroundColor: CirHover ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
              transition: "background-color 0.4s ease",
              pointerEvents: "none", // Wajib! Biar gambar di belakangnya tetep bisa diklik
              zIndex: 1,
            }}
          />
          {/* 👆 =================================== 👆 */}

          <div
            style={{
              position: "absolute",
              bottom: 12, // Disesuaikan sedikit biar pas muncul posisinya enak dilihat
              width: "100%",
              textAlign: "center",
              fontSize: 9,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              zIndex: 2,
              
              // 👇 EFEK MUNCUL DAN PINDAH SAAT HOVER 👇
              opacity: CirHover ? 1 : 0, // 1 = Muncul, 0 = Hilang
              transform: CirHover ? "translateY(0)" : "translateY(10px)", // Gerak naik 10px
              transition: "opacity 0.4s ease, transform 0.4s ease", // Biar animasinya mulus
            }}
          >
            tap me :3
          </div>
        </div>

        {/* --- BACK: TEXT --- */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(to bottom, white, #eeeeee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: Math.max(9, circle.size * 0.085),
              lineHeight: 1.45,
              color: "black",
              textAlign: "center",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            {circle.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const [flipped, setFlipped] = useState({});

  const toggle = (id) =>
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div
      style={{
        minHeight: "98vh",
        background: 'transparent',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@400;500&family=Stack+Sans+Text:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Scene container */}
      <div
        style={{
          position: "relative",
          width: "min(860px, 95vw)",
          height: "min(800px, 70vh)",
        }}
      >
        {/* Center info card */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(480px, 50%, 340px)",
            background: "linear-gradient(to bottom, white, #eeeeee)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: 20,
            padding: "32px 28px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
            border: "1px solid rgba(220,210,195,0.6)",
            zIndex: 5,
          }}
        >
        {/* Garis Title */}
        <div 
          style={{
            display: "flex",
            alignItems: "center", 
            gap: "16px", 
            marginBottom: "18px", 
          }}
        >
          <div
            style={{
              width: 4,
              height: 32,
              background: "#dedede",
              borderRadius: 2,
            }}
          ></div>

          <h2
            style={{
              fontFamily: "'Stack Sans Text', serif",
              fontSize: 26,
              fontWeight: 500,
              color: "#dedede",
              margin: 0,
              textAlign: "left",
              lineHeight: 1.15,
            }}
          >
            Amorvia so good
          </h2>
        </div>
          
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.75,
              color: "#5a524a",
              margin: "0 0 14px",
              fontWeight: 300,
              textAlign: "justify",
            }}
          >
            Pameran TPB FSRD ITB 2025 merupakan pameran akademik yang menjadi wadah bagi mahasiswa Tahap Persiapan Bersama (TPB) untuk menampilkan perjalanan, eksplorasi, serta proses kreatif yang telah dilalui selama dua semester.
          </p>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.75,
              color: "#5a524a",
              margin: 0,
              fontWeight: 300,
              textAlign: "justify",
            }}
          >
            Lebih dari sekadar ruang eksibisi, pameran ini hadir sebagai medium reflektif yang mengangkat dinamika sosial dalam angkatan—mulai dari kecenderungan individualisme, melemahnya empati, hingga belum terbentuknya rasa memiliki yang utuh.
          </p>
        </div>

        {/* Floating circles */}
        {CIRCLES.map((c) => (
          <FloatingCircle
            key={c.id}
            circle={c}
            flipped={!!flipped[c.id]}
            onFlip={() => toggle(c.id)}
          />
        ))}
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "clamp(16px, 4vh, 40px)",
          left: 0, right: 0,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Stack Sans Text', serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 400,
            color: "#dedede",
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          About
        </h1>
      </div>
    </div>
  );
}