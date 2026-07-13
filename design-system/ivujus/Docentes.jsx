function Docentes({ tweaks }) {
  const docentes = [
    { n:'Dra. Diana Cohen Agrest', r:'Directora académica', e:'Filosofía moral · UBA · CONICET', bio:'Fundadora de Usina de Justicia. Doctora en Filosofía. Autora de "¿Qué piensan los que no piensan como yo?" y "Ausencia perpetua".' },
    { n:'Dr. Daniel Rafecas',      r:'Profesor titular · Derecho Penal', e:'Juez Federal · UBA', bio:'Juez Federal en lo Criminal y Correccional. Profesor de Derecho Penal en la UBA. Especialista en delitos de lesa humanidad.' },
    { n:'Dra. Hilda Kogan',        r:'Profesora · Proceso penal', e:'Ex jueza SCJBA', bio:'Ex Ministra de la Suprema Corte de Justicia de Buenos Aires. Referente en derechos de la víctima en el proceso.' },
    { n:'Dr. Juan Carlos Wlasic',  r:'Profesor · DDHH y víctimas', e:'DDHH · Sistema Interamericano', bio:'Especialista en derecho internacional de los derechos humanos. Consultor de organismos internacionales en reparación a víctimas.' },
    { n:'Lic. Silvia Bleichmar',   r:'Seminario · Trauma y duelo', e:'Psicoanálisis · UBA', bio:'Psicoanalista especializada en duelo traumático. Coordina el seminario integrador sobre acompañamiento interdisciplinario.' },
    { n:'Dr. Alberto Binder',      r:'Profesor invitado · Reforma penal', e:'INECIP · política criminal', bio:'Referente latinoamericano en reforma procesal penal. Asesor de procesos de reforma en 12 países de la región.' },
  ];
  return (
    <section id="docentes" style={{ padding:'104px 0', background:'#fff' }}>
      <div className="ivu-wrap">
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'end', marginBottom:56 }}>
          <div>
            <div className="ivu-eyebrow">Cuerpo docente</div>
            <h2 className="ivu-serif" style={{ fontSize:'clamp(34px,3.6vw,52px)', lineHeight:1.08, margin:'14px 0 0', color:'var(--ivu-ink)' }}>
              Quienes enseñan <em style={{ fontStyle:'italic', color:'var(--ivu-bordeaux-700)' }}>también practican</em>.
            </h2>
          </div>
          <p style={{ fontFamily:'var(--ivu-serif)', fontSize:17, lineHeight:1.65, color:'var(--fg-2)', margin:0 }}>
            Magistrados, académicos y clínicos que atraviesan la victimología desde la filosofía,
            el derecho procesal, los derechos humanos y la psicología del trauma. Un claustro pequeño,
            elegido por su trayectoria.
          </p>
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:0, borderTop:'1px solid var(--border-2)' }}>
          {docentes.map((d,i)=>(
            <article key={d.n} style={{
              padding:'36px 32px 36px 0',
              paddingLeft: i%3===0 ? 0 : 32,
              borderLeft: i%3===0 ? 'none' : '1px solid var(--border-2)',
              borderBottom: i<3 ? '1px solid var(--border-2)' : 'none',
            }}>
              <div style={{
                width: 88, height: 88, borderRadius:'50%',
                background: `linear-gradient(135deg, var(--ivu-bordeaux-500), var(--ivu-bordeaux-800))`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color: 'var(--ivu-ochre-100)', fontFamily:'var(--ivu-serif)', fontWeight:700, fontSize:30, fontStyle:'italic',
                marginBottom: 22
              }}>
                {d.n.split(' ').filter(x=>!x.match(/^(Dra?\.|Lic\.|Ing\.)$/)).slice(0,2).map(x=>x[0]).join('')}
              </div>
              <h3 className="ivu-serif" style={{ fontSize:19, lineHeight:1.25, margin:'0 0 4px', color:'var(--ivu-ink)', fontWeight:700 }}>{d.n}</h3>
              <div style={{ fontSize:12.5, color:'var(--ivu-bordeaux-700)', fontWeight:700, letterSpacing:'.04em' }}>{d.r}</div>
              <div style={{ fontSize:12, color:'var(--fg-3)', fontStyle:'italic', fontFamily:'var(--ivu-serif)', marginTop:2 }}>{d.e}</div>
              <p style={{ fontSize:14, lineHeight:1.65, color:'var(--fg-2)', margin:'16px 0 0' }}>{d.bio}</p>
            </article>
          ))}
        </div>

        <div className="reveal" style={{ marginTop:32, textAlign:'right' }}>
          <a href="#" className="ivu-cta-ghost">Ver claustro completo →</a>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Docentes });
