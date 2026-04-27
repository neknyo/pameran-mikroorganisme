import React from 'react'; 
import Navbar from "./Navbar";
import RegPanel from "./RegPanel";
import Footer from "./Footer";
import { supabase } from './supabaseClient'; 

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <RegPanel/>
        
      </main>
      
      <Footer />
    </div>
  );
}

export default App;