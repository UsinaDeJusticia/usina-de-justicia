// HERO — Observatorio. Dato primero, autoridad institucional.
function HeroData({ tweaks }) {
  const stats = [
    { v: '+1.800', l: 'víctimas de homicidio en 2025' },
    { v: '267', l: 'femicidios registrados' },
    { v: '38%', l: 'de expedientes llegan a sentencia' },
    { v: '3,1', l: 'años promedio hasta firmeza' },
  ];
  return (
    <section style={{ padding: '80px 0', background: 'var(--uj-navy-900)', color: '#fff' }}>
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: 900 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--uj-navy-300)', marginBottom: 20 }}>
            Observatorio de víctimas · informe 2026
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(38px, 4.8vw, 64px)', lineHeight: 1.06,
            letterSpacing: '-0.01em', margin: 0,
          }}>
            La mayoría de los homicidios en Argentina no encuentran una respuesta judicial.
          </h1>
          <p className="uj-body-lg" style={{ maxWidth: 680, marginTop: 20, color: 'var(--uj-navy-200)' }}>
            Documentamos, analizamos y exigimos respuestas. El observatorio de Usina de Justicia
            reúne información pública y registros propios para monitorear el cumplimiento de la
            Ley 27.372 en las 24 jurisdicciones.
          </p>
          <a href="#observatorio" style={{
            display:'inline-flex', gap:8, alignItems:'center',
            marginTop: 28, background:'#fff', color:'var(--uj-navy-800)',
            padding:'14px 22px', borderRadius:6, fontWeight:700, fontSize:15, textDecoration:'none'
          }}>Explorar el observatorio →</a>
        </div>
        <div className="reveal" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 32 }}>
          {stats.map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, color: '#fff', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 13, color: 'var(--uj-navy-200)', marginTop: 8, lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { HeroData });
