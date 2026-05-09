import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // (Buka comment ini jika pakai React Router)

export default function PendaftaranPameran({ onSubmit, onBack }) {
  // const navigate = useNavigate(); // (Buka comment ini jika pakai React Router)

  // 1. State untuk menyimpan data form
  const [formData, setFormData] = useState({
    nama: "",
    peran: "",
    instansi: "",
    jumlah: "",
    hari: []
  });

  // Pilihan hari kunjungan (Di kode asli pakai variabel EZ)
  const pilihanHari = ["Hari 1 (28 Juni)", "Hari 2 (29 Juni)"]; 

  // 2. Handler khusus untuk Checkbox Hari
  const handleHariChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      let hariBaru = [...prev.hari];
      if (checked && !hariBaru.includes(value)) {
        hariBaru.push(value); // Tambah hari jika dicentang
      } else if (!checked) {
        hariBaru = hariBaru.filter((h) => h !== value); // Hapus hari jika batal dicentang
      }
      return { ...prev, hari: hariBaru };
    });
  };

  // 3. Handler untuk Input Teks, Angka, dan Dropdown
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Logika khusus dropdown peran
    if (name === "peran") {
      const butuhInstansi = ["Mahasiswa", "Pelajar", "Guru/Dosen"].includes(value);
      setFormData((prev) => ({
        ...prev,
        peran: value,
        // Reset kolom instansi kalau perannya tidak butuh instansi (misal: Umum)
        instansi: butuhInstansi ? prev.instansi : "" 
      }));
      return;
    }

    // Logika khusus input jumlah tiket
    if (name === "jumlah") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, jumlah: "" }));
        return;
      }
      // Cegah user mengetik angka lebih dari 3
      if (Number(value) > 3) return; 
      
      setFormData((prev) => ({ ...prev, jumlah: value }));
      return;
    }

    // Untuk input lainnya (nama)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Handler saat tombol Submit ditekan
  const handleSubmit = () => {
    const butuhInstansi = ["Mahasiswa", "Pelajar", "Guru/Dosen"].includes(formData.peran);

    // Validasi: Cek apakah ada data yang kosong
    if (
      !formData.nama ||
      !formData.peran ||
      (butuhInstansi && !formData.instansi) ||
      !formData.jumlah ||
      formData.hari.length === 0
    ) {
      alert("Mohon mengisi semua data dengan benar!");
      return;
    }

    // Kirim data ke komponen induk (jika ada)
    if (onSubmit) onSubmit(formData);
    
    alert("Berhasil didaftarkan!");
    // navigate('/qr'); // Redirect ke halaman QR
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Pendaftaran Pameran</h2>

      {/* Input Nama */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Nama Lengkap</label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          placeholder="Masukkan Nama"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      {/* Dropdown Peran */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Datang Sebagai</label>
        <select
          name="peran"
          value={formData.peran}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        >
          <option value="">Pilih salah satu</option>
          <option value="Mahasiswa">Mahasiswa</option>
          <option value="Pelajar">Pelajar</option>
          <option value="Guru/Dosen">Guru/Dosen</option>
          <option value="Orang Tua/Wali">Orang Tua/Wali</option>
          <option value="Umum/Masyarakat">Umum/Masyarakat</option>
        </select>
      </div>

      {/* Input Instansi (HANYA MUNCUL JIKA MAHASISWA/PELAJAR/GURU) */}
      {["Mahasiswa", "Pelajar", "Guru/Dosen"].includes(formData.peran) && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Asal Instansi</label>
          <input
            type="text"
            name="instansi"
            value={formData.instansi}
            onChange={handleChange}
            placeholder="Masukkan asal institusi"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
      )}

      {/* Input Jumlah Tiket */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Jumlah Tiket</label>
        <input
          type="number"
          name="jumlah"
          value={formData.jumlah}
          onChange={handleChange}
          min="1"
          max="3"
          placeholder="Masukkan angka"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
        <small style={{ color: 'gray' }}>*maksimal 3 pemesanan tiket</small>
      </div>

      {/* Checkbox Hari Kunjungan */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Hari Kunjungan</label>
        <div style={{ display: 'flex', gap: '15px' }}>
          {pilihanHari.map((hari) => (
            <label key={hari} style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="hari"
                value={hari}
                checked={formData.hari.includes(hari)}
                onChange={handleHariChange}
                style={{ marginRight: '5px' }}
              />
              {hari}
            </label>
          ))}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        <button 
          onClick={onBack} 
          style={{ padding: '10px 20px', width: '100%', cursor: 'pointer' }}
        >
          Kembali
        </button>
        <button 
          onClick={handleSubmit} 
          style={{ padding: '10px 20px', width: '100%', cursor: 'pointer' }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}