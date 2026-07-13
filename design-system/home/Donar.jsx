function Donar({ tweaks }) {
  return (
    <section id="donar" style={{ padding:'96px 0', background:'var(--uj-navy-900)', color:'#fff' }}>
      <div className="wrap" style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:56, alignItems:'center' }}>
        <div className="reveal">
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--uj-navy-300)' }}>Sostené esta tarea</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(32px,3.6vw,52px)', lineHeight:1.08, margin:'14px 0 18px' }}>
            No recibimos subsidio del Estado.<br />
            <span style={{ color:'var(--uj-navy-300)' }}>Tu aporte hace posible el acompañamiento.</span>
          </h2>
          <p style={{ fontSize:16, color:'var(--uj-navy-200)', lineHeight:1.7, maxWidth:560, margin:0 }}>
            Con tu donación sostenemos la asistencia jurídica, la contención emocional y la
            investigación que alimenta nuestras propuestas de política pública.
          </p>
        </div>
        <div className="reveal" style={{ background:'#fff', color:'var(--fg-1)', padding:28, borderRadius:4 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--uj-navy-700)', marginBottom:14 }}>Quiero donar</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
            {['$1.000','$5.000','$10.000'].map((a,i)=>(
              <button key={a} style={{
                all:'unset', cursor:'pointer', textAlign:'center',
                padding:'14px 0', border:'1px solid var(--border-strong)',
                borderColor: i===1 ? 'var(--uj-navy-600)':'var(--border-strong)',
                background: i===1 ? 'var(--uj-navy-50)':'#fff',
                fontWeight:700, fontSize:15, color:'var(--uj-navy-800)', borderRadius:4
              }}>{a}</button>
            ))}
          </div>
          <input placeholder="Otro monto" style={{
            width:'100%', padding:'12px 14px', border:'1px solid var(--border-strong)',
            borderRadius:4, fontSize:14, fontFamily:'var(--font-body)', marginBottom:14, outline:'none'
          }} />
          <button style={{
            all:'unset', cursor:'pointer', display:'block', textAlign:'center',
            width:'100%', padding:'14px 0', background:'var(--uj-navy-600)', color:'#fff',
            fontWeight:700, fontSize:15, borderRadius:6
          }}>Donar ahora</button>
          <div style={{ fontSize:11, color:'var(--fg-3)', marginTop:12, textAlign:'center' }}>Donación segura · deducible de Ganancias</div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Donar });
