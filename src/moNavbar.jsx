import React from 'react';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      backgroundColor: 'rgba(255, 255, 255, 0.85)', 
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)', //buat safari
      borderBottom: '1px solid rgba(255, 255, 255, 1)',
      boxShadow: '0 10px 30px rgba(255, 255, 255, 0.8)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <style>{`
        .nav-link {
          text-decoration: none;
          color: #999999;
          font-size: 15px;
          font-weight: 500;
          display: inline-block; /* Wajib agar transform scale berfungsi */
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
        }
        
        /* Animasi hover dipindah ke menu tengah */
        .nav-link:hover {
          color: #555555;
          transform: scale(1.1); /* Membesar sedikit */
        }
        
        .nav-link.active {
          color: #666666;
          font-weight: 700;
        }
        
        .nav-btn {
          background: linear-gradient(to right, #e4e4e4, #f5f5f5);
          border: none;
          color: #666666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Animasi hover dihilangkan dari sini */
        }
      `}</style>

      <div style={{ //logo placeholder aja
        fontSize: '28px', 
        fontWeight: '800', 
        color: '#666666', 
        letterSpacing: '-0.5px' 
      }}>
        Amorvia
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <a href="#home" className="nav-link active">Home</a>
        <a href="#wip" className="nav-link">Merchandise</a>
        <a href="#wip" className="nav-link">Get to Know us</a>
        <a href="#wip" className="nav-link">Games</a>
      </div>

      {/* Bagian Kanan: Tombol Action (Sekarang statis tanpa animasi) */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        
        {/* Tombol Login */}
        <button 
          className="nav-btn"
          style={{
            padding: '10px 24px',
            borderRadius: '24px',
            fontSize: '15px',
            fontWeight: '500'
          }}
        >
          Login
        </button>

        {/* Tombol Hamburger Menu */}
        <button 
          className="nav-btn"
          style={{
            padding: '12px',
            borderRadius: '10px',
          }}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H17M1 7H17M1 13H17" stroke="#666666" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

      </div>
    </nav>
  );
}