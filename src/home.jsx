import React from 'react';
import { useNavigate } from 'react-router-dom';
import Counter from './counter';

const Homepage = () => {
  const navigate = useNavigate();

  // kotak placeholder
  const Box = ({ children, height = '200px', width = '100%', onClick }) => (
  <div 
    onClick={onClick}
    style={{
      width: width,
      height: height,
      border: '2px dashed #999',
      backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #a0a0a0)',
      display: 'flex',
      borderRadius: '16px',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '10px',
      cursor: onClick ? 'pointer' : 'default',
      boxSizing: 'border-box'
    }}
  >
    {children}
  </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* 1. COMING SOON & COUNTER */}
      <section style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1>COMING SOON</h1>
        <div style={{ margin: '20px 0' }}>
          <Counter />
        </div>
        <button 
          onClick={() => navigate('/login')}
          style={{ padding: '10px 20px', backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #a0a0a0)', color: 'black', cursor: 'pointer' }}>
          Register Now
        </button>
      </section>

      {/* 2. LEADERBOARD & PLAY NOW (MENYAMPING) */}
      <section style={{ display: 'flex', gap: '20px', marginBottom: '50px', alignItems: 'center' }}>
        <div style={{ flex: 2 }}>
          <Box height="300px">Leaderboard</Box>
        </div>
        <div style={{ flex: 1 }}>
          <p>Pameran TPB FSRD ITB 2025 merupakan pameran akademik yang menjadi wadah bagi mahasiswa Tahap Persiapan Bersama (TPB) untuk menampilkan perjalanan, eksplorasi, serta proses kreatif                                                                  </p>
          <button 
            onClick={() => navigate('/game')}
            style={{ padding: '15px 30px', backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #a0a0a0)', color: 'black', cursor: 'pointer', width: '100%' }}
          >
            PLAY NOW
          </button>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section style={{ textAlign: 'center', marginBottom: '50px', borderTop: '1px solid #ccc', paddingTop: '30px' }}>
        <h2>About</h2>
        <p>Pameran TPB FSRD ITB 2025 merupakan pameran akademik yang menjadi wadah bagi mahasiswa Tahap Persiapan Bersama (TPB) untuk menampilkan perjalanan, eksplorasi, serta proses kreatif yang telah dilalui selama dua semester. Lebih dari sekadar ruang eksibisi, pameran ini hadir sebagai medium reflektif yang mengangkat dinamika sosial dalam angkatan—mulai dari kecenderungan individualisme, melemahnya empati, hingga belum terbentuknya rasa memiliki yang utuh.</p>
      </section>

      {/* 4. PENJELASAN 5 PRODI (MENYAMPING) */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['DKV', 'Desain Produk', 'Seni Rupa', 'Kriya', 'Desain Interior'].map((i) => (
            <div key={i} style={{ flex: 1, border: '1px solid #ccc', padding: '10px', fontSize: '12px' }}>
              <strong>{i}</strong>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRE EVENT 1 (GRID 2x2) */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ textAlign: 'center' }}>Pre Event 1</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Box height="150px">Placeholder</Box>
            <Box height="150px">Placeholder</Box>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Box height="150px">Placeholder</Box>
            <Box height="150px">Placeholder</Box>
          </div>
        </div>
      </section>

      {/* 6. RUNDOWN */}
      <section style={{ marginBottom: '50px' }}>
        <Box height="400px">Placeholder</Box>
      </section>

      {/* 7. PETA */}
      <section style={{ marginBottom: '50px', textAlign: 'center' }}>
        <Box height="400px" onClick={() => navigate('/map')}>
          Placeholder Image Peta
        </Box>
        <p style={{ fontSize: '12px', marginTop: '5px' }}>coba klik petanya</p>
      </section>

      {/* 8. FLOW PEJALAN KAKI (MENYAMPING) */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ textAlign: 'center' }}>Flow Pejalan Kaki</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Box height="200px">Placeholder</Box>
          <Box height="200px">Placeholder</Box>
        </div>
      </section>

      {/* 9. MERCHANDISE */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ textAlign: 'center' }}>Merchandise</h2>
        <Box height="300px">Placeholder</Box>
      </section>

      {/* 10. SOSMED & SPONSOR */}
      <section style={{gap: '20px', marginBottom: '50px', borderTop: '1px solid #ccc', paddingTop: '30px' }}>
        <h2 style={{ textAlign: 'center' }}>Merchandise</h2>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Box>Placeholder</Box>
          <Box>Placeholder</Box>
          <Box>Placeholder</Box>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginLeft: '140px', marginRight: '140px' }}>
          <Box>Placeholder</Box>
          <Box>Placeholder</Box>
        </div>
      </section>
      
      <section style={{gap: '20px', borderTop: '1px solid #ccc' }}>
        <h2 style={{ textAlign: 'center' }}>Sponsor</h2>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Box>Placeholder</Box>
          <Box>Placeholder</Box>
          <Box>Placeholder</Box>
          <Box>Placeholder</Box>
          <Box>Placeholder</Box>
          <Box>Placeholder</Box>
      </div>
      </section>

      {/* 11. FOOTER */}
      <h3>page is WIP</h3>
      <footer style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid #eee' }}>
        Copyright © Amorvia 2026
      </footer>

    </div>
  );
};

export default Homepage;