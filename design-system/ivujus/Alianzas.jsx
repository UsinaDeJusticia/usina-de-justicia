function Alianzas({ tweaks }) {
  const logos = ['OEA','UBA · Derecho','Colegio Público','Diputados Santa Fe','Ministerio Público','SCJBA','INECIP','ILANUD'];
  return (
    <section style={{ padding:'80px 0', background:'#fff', borderTop:'1px solid var(--border-1)' }}>
      <div className="ivu-wrap">
        <div className="reveal" style={{ textAlign:'center', maxWidth:640, margin:'0 auto 40px' }}>
          <div className="ivu-eyebrow">Convenios y alianzas académicas</div>
          <h3 className="ivu-serif" style={{ fontSize:24, lineHeight:1.3, margin:'12px 0 0', color:'var(--ivu-ink)', fontWeight:600 }}>
            Trabajamos con instituciones del sistema judicial y académico, en el país y la región.
          </h3>
        </div>
        <div className="reveal" style={{
          display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:1,
          background:'var(--border-1)', border:'1px solid var(--border-1)'
        }}>
          {logos.map(l => (
            <div key={l} style={{
              background:'#fff', padding:'28px 16px', minHeight:96,
              display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center',
              fontFamily:'var(--ivu-serif)', fontSize:15, fontWeight:700, fontStyle:'italic',
              color:'var(--fg-2)', letterSpacing:'0.02em'
            }}>{l}</div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:20, fontSize:12, color:'var(--fg-3)', fontStyle:'italic', fontFamily:'var(--ivu-serif)' }}>
          Logos y acuerdos formales en confirmación — listado tentativo.
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Alianzas });
