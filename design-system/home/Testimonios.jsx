function Testimonios({ tweaks }) {
  const v = [
    { n:'Néstor Alejandro Valdez', d:'asesinado en enero de 2012', e:'CABA' },
    { n:'Zoe Nerea Cortez',        d:'asesinada en marzo de 2020', e:'Santa Fe' },
    { n:'Pablo Flores',            d:'asesinado en octubre de 2020', e:'La Plata' },
    { n:'Lucinda Palavecino',      d:'asesinada en julio de 2020', e:'Tucumán' },
    { n:'Emiliano Pereyra Suárez', d:'asesinado en agosto de 2019', e:'Córdoba' },
    { n:'Nadia Arrieta',           d:'asesinada en marzo de 2018', e:'Chaco' },
    { n:'Jonathan Lucas Gómez',    d:'asesinado en marzo de 2020', e:'CABA' },
    { n:'Isaías Aranda',           d:'asesinado en octubre de 2018', e:'Salta' },
  ];
  return (
    <section style={{ padding:'96px 0', background:'var(--uj-ivory)', borderTop:'1px solid var(--border-1)' }}>
      <div className="wrap">
        <div className="reveal" style={{ maxWidth:760, marginBottom:48 }}>
          <div className="uj-eyebrow">Testimonios</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(30px,3.2vw,44px)', margin:'10px 0 14px' }}>
            Dar voz a los que ya no la tienen.
          </h2>
          <p style={{ fontSize:16, color:'var(--fg-2)', lineHeight:1.6, margin:0 }}>
            Cada nombre, cada fecha. Porque detrás de cada caso hay una familia que espera una
            respuesta de la justicia — y una sociedad que no puede mirar para otro lado.
          </p>
        </div>
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
          {v.map((p, i) => (
            <div key={i} style={{ background:'#fff', border:'1px solid var(--border-1)' }}>
              <div style={{
                aspectRatio:'3/4',
                background:`linear-gradient(180deg, var(--uj-navy-200) 0%, var(--uj-navy-400) 100%)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'rgba(255,255,255,.6)', fontFamily:'var(--font-display)', fontWeight:700, fontSize:46
              }}>
                {p.n.split(' ').slice(0,2).map(x=>x[0]).join('')}
              </div>
              <div style={{ padding:'16px 18px 18px' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--fg-1)', lineHeight:1.25 }}>{p.n}</div>
                <div style={{ fontSize:12, color:'var(--fg-2)', marginTop:6 }}>{p.d}</div>
                <div style={{ fontSize:11, color:'var(--fg-3)', marginTop:2, textTransform:'uppercase', letterSpacing:'.08em', fontWeight:700 }}>{p.e}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:36 }}>
          <a href="#" style={{ color:'var(--uj-navy-600)', fontWeight:700, fontSize:14, textDecoration:'underline', textUnderlineOffset:4 }}>
            Ver todos los testimonios →
          </a>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Testimonios });
