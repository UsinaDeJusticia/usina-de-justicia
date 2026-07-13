function FooterUJ() {
  const cols = [
    { t:'Institución', l:['Nosotros','Equipo','Transparencia institucional','Memoria y balance'] },
    { t:'Programas',   l:['Acompañamiento','Incidencia','Capacitación','IVUJUS'] },
    { t:'Observatorio',l:['Informes','Amicus curiae','Base de sentencias','Prensa'] },
    { t:'Contacto',    l:['Escribinos','Sumate como voluntario','Convenios','Prensa'] },
  ];
  return (
    <footer style={{ background:'#fff', borderTop:'1px solid var(--border-1)' }}>
      <div className="wrap" style={{ padding:'56px 0 28px', display:'grid', gridTemplateColumns:'1.3fr repeat(4,1fr)', gap:40 }}>
        <div>
          <img src="assets/logo_uj.png" alt="Usina de Justicia" style={{ height:44 }} />
          <p style={{ fontSize:13, color:'var(--fg-2)', lineHeight:1.6, marginTop:14, maxWidth:320 }}>
            Asociación Civil apartidaria por los derechos de las víctimas de homicidio y femicidio.
          </p>
        </div>
        {cols.map(c=>(
          <div key={c.t}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--uj-navy-700)', marginBottom:14 }}>{c.t}</div>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
              {c.l.map(x=>(<li key={x}><a href="#" style={{ fontSize:13, color:'var(--fg-2)', textDecoration:'none' }}>{x}</a></li>))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap" style={{ borderTop:'1px solid var(--border-1)', padding:'20px 0 28px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
        <div style={{ fontSize:12, color:'var(--fg-3)' }}>© 2026 Asociación Civil Usina de Justicia · CUIT 30-71492000-0 · CABA, Argentina</div>
        <div style={{ display:'flex', gap:14, color:'var(--fg-2)' }}>
          {[
            ['Facebook','M9 8h-2v3h2v8h3v-8h2.5l.5-3h-3V6.7c0-.7.2-1.2 1.3-1.2H15V3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 4V8z'],
            ['X',       'M18 3h3l-7.5 8.5L22 21h-6l-4.5-6-5 6H3l8-9.2L2 3h6l4 5.5L18 3z'],
            ['Instagram','M3 7.5A4.5 4.5 0 0 1 7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9zm9 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'],
            ['YouTube', 'M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z'],
            ['LinkedIn','M4 4h4v4H4V4zm0 6h4v10H4V10zm6 0h4v1.5c.7-1 1.8-1.8 3.5-1.8 3 0 3.5 2 3.5 4.5V20h-4v-5.2c0-1.3-.5-2.3-1.8-2.3-1.2 0-2 .8-2 2.3V20h-3V10z'],
          ].map(([n,d])=>(
            <a key={n} href="#" title={n} style={{ color:'inherit' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={d}/></svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
Object.assign(window, { FooterUJ });
