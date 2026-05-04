import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const IMAGES = [
  {
    id: 0,
    src: "https://cdn.discordapp.com/attachments/1492177075556323330/1499096111502065746/images.png?ex=69f97c4c&is=69f82acc&hm=1b723cbce58e007ce111a23d2f13369f11a4daa608d179d2e600a692f3176a05&",
    label: "Seni Rupa",
    sub: "lorem ipsum",
  },
  {
    id: 1,
    src: "https://cdn.discordapp.com/attachments/1492177075556323330/1499100699781369977/a.webp?ex=69f98092&is=69f82f12&hm=336e2d7d4ff56e36d8aa2648814c78d939adcd6109f4e5836e5511a7e9ece328&",
    label: "Desain Komunikasi Visual",
    sub: "lorem ipsum",
  },
  {
    id: 2,
    src: "https://cdn.discordapp.com/attachments/1492177075556323330/1499100792895045744/catto.jpg?ex=69f980a8&is=69f82f28&hm=3736f47775ac419428885f46803455833c4cb40b07838fe81e8b63f2ad528185&",
    label: "Desain Produk",
    sub: "lorem ipsum",
  },
  {
    id: 3,
    src: "https://cdn.discordapp.com/attachments/1492177075556323330/1499100858938556577/G0bUZw0W0AACV0g.jpeg?ex=69f980b8&is=69f82f38&hm=803932730369953dd29dbb799da98ae980010255825fe12d36c9bc4b75c8d6ee&",
    label: "Kriya",
    sub: "lorem ipsum",
  },
  {
    id: 4,
    src: "https://cdn.discordapp.com/attachments/1492177075556323330/1499100934813388870/alr_bro_that_was_not.jpg?ex=69f980ca&is=69f82f4a&hm=563479103452cf5a4149e96de383119308f2201003ab7e7d77141253882d9dad&",
    label: "Desain Interior",
    sub: "lorem ipsum",
  },
];

const CARD_W = 220;
const CARD_H = 300;
const N = IMAGES.length;
const RADIUS = 350;
const ANGLE_STEP = (2 * Math.PI) / N;

function getCardTransform(index, rotation) {
  const angle = rotation + index * ANGLE_STEP;
  const x = Math.sin(angle) * RADIUS;
  const z = Math.cos(angle) * RADIUS;
  const rotY = -angle * (180 / Math.PI);

  const normalizedZ = (z + RADIUS) / (2 * RADIUS);
  const scale = 0.72 + normalizedZ * 0.28;
  const opacity = 0.3 + normalizedZ * 0.7;
  const zIndex = Math.round(normalizedZ * 100);

  return { x, z, rotY, scale, opacity, zIndex };
}

export default function Carousel() {
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const dragStartX = useRef(null);
  const dragStartRot = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(null);
  const lastTRef = useRef(null);
  const rafRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const syncActiveIdx = useCallback((rot) => {
    const normalized = ((rot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const closest = Math.round(normalized / ANGLE_STEP) % N;
    setActiveIdx(closest === 0 ? 0 : N - closest);
  }, []);

  const applyInertia = useCallback(() => {
    const decay = 0.94;
    const step = () => {
      velocityRef.current *= decay;
      if (Math.abs(velocityRef.current) < 0.0005) {
        velocityRef.current = 0;
        return;
      }
      rotationRef.current += velocityRef.current;
      setRotation(rotationRef.current);
      syncActiveIdx(rotationRef.current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [syncActiveIdx]);

  const onPointerDown = useCallback((e) => {
    cancelAnimationFrame(rafRef.current);
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRot.current = rotationRef.current;
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    velocityRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    const now = performance.now();
    const dt = now - lastTRef.current;
    const dxLast = e.clientX - lastXRef.current;
    if (dt > 0) velocityRef.current = -(dxLast / dt) * 0.016;
    lastXRef.current = e.clientX;
    lastTRef.current = now;
    rotationRef.current = dragStartRot.current + dx * 0.005;
    setRotation(rotationRef.current);
    syncActiveIdx(rotationRef.current);
  }, [syncActiveIdx]);

  const onPointerUp = useCallback(() => {
    if (dragStartX.current === null) return;
    dragStartX.current = null;
    setIsDragging(false);
    applyInertia();
  }, [applyInertia]);

  const goTo = useCallback((idx) => {
    cancelAnimationFrame(rafRef.current);
    const targetRot = -idx * ANGLE_STEP;
    const diff = targetRot - rotationRef.current;
    const steps = 30;
    let i = 0;
    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const tick = () => {
      i++;
      const t = ease(i / steps);
      rotationRef.current = rotationRef.current + diff * (1 / steps);
      if (i < steps) {
        setRotation(rotationRef.current);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rotationRef.current = targetRot;
        setRotation(targetRot);
        syncActiveIdx(targetRot);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    setActiveIdx(idx);
  }, [syncActiveIdx]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const cards = IMAGES.map((img, i) => getCardTransform(i, rotation));

  return (
      <div
      style={{
        minHeight: "90vh",
        background: 'transparent',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", 
        paddingBottom: "20vh",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        userSelect: "none",
      }}
      >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@400;500&family=Stack+Sans+Text:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        img { pointer-events: none; }
      `}</style>

      <div style={{ marginBottom: 48, textAlign: "center", zIndex: 10 }}>
        <h1 style={{
          fontFamily: "'Stack Sans Text', serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 400,
          color: "#dedede",
          marginBottom: 60,
          lineHeight: 1.1,
        }}>
          Program Studi
        </h1>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: CARD_H + 80,
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transformStyle: "preserve-3d",
          }}
        >
          {IMAGES.map((img, i) => {
            const { x, z, rotY, scale, opacity, zIndex } = cards[i];
            const isActive = i === activeIdx;

            return (
              <div
                key={img.id}
                onClick={() => !isDragging && goTo(i)}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  left: -CARD_W / 2,
                  top: -CARD_H / 2,
                  transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  cursor: isActive ? "default" : "pointer",
                  willChange: "transform, opacity",
                  transition: "opacity 0.1s",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: isActive
                    ? "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)"
                    : "0 10px 40px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: isActive ? "brightness(1)" : "brightness(0.6)",
                    transition: "filter 0.3s",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isActive
                      ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                    transition: "background 0.3s",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: 20,
                    right: 20,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.4s, transform 0.4s",
                  }}
                >
                  <p style={{
                    fontFamily: "'Stack Sans Text', serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: "#f5f2ed",
                    margin: "0 0 4px",
                    lineHeight: 1.2,
                  }}>
                    {img.label}
                  </p>
                  <p style={{
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.5)",
                    margin: 0,
                    textTransform: "uppercase",
                  }}>
                    {img.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 40, zIndex: 10 }}>
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIdx ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === activeIdx ? "#f0ede8" : "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              transition: "width 0.3s, background 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>

      <p style={{
        marginTop: 20,
        fontSize: 12,
        letterSpacing: "0.15em",
        color: "rgba(255,255,255,0.2)",
        textTransform: "uppercase",
      }}>
        {IMAGES[activeIdx].label}
      </p>
    </div>
  );
}