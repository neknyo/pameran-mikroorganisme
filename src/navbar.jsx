export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 5%',
      background: '#222',
      color: 'white'
    }}>
      <div style={{ fontWeight: 'bold' }}>laper</div>
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0 }}>
        <li>bebek</li>
        <li>goreng</li>
        <li>kaleo</li>
      </ul>
    </nav>
  );
}