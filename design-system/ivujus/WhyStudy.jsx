function WhyStudy({ tweaks }) {
  const reasons = [
    {
      n: 'I',
      t: 'Una disciplina ausente del plan de estudios.',
      d: 'Ni grado ni la mayoría de los posgrados en Derecho ofrecen formación sistemática en Victimología. IVUJUS ocupa ese vacío desde 2018.'
    },
    {
      n: 'II',
      t: 'Cuerpo docente con trayectoria jurídica y clínica.',
      d: 'Magistrados, fiscales, defensores, psicólogas forenses y filósofos del derecho que trabajan con víctimas a diario.'
    },
    {
      n: 'III',
      t: 'Investigación aplicada, no teoría aislada.',
      d: 'Los papers, amicus y materiales del instituto se integran al trabajo del Observatorio de Usina de Justicia.'
    },
  ];

  return (
    <section style={{ padding: '104px 0', background: '#fff' }}>
      <div className="ivu-wrap">
        <div className="reveal" style={{ maxWidth: 820, marginBottom: 64 }}>
          <div className="ivu-eyebrow">¿Por qué estudiar Victimología?</div>
          <h2 className="ivu-serif" style={{ fontSize: 'clamp(34px, 3.6vw, 52px)', lineHeight: 1.1, margin: '14px 0 18px', color: 'var(--ivu-ink)' }}>
            Una disciplina necesaria, <em style={{ fontStyle:'italic', color:'var(--ivu-bordeaux-700)' }}>mayoritariamente ausente</em> de la formación jurídica argentina.
          </h2>
          <p style={{ fontFamily:'var(--ivu-serif)', fontSize: 19, lineHeight: 1.6, color:'var(--fg-2)', margin:0 }}>
            La Victimología estudia el lugar de quien sufre el delito: sus derechos, su experiencia
            en el proceso, y el modo en que el sistema penal puede repararle — o revictimizarle.
          </p>
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 0, borderTop:'1px solid var(--border-2)', borderBottom:'1px solid var(--border-2)' }}>
          {reasons.map((r, i) => (
            <div key={r.n} style={{ padding: '40px 36px 40px 0', borderLeft: i===0 ? 'none' : '1px solid var(--border-2)', paddingLeft: i===0 ? 0 : 36 }}>
              <div className="ivu-serif" style={{ fontSize: 48, lineHeight: 1, color: 'var(--ivu-ochre)', fontWeight: 400, fontStyle:'italic' }}>{r.n}</div>
              <h3 className="ivu-serif" style={{ fontSize: 22, lineHeight: 1.25, margin: '18px 0 14px', color: 'var(--ivu-ink)', fontWeight:700 }}>
                {r.t}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--fg-2)', margin: 0 }}>
                {r.d}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial pull */}
        <div className="reveal" style={{ marginTop: 72, maxWidth: 880 }}>
          <blockquote className="ivu-serif" style={{
            fontSize: 'clamp(24px, 2.6vw, 34px)', lineHeight: 1.35, fontStyle:'italic', fontWeight: 400,
            color: 'var(--ivu-ink)', margin: 0, paddingLeft: 28, borderLeft: '3px solid var(--ivu-bordeaux-700)'
          }}>
            “El curso de IVUJUS me obligó a repensar qué significa justicia cuando el destinatario
            ya no está. Cambió mi práctica como fiscal.”
          </blockquote>
          <div style={{ marginTop: 18, paddingLeft: 28, fontSize: 13, color: 'var(--fg-2)', letterSpacing: '.04em' }}>
            — Dra. L. Méndez, Fiscalía de Homicidios, cohorte 2023
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { WhyStudy });
