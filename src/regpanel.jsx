import { useState } from "react";
import { supabase } from "./supabaseClient";
import './index.css';
export default function RegPanel() {
  const [formData, setFormData] = useState({ email: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').insert([
      {name: formData.name, 
       email: formData.email,
       password: formData.password,
       birthdate: formData.birthdate,
       umur: formData.umur
      }
    ]);
    if (error) alert(error.message);
    else alert("Data Berhasil Masuk!");
  };

  return (
    <div style={{ padding: '50px 0', minHeight: '70vh', display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{
        width: '350px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <h2 style={{ textAlign: 'center'}}>reigister</h2>
        <input type="text" placeholder="mynama" onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px' }} />
        <input type="email" placeholder="emil" onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px' }} />
        <input type="password" placeholder="passwor" onChange={e => setFormData({...formData, password: e.target.value})} required style={{ padding: '10px'}}/>
        <input type="umur" placeholder="tua" onChange={e => setFormData({...formData, umur: e.target.value})} required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
}