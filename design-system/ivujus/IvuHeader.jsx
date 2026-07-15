// IVUJUS Header — academic masthead
function IvuHeader({ tweaks }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', h); h();
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, background: '#fff',
      borderBottom: scrolled ? '1px solid var(--border-1)' : '1px solid transparent',
      transition: 'border-color 200ms var(--ease-out)',
    }}>
      {/* UJ subbrand strip */}
      {tweaks.showUJLockup && (
        <div style={{ background: 'var(--uj-navy-900)', color: 'var(--uj-navy-200)' }}>
          <div className="ivu-wrap" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', height: 38, fontSize: 11.5, letterSpacing:'.06em', whiteSpace:'nowrap' }}>
            <div>Un instituto de <a href="#" style={{ color:'#fff', textDecoration:'none', fontWeight:700, borderBottom:'1px solid rgba(255,255,255,.35)' }}>Usina de Justicia</a></div>
            <div style={{ display:'flex', gap:20 }}>
              <a href="#" style={{ color:'inherit', textDecoration:'none' }}>Observatorio</a>
              <a href="#" style={{ color:'inherit', textDecoration:'none' }}>Acompañamiento</a>
              <a href="#" style={{ color:'inherit', textDecoration:'none' }}>Donar</a>
            </div>
          </div>
        </div>
      )}
      <div className="ivu-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 82, gap: 20 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
          <img src="assets/logo_ivujus.png" alt="IVUJUS" style={{ height: 48 }} />
          <div style={{ borderLeft:'1px solid var(--border-1)', paddingLeft:14, display:'flex', flexDirection:'column', gap:2 }}>
            <div className="ivu-serif" style={{ fontSize: 17, fontWeight: 800, color: 'var(--ivu-bordeaux-800)', lineHeight: 1 }}>IVUJUS</div>
            <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--fg-2)', fontWeight: 600 }}>Instituto de Victimología</div>
          </div>
        </a>
        <nav style={{ display: 'flex', gap: 30, fontSize: 14, fontWeight: 600 }}>
          {['Instituto','Programa','Docentes','Publicaciones','Novedades','Contacto'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--ivu-ink)', textDecoration: 'none' }}
               onMouseEnter={e => e.currentTarget.style.color = 'var(--ivu-bordeaux-700)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--ivu-ink)'}>{l}</a>
          ))}
        </nav>
        <a href="#inscripcion" className="ivu-cta" style={{ padding:'10px 18px' }}>Inscripción 2026</a>
      </div>
    </header>
  );
}
Object.assign(window, { IvuHeader });
