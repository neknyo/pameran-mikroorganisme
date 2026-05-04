import React from "react";

export default function GameTitle() {
  return (
    <div
      style={{
        minHeight: "40vh",
        background: "white",
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

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "clamp(16px, 4vh, 40px)",
          left: 0, 
          right: 0,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Stack Sans Text', serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 400,
            color: "#dedede", // Catatan: warna #dedede (abu muda) di atas background putih mungkin kurang kelihatan
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          Pre Event
        </h1>
      </div>
    </div>
  );
}