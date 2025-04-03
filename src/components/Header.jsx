export default function Header() {
    return (
      <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 50, borderBottom: '1px solid black' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px'}}>
          <a style={{fontSize: '1.125rem', fontWeight: 'bold', color: 'black', textDecoration: 'none'}}>
            <h2 style={{ textAlign: 'center' }}>
                Space Travel Listings
            </h2>
          </a>
        </div>
      </header>
    );
  }
  