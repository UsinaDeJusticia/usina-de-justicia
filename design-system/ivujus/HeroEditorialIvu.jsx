// Hero — Editorial: tipografía grande, cita y retrato, muy NYU/Harvard Law
function HeroEditorialIvu({ tweaks }) {
  return (
    <section style={{ padding: '88px 0 80px', background: 'var(--ivu-parchment)', borderBottom: '1px solid var(--border-1)', position:'relative', overflow:'hidden' }}>
      {/* ornamental rule */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg, var(--ivu-bordeaux-700) 0, var(--ivu-bordeaux-700) 40%, var(--ivu-ochre) 40%, var(--ivu-ochre) 60%, var(--ivu-bordeaux-700) 60%, var(--ivu-bordeaux-700) 100%)' }} />
      <div className="ivu-wrap" style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:72, alignItems:'center' }}>
        <div className="reveal">
          <div className="ivu-eyebrow" style={{ marginBottom: 24 }}>Instituto de Victimología · Fundado 2018</div>
          <h1 className="ivu-serif" style={{ fontSize: 'clamp(46px, 5.6vw, 84px)', lineHeight: 0.98, margin: 0, color: 'var(--ivu-ink)' }}>
            La víctima,<br />
            <em style={{ fontStyle: 'italic', color: 'var(--ivu-bordeaux-700)', fontWeight: 700 }}>al centro</em>
            <span style={{ color:'var(--ivu-ink)' }}> del derecho penal.</span>
          </h1>
          <p style={{ fontFamily:'var(--ivu-serif)', fontSize: 20, lineHeight: 1.55, color:'var(--fg-1)', margin:'28px 0 0', maxWidth: 560, fontWeight:400 }}>
            El único instituto del país dedicado a la formación, investigación y difusión
            de la Victimología Penal. Pensamos el sistema penal desde la experiencia de
            quien sobrevive al delito.
          </p>
          <div style={{ display: 'flex', gap: 20, marginTop: 36, alignItems:'center', flexWrap:'wrap' }}>
            <a href="#inscripcion" className="ivu-cta">Inscripción cohorte 2026 →</a>
            <a href="#programa" className="ivu-cta-ghost">Ver programa académico</a>
          </div>
        </div>
        <aside className="reveal" style={{ position:'relative' }}>
          <div style={{
            aspectRatio: '3/4',
            background: "linear-gradient(180deg, rgba(27,20,16,0) 45%, rgba(27,20,16,0.75) 100%), center/cover no-repeat url('https://images.unsplash.com/photo-1568667256549-094345857637?w=900')",
            border: '1px solid var(--border-2)', position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:30, color:'#fff' }}>
              <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--ivu-ochre-100)' }}>Directora académica</div>
              <div className="ivu-serif" style={{ fontSize:26, fontWeight:700, margin:'6px 0 4px' }}>Dra. Diana Cohen Agrest</div>
              <div style={{ fontSize:13, opacity:.85, fontStyle:'italic', fontFamily:'var(--ivu-serif)' }}>Filósofa · Fundadora de Usina de Justicia</div>
            </div>
          </div>
          <div style={{ marginTop: 20, paddingLeft: 18, borderLeft: '2px solid var(--ivu-bordeaux-700)' }}>
            <div style={{ fontFamily:'var(--ivu-serif)', fontStyle:'italic', fontSize:15, lineHeight:1.5, color:'var(--fg-2)' }}>
              “La víctima no es una figura residual del proceso penal:
              es el sujeto al que el derecho penal debe volver.”
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
Object.assign(window, { HeroEditorialIvu });
