// Header / top nav
function HeaderUJ({ variant }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', h); h();
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: '#fff',
      borderBottom: scrolled ? '1px solid var(--border-1)' : '1px solid transparent',
      transition: 'border-color 200ms var(--ease-out)',
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: 20 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="assets/logo_uj.png" alt="Usina de Justicia" style={{ height: 42 }} />
        </a>
        <nav style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 600 }}>
          {['Nosotros','Programas','Observatorio','Noticias','IVUJUS','Contacto'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--fg-1)', textDecoration: 'none' }}
               onMouseEnter={e => e.currentTarget.style.color = 'var(--uj-navy-600)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-1)'}>{l}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="#acompany" style={{
            textDecoration:'none', fontSize:13, fontWeight:700, whiteSpace:'nowrap',
            padding:'9px 14px', borderRadius:6,
            border:'1px solid var(--uj-navy-600)', color:'var(--uj-navy-600)',
          }}>Necesito ayuda</a>
          <a href="#donar" style={{
            textDecoration:'none', fontSize:13, fontWeight:700,
            padding:'9px 16px', borderRadius:6,
            background:'var(--uj-navy-600)', color:'#fff',
          }}>Donar</a>
        </div>
      </div>
    </header>
  );
}
Object.assign(window, { HeaderUJ });
