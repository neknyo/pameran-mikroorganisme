import React from 'react';

// Import semua modul komponen (pastikan path './' sesuai dengan struktur foldermu)
import Navbar from './moNavbar';
import Counter from './moCounter';
import About from './moAbout';
import Game from './moGame';
import Prodi from './moProdi';
import Footer from './moFooter';
import Preevent from './moPreevent';

export default function Home() {
  return (
    
    <div style={{ position: 'relative', minHeight: '100vh' }}>
     <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      <Navbar />
      <main>
        <Counter />
        <Game />
        <About />
        <Prodi />
        <Preevent />
      </main>
      <Footer />

      {/* FAB */}
      <button 
        onClick={() => {
          // mute thing
        }}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#333333',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          zIndex: 9999,
        }}
      >
        tonbol
      </button>
      
    </div>
  );
}