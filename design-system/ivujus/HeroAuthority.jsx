// Hero — Authority: negro/bordó, estadísticas + gravitas académica
function HeroAuthority({ tweaks }) {
  return (
    <section style={{ padding:'80px 0 72px', background: 'var(--ivu-ink)', color:'#fff', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'var(--ivu-ochre)' }} />
      <div className="ivu-wrap" style={{ position:'relative' }}>
        <div className="reveal" style={{ maxWidth: 980 }}>
          <div className="ivu-eyebrow" style={{ color: 'var(--ivu-ochre-100)', marginBottom: 24 }}>Instituto de Victimología de Usina de Justicia</div>
          <h1 className="ivu-serif" style={{ fontSize: 'clamp(44px, 5.4vw, 76px)', lineHeight: 1.02, margin:0, letterSpacing:'-0.015em' }}>
            Formación e investigación en <em style={{ fontStyle:'italic', color:'var(--ivu-ochre-100)' }}>Victimología Penal</em> desde 2018.
          </h1>
          <p style={{ fontFamily:'var(--ivu-serif)', fontSize: 19, lineHeight: 1.6, maxWidth: 720, marginTop: 26, color: 'rgba(255,255,255,0.82)' }}>
            Un instituto académico independiente que produce investigación rigurosa y forma a
            operadores judiciales en una disciplina ausente de los planes de estudio tradicionales.
          </p>
          <div style={{ display:'flex', gap:22, marginTop: 38, alignItems:'center', flexWrap:'wrap' }}>
            <a href="#inscripcion" className="ivu-cta" style={{ background:'var(--ivu-ochre)', color:'var(--ivu-ink)' }}>Inscripción cohorte 2026 →</a>
            <a href="#programa" style={{ color:'#fff', textDecoration:'none', fontWeight:700, fontSize:14, borderBottom:'1px solid rgba(255,255,255,.5)', paddingBottom:6 }}>Ver programa académico</a>
          </div>
        </div>

        <div className="reveal" style={{ marginTop: 72, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 48, borderTop:'1px solid rgba(255,255,255,0.16)', paddingTop: 36 }}>
          {[
            ['8', 'cohortes formadas'],
            ['+420', 'alumnos desde 2018'],
            ['24', 'docentes e invitados'],
            ['1º', 'curso de Victimología Penal del país'],
          ].map(([v,l]) => (
            <div key={l}>
              <div className="ivu-serif" style={{ fontSize: 52, fontWeight: 800, lineHeight: 0.95, color: 'var(--ivu-ochre-100)' }}>{v}</div>
              <div style={{ fontSize: 13, color:'rgba(255,255,255,0.7)', marginTop: 10, lineHeight: 1.45 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { HeroAuthority });
