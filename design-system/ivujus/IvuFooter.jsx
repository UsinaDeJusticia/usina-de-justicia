function IvuFooter({ tweaks }) {
  return (
    <footer style={{ background: 'var(--ivu-ink)', color: 'rgba(255,255,255,0.78)' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--ivu-bordeaux-700) 0, var(--ivu-bordeaux-700) 40%, var(--ivu-ochre) 40%, var(--ivu-ochre) 60%, var(--ivu-bordeaux-700) 60%, var(--ivu-bordeaux-700) 100%)' }} />
      <div className="ivu-wrap" style={{ padding:'60px 0 32px', display:'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <img src="assets/logo_ivujus.png" alt="IVUJUS" style={{ height: 56, filter:'brightness(0) invert(1)' }} />
          <div className="ivu-serif" style={{ fontSize: 18, fontWeight: 700, marginTop: 14, color:'#fff' }}>Instituto de Victimología</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 10, maxWidth: 340, fontFamily:'var(--ivu-serif)', fontStyle:'italic', color:'rgba(255,255,255,0.66)' }}>
            Un instituto de <a href="#" style={{ color:'#fff', fontStyle:'normal', fontWeight:700, textDecoration:'underline', textDecorationColor:'var(--ivu-ochre)', textUnderlineOffset:3 }}>Usina de Justicia</a>.
          </p>
        </div>
        {[
          { t:'Instituto',       l:['Nosotros','Directora académica','Cuerpo docente','Alianzas'] },
          { t:'Académico',       l:['Programa 2026','Inscripción','Calendario','Reglamento'] },
          { t:'Investigación',   l:['Publicaciones','Amicus','Repositorio','Biblioteca'] },
        ].map(c => (
          <div key={c.t}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.2em', textTransform:'uppercase', color: 'var(--ivu-ochre-100)', marginBottom: 16 }}>{c.t}</div>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap: 8 }}>
              {c.l.map(x => (
                <li key={x}><a href="#" style={{ fontSize: 13.5, color:'rgba(255,255,255,0.78)', textDecoration:'none', fontFamily:'var(--ivu-serif)' }}>{x}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="ivu-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.14)', padding:'22px 0 40px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap: 16 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing:'.04em' }}>
          © 2026 IVUJUS · Instituto de Victimología de Usina de Justicia
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily:'var(--ivu-serif)', fontStyle:'italic' }}>
          Buenos Aires · Argentina
        </div>
      </div>
    </footer>
  );
}
Object.assign(window, { IvuFooter });
