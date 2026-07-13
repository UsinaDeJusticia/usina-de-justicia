function QueHacer({ tweaks }) {
  const steps = [
    { n: '01', t: 'Comunicate con nosotros', d: 'Te escuchamos sin apuro. Llamanos o escribinos por el canal que prefieras. Te asignamos una referente de acompañamiento.' },
    { n: '02', t: 'Contención y primer asesoramiento', d: 'Una psicóloga y una abogada del equipo te acompañan en las primeras decisiones: velatorio, pericias, expediente, medios.' },
    { n: '03', t: 'Acompañamiento sostenido', d: 'Te acompañamos durante todo el proceso penal y la ejecución de la pena, con asistencia jurídica y grupos de pares.' },
  ];
  return (
    <section id="quehacer" style={{ padding: '96px 0', background: '#fff' }}>
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: 720, marginBottom: 48 }}>
          <div className="uj-eyebrow">Si perdiste a un ser querido</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(30px,3.2vw,44px)', lineHeight:1.1, margin:'10px 0 14px', color:'var(--fg-1)' }}>
            ¿Qué hacer en primer lugar?
          </h2>
          <p className="uj-body-lg" style={{ color: 'var(--fg-2)' }}>
            Nadie debería enfrentar esto solo. Te acompañamos paso a paso, con tiempo y reserva.
          </p>
        </div>
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {steps.map(s => (
            <div key={s.n} style={{ padding: '28px 28px 32px', background: 'var(--uj-ivory)', border: '1px solid var(--border-1)', borderTop: '3px solid var(--uj-navy-600)' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:36, color:'var(--uj-navy-600)', lineHeight:1 }}>{s.n}</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, margin:'14px 0 8px' }}>{s.t}</h3>
              <p style={{ fontSize:14, lineHeight:1.6, color:'var(--fg-2)', margin:0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { QueHacer });
