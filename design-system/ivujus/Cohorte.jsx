function Cohorte({ tweaks }) {
  const fechas = [
    { k:'Apertura de inscripciones', v:'1º de diciembre de 2025' },
    { k:'Cierre de preinscripción',  v:'15 de febrero de 2026' },
    { k:'Inicio de cursada',         v:'Miércoles 11 de marzo de 2026' },
    { k:'Cierre de cursada',         v:'Miércoles 25 de noviembre de 2026' },
    { k:'Defensa del trabajo final', v:'Diciembre de 2026' },
  ];
  return (
    <section id="inscripcion" style={{ padding:'104px 0', background:'var(--ivu-ink)', color:'#fff' }}>
      <div className="ivu-wrap" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
        <div className="reveal">
          <div className="ivu-eyebrow" style={{ color:'var(--ivu-ochre-100)' }}>Cohorte 2026</div>
          <h2 className="ivu-serif" style={{ fontSize:'clamp(34px,3.8vw,56px)', lineHeight:1.05, margin:'14px 0 20px', color:'#fff' }}>
            La próxima cohorte abre<br />
            <em style={{ fontStyle:'italic', color:'var(--ivu-ochre-100)' }}>en marzo de 2026</em>.
          </h2>
          <p style={{ fontFamily:'var(--ivu-serif)', fontSize:18, lineHeight:1.65, color:'rgba(255,255,255,0.78)', margin:'0 0 32px', maxWidth:480 }}>
            Cupos limitados. La admisión es por antecedentes y carta de motivación. Becas parciales
            disponibles para operadores judiciales y estudiantes avanzados.
          </p>
          <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
            <a href="#" className="ivu-cta" style={{ background:'var(--ivu-ochre)', color:'var(--ivu-ink)' }}>Iniciar preinscripción →</a>
            <a href="#" style={{ color:'#fff', textDecoration:'none', fontWeight:700, fontSize:14, borderBottom:'1px solid rgba(255,255,255,.5)', paddingBottom:6 }}>Solicitar información</a>
          </div>

          <div style={{ marginTop:40, display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, borderTop:'1px solid rgba(255,255,255,0.18)', paddingTop:24 }}>
            <div>
              <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ivu-ochre-100)', fontWeight:700, marginBottom:6 }}>Arancel</div>
              <div className="ivu-serif" style={{ fontSize:20, fontWeight:700 }}>8 cuotas · consultar valor</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:4 }}>Descuentos por pago anticipado</div>
            </div>
            <div>
              <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ivu-ochre-100)', fontWeight:700, marginBottom:6 }}>Modalidad</div>
              <div className="ivu-serif" style={{ fontSize:20, fontWeight:700 }}>Híbrida</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:4 }}>16 encuentros · miércoles 18–21 h</div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="reveal" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.12)', padding:'32px 36px' }}>
          <div className="ivu-eyebrow" style={{ color:'var(--ivu-ochre-100)', marginBottom:22 }}>Fechas clave</div>
          {fechas.map((f, i)=>(
            <div key={f.k} style={{ display:'grid', gridTemplateColumns:'24px 1fr', gap:16, paddingBottom: i===fechas.length-1?0:22, marginBottom: i===fechas.length-1?0:22, borderBottom: i===fechas.length-1?'none':'1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--ivu-ochre)', marginTop:8, boxShadow:'0 0 0 4px rgba(184,129,28,0.15)' }} />
              <div>
                <div style={{ fontSize:11.5, letterSpacing:'.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)', fontWeight:700 }}>{f.k}</div>
                <div className="ivu-serif" style={{ fontSize:18, fontWeight:600, color:'#fff', marginTop:4 }}>{f.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Cohorte });
