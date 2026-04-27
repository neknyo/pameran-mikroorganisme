import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom"; // <-- Jangan lupa import ini
import './index.css';

export default function RegPanel() {
  const navigate = useNavigate(); // Deklarasi cukup di sini aja

  // Biasakan inisialisasi semua state yang mau dipakai biar gak error
  const [formData, setFormData] = useState({ 
    email: "", 
    name: "",
    password: "",
    umur: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').insert([
      {
        name: formData.name, 
        email: formData.email,
        password: formData.password,
        // birthdate: formData.birthdate, // Di form gak ada input birthdate, jadi sementara aman tanpa ini
        umur: formData.umur
      }
    ]);
    
    if (error) {
      alert(error.message);
    } else {
      alert("Data Berhasil Masuk!");
      // Opsional: Kalau sukses login, bisa di-arahin otomatis ke halaman lain, misal:
      // navigate('/game');
    }
  };

  return (
    // Wadah paling luar, dibikin nengahin konten
    <div style={{ padding: '50px 0', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Wadah pembungkus selebar 350px biar tombol dan form sejajar rapi */}
      <div style={{ width: '350px' }}>
        
        {/* Tombol Kecil di atas Form */}
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px', // Ukuran font dikecilin
            marginBottom: '10px', // Kasih jarak ke bawah (ke arah form)
            backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #a0a0a0)', 
            color: 'black', 
            cursor: 'pointer',
            border: '1px solid #999',
            borderRadius: '4px'
          }}
        >
          ← Home
        </button>

        {/* Kotak Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          padding: '30px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #a0a0a0)',
        }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>Register</h2>
          
          <input type="text" placeholder="Nama" onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}/>
          <input type="number" placeholder="Umur" onChange={e => setFormData({...formData, umur: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <button style={{color:'black'}}>google</button>
            <button style={{color:'black'}}>X</button>
          </div>          
          <button type="submit" style={{ padding: '10px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', marginTop: '10px' }}>
            Submit
          </button>
        </form>
        <h3>page is WIP</h3>
      </div>
    </div>
  );
}