function Trayectoria({ tweaks }) {
  const hitos = [
    ['2014', 'Fundación', 'Un 12 de noviembre, tras la experiencia de Diana Cohen Agrest con el proceso por el asesinato de su hijo Ezequiel.'],
    ['2017', 'Ley 27.372', 'UJ participa en la elaboración y reglamentación de la Ley de Derechos y Garantías de las Personas Víctimas de Delitos.'],
    ['2019', 'Ingreso a la OEA', 'Como organización civil registrada ante el organismo internacional.'],
    ['2020', 'Observatorio Santa Fe', 'Participación en el Observatorio de Víctimas de la Cámara de Diputados de Santa Fe.'],
    ['2024', '10 años', 'Conmemoración en el Teatro Colón. Presentación del primer libro: “Nuevos paradigmas para la justicia penal”.'],
  ];
  return (
    <section style={{ padding:'96px 0', background:'#fff' }}>
      <div className="wrap" style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:56, alignItems:'start' }}>
        <div className="reveal">
          <img src="assets/10anos.png" alt="" style={{ width:'100%', maxWidth:360, height:'auto' }} />
          <div className="uj-eyebrow" style={{ marginTop:24 }}>Nuestra trayectoria</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(28px,3vw,40px)', lineHeight:1.15, margin:'10px 0 18px' }}>
            Diez años transformando la justicia.
          </h2>
          <p style={{ fontSize:15, color:'var(--fg-2)', lineHeight:1.7, margin:0 }}>
            Una asociación civil apartidaria, sin subvenciones públicas, sostenida por el compromiso
            de víctimas, profesionales y ciudadanos.
          </p>
        </div>
        <div className="reveal" style={{ position:'relative', paddingLeft:28 }}>
          <div style={{ position:'absolute', left:6, top:8, bottom:8, width:2, background:'var(--uj-navy-100)' }} />
          {hitos.map(([y,t,d],i)=>(
            <div key={y} style={{ position:'relative', paddingBottom: i===hitos.length-1?0:30 }}>
              <div style={{ position:'absolute', left:-27, top:6, width:14, height:14, borderRadius:'50%', background:'#fff', border:'2px solid var(--uj-navy-600)' }} />
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:'var(--uj-navy-600)' }}>{y}</div>
              <div style={{ fontWeight:700, fontSize:16, margin:'2px 0 6px' }}>{t}</div>
              <div style={{ fontSize:14, color:'var(--fg-2)', lineHeight:1.6, maxWidth:540 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Trayectoria });
