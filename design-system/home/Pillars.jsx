function Pillars({ tweaks }) {
  const p = [
    { ico:'heart-handshake', t:'Acompañamiento a las víctimas', d:'Contención emocional y asesoramiento jurídico para familiares de víctimas de homicidio y femicidio.', l:'Conocer el programa' },
    { ico:'gavel',           t:'Incidencia en políticas públicas', d:'Amicus curiae, proyectos de ley y participación activa en la aplicación de la Ley 27.372.', l:'Ver incidencia' },
    { ico:'book-open',       t:'Capacitación e investigación', d:'A través de IVUJUS, el único curso de Victimología Penal del país y formación a magistrados.', l:'Ir a IVUJUS' },
  ];
  return (
    <section style={{ padding: '96px 0', background: 'var(--uj-navy-50)', borderTop:'1px solid var(--border-1)', borderBottom:'1px solid var(--border-1)' }}>
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 44, display:'flex', alignItems:'end', justifyContent:'space-between', gap:40, flexWrap:'wrap' }}>
          <div style={{ maxWidth:600 }}>
            <div className="uj-eyebrow">Nuestros tres pilares</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(30px,3.2vw,44px)', margin:'10px 0 0', color:'var(--fg-1)' }}>
              Acompañar, incidir, formar.
            </h2>
          </div>
          <div style={{ fontSize:14, color:'var(--fg-2)', maxWidth:420, lineHeight:1.6 }}>
            Tres líneas de trabajo que se sostienen entre sí: la asistencia directa alimenta el diagnóstico,
            el diagnóstico alimenta la política pública, y la formación garantiza el cambio en el tiempo.
          </div>
        </div>
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {p.map(it => (
            <a key={it.t} href="#" style={{
              background:'#fff', border:'1px solid var(--border-1)', borderRadius:4,
              padding:'32px 28px 28px', textDecoration:'none', color:'inherit',
              display:'flex', flexDirection:'column', transition:'transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out)',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
              <div style={{ color:'var(--uj-navy-600)' }}><i data-lucide={it.ico} style={{ width:28, height:28, strokeWidth:1.75 }} /></div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, margin:'20px 0 10px', color:'var(--uj-navy-800)' }}>{it.t}</h3>
              <p style={{ fontSize:14, lineHeight:1.6, color:'var(--fg-2)', margin:'0 0 20px', flex:1 }}>{it.d}</p>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--uj-navy-600)', display:'inline-flex', alignItems:'center', gap:6 }}>
                {it.l} <i data-lucide="arrow-right" style={{ width:14, height:14 }} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Pillars });
