import React, { useState, useRef } from 'react';

// Data Konstanta
const JURUSAN = ["Seni Rupa", "Desain Komunikasi Visual", "Desain Produk", "Desain Interior", "Kriya"];
const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "4:5", "5:4", "16:9"];

export default function UploadArtwork() {
  // 1. State Form Data
  const [formData, setFormData] = useState({
    nim: "",
    realName: "",
    major: "",
    dimensionType: "",
    artTitle: "",
    artDesc: "",
    artMedia: "",
    artNameYear: "",
    artDimension: "",
  });

  // 2. State untuk Gambar & Preview
  const [profileImg, setProfileImg] = useState(null); // File asli
  const [profilePreview, setProfilePreview] = useState(null); // URL untuk UI
  const [artImg, setArtImg] = useState(null);
  const [artPreview, setArtPreview] = useState(null);

  // 3. State untuk Drag & Drop UI
  const [dragProfile, setDragProfile] = useState(false);
  const [dragArt, setDragArt] = useState(false);

  // 4. State untuk Modal Crop
  const [showProfileCrop, setShowProfileCrop] = useState(false);
  const [showArtCrop, setShowArtCrop] = useState(false);
  const [tempImage, setTempImage] = useState(null); // Gambar sementara sebelum di-crop
  const [activeCropRatio, setActiveCropRatio] = useState(ASPECT_RATIOS[0]);

  // Referensi Input File yang disembunyikan
  const profileInputRef = useRef(null);
  const artInputRef = useRef(null);

  // ==========================================
  // HANDLER TEXT INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==========================================
  // HANDLER UPLOAD & DRAG DROP
  // ==========================================
  const handleFileDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    type === 'profile' ? setDragProfile(false) : setDragArt(false);

    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya menerima file gambar!");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setTempImage({ file, url: objectUrl });

    // Buka modal crop sesuai tipe
    if (type === 'profile') setShowProfileCrop(true);
    if (type === 'art') setShowArtCrop(true);
  };

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ==========================================
  // HANDLER MODAL CROP (Simulasi)
  // ==========================================
  const saveCrop = (type) => {
    // Di real app, di sini proses potong canvas HTML dilakukan.
    // Untuk versi lokal tes, kita langsung pakai gambar aslinya.
    if (type === 'profile') {
      setProfileImg(tempImage.file);
      setProfilePreview(tempImage.url);
      setShowProfileCrop(false);
    } else {
      setArtImg(tempImage.file);
      setArtPreview(tempImage.url);
      setShowArtCrop(false);
    }
    setTempImage(null);
  };

  const cancelCrop = (type) => {
    if (type === 'profile') {
      setShowProfileCrop(false);
      if (profileInputRef.current) profileInputRef.current.value = "";
    } else {
      setShowArtCrop(false);
      if (artInputRef.current) artInputRef.current.value = "";
    }
    setTempImage(null);
  };

  // ==========================================
  // HANDLER SUBMIT
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!profileImg || !artImg) {
      alert("Mohon upload Foto Profil dan Foto Karya!");
      return;
    }

    console.log("=== DATA SUBMIT LOKAL ===");
    console.log("Data Teks:", formData);
    console.log("File Profil:", profileImg.name);
    console.log("File Karya:", artImg.name);
    
    alert("Berhasil Submit Karya! (Cek Console Log untuk lihat data)");
    
    // Reset Form
    setFormData({
      nim: "", realName: "", major: "", dimensionType: "", 
      artTitle: "", artDesc: "", artMedia: "", artNameYear: "", artDimension: ""
    });
    setProfilePreview(null);
    setArtPreview(null);
    setProfileImg(null);
    setArtImg(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Upload Artwork</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* DATA DIRI */}
        <div>
          <label style={labelStyle}>NIM:</label>
          <input type="text" name="nim" value={formData.nim} onChange={handleChange} required style={inputStyle} placeholder="Masukkan NIM" />
        </div>

        <div>
          <label style={labelStyle}>Nama Lengkap:</label>
          <input type="text" name="realName" value={formData.realName} onChange={handleChange} required style={inputStyle} placeholder="Masukkan nama lengkap" />
        </div>

        <div>
          <label style={labelStyle}>Jurusan:</label>
          <select name="major" value={formData.major} onChange={handleChange} required style={inputStyle}>
            <option value="">Pilih Jurusan</option>
            {JURUSAN.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        {/* TIPE DIMENSI (RADIO) */}
        <div>
          <label style={labelStyle}>Tipe Dimensi:</label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label><input type="radio" name="dimensionType" value="2D" checked={formData.dimensionType === "2D"} onChange={handleChange} required /> 2D</label>
            <label><input type="radio" name="dimensionType" value="3D" checked={formData.dimensionType === "3D"} onChange={handleChange} required /> 3D</label>
          </div>
        </div>

        {/* DRAG & DROP: PROFILE PICTURE */}
        <div>
          <label style={labelStyle}>Profile Picture:</label>
          {profilePreview ? (
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <img src={profilePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              <button type="button" onClick={() => setProfilePreview(null)} style={removeBtnStyle}>X</button>
            </div>
          ) : (
            <div
              onClick={() => profileInputRef.current.click()}
              onDragEnter={(e) => { preventDefault(e); setDragProfile(true); }}
              onDragLeave={(e) => { preventDefault(e); setDragProfile(false); }}
              onDragOver={preventDefault}
              onDrop={(e) => handleFileDrop(e, 'profile')}
              style={getDropZoneStyle(dragProfile, true)}
            >
              <p style={{ margin: 0, fontSize: '14px', color: 'gray' }}>Click or drag image here<br/>(Akan di-crop bulat)</p>
            </div>
          )}
          <input type="file" accept="image/*" ref={profileInputRef} style={{ display: 'none' }} onChange={(e) => handleFileDrop(e, 'profile')} />
        </div>

        {/* DATA KARYA */}
        <div>
          <label style={labelStyle}>Judul Karya:</label>
          <input type="text" name="artTitle" value={formData.artTitle} onChange={handleChange} required style={inputStyle} placeholder="Judul karyanya apa nih?" />
        </div>

        <div>
          <label style={labelStyle}>Deskripsi Karya:</label>
          <textarea name="artDesc" value={formData.artDesc} onChange={handleChange} required style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="Masukkin deskripsi karya" />
        </div>

        <div>
          <label style={labelStyle}>Media:</label>
          <input type="text" name="artMedia" value={formData.artMedia} onChange={handleChange} required style={inputStyle} placeholder="Contoh: Ink on paper" />
        </div>

        <div>
          <label style={labelStyle}>Nama, Tahun:</label>
          <input type="text" name="artNameYear" value={formData.artNameYear} onChange={handleChange} required style={inputStyle} placeholder="(Nama, Tahun)" />
        </div>

        <div>
          <label style={labelStyle}>Dimensi Karya:</label>
          <input type="text" name="artDimension" value={formData.artDimension} onChange={handleChange} required style={inputStyle} placeholder="Format: 30cm x 30cm" />
        </div>

        {/* DRAG & DROP: ARTWORK IMAGE */}
        <div>
          <label style={labelStyle}>Artwork Image:</label>
          {artPreview ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={artPreview} alt="Artwork" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
              <button type="button" onClick={() => setArtPreview(null)} style={removeBtnStyle}>X</button>
            </div>
          ) : (
            <div
              onClick={() => artInputRef.current.click()}
              onDragEnter={(e) => { preventDefault(e); setDragArt(true); }}
              onDragLeave={(e) => { preventDefault(e); setDragArt(false); }}
              onDragOver={preventDefault}
              onDrop={(e) => handleFileDrop(e, 'art')}
              style={getDropZoneStyle(dragArt, false)}
            >
               <p style={{ margin: 0, fontSize: '14px', color: 'gray' }}>Click to upload or drag and drop<br/>PNG, JPG up to 10MB</p>
            </div>
          )}
          <input type="file" accept="image/*" ref={artInputRef} style={{ display: 'none' }} onChange={(e) => handleFileDrop(e, 'art')} />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
          Upload Artwork
        </button>
      </form>

      {/* =======================================
          SIMULASI MODAL CROP (MOCKUP)
      ======================================= */}
      {showProfileCrop && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Crop Profile Picture</h2>
            <p style={{fontSize:'12px', color:'gray'}}>Simulasi Crop: Gambar akan dipotong rasio 1:1 melingkar.</p>
            <img src={tempImage.url} alt="Crop prev" style={{ width:'150px', height:'150px', objectFit:'cover', borderRadius:'50%', margin:'20px auto', display:'block' }} />
            <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
              <button onClick={() => cancelCrop('profile')} style={btnCancelStyle}>Cancel</button>
              <button onClick={() => saveCrop('profile')} style={btnSaveStyle}>Save Crop</button>
            </div>
          </div>
        </div>
      )}

      {showArtCrop && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Crop Artwork</h2>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '15px' }}>
              {ASPECT_RATIOS.map(ratio => (
                <button key={ratio} onClick={() => setActiveCropRatio(ratio)} style={{ padding: '5px 10px', backgroundColor: activeCropRatio === ratio ? '#2563eb' : '#ddd', color: activeCropRatio === ratio ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {ratio}
                </button>
              ))}
            </div>
            <img src={tempImage.url} alt="Crop prev" style={{ maxWidth:'100%', maxHeight:'300px', margin:'0 auto 20px auto', display:'block' }} />
            <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
              <button onClick={() => cancelCrop('art')} style={btnCancelStyle}>Cancel</button>
              <button onClick={() => saveCrop('art')} style={btnSaveStyle}>Save Crop</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// === Objek Styling Dasar ===
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };
const removeBtnStyle = { position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' };
const getDropZoneStyle = (isDragging, isCircle) => ({
  width: isCircle ? '120px' : '100%',
  height: isCircle ? '120px' : '150px',
  borderRadius: isCircle ? '50%' : '8px',
  border: `2px dashed ${isDragging ? '#2563eb' : '#aaa'}`,
  backgroundColor: isDragging ? '#eff6ff' : '#f9f9f9',
  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
  cursor: 'pointer', transition: 'all 0.2s'
});
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
const modalContentStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '400px' };
const btnCancelStyle = { padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const btnSaveStyle = { padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };