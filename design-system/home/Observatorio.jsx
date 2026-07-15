function Observatorio({ tweaks }) {
  const bars = [
    { k:'CABA',v:82 },{ k:'Bs. As.',v:100 },{ k:'Santa Fe',v:64 },{ k:'Córdoba',v:52 },
    { k:'Tucumán',v:38 },{ k:'Salta',v:31 },{ k:'Mendoza',v:28 },{ k:'Otras',v:46 },
  ];
  const max = 100;
  return (
    <section id="observatorio" style={{ padding:'96px 0', background:'#fff' }}>
      <div className="wrap">
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:56, alignItems:'center' }}>
          <div>
            <div className="uj-eyebrow">Observatorio de víctimas</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(30px,3.2vw,44px)', margin:'10px 0 16px', color:'var(--fg-1)' }}>
              Sin datos no hay política pública.
            </h2>
            <p style={{ fontSize:16, lineHeight:1.7, color:'var(--fg-2)' }}>
              Relevamos, analizamos y publicamos información sobre homicidios, femicidios y el funcionamiento
              del sistema penal en las 24 jurisdicciones. Lo hacemos junto a las cámaras de Diputados de Santa Fe
              y la Ciudad de Buenos Aires.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:24 }}>
              {[
                ['Informe anual 2025', 'PDF · 82 páginas'],
                ['Amicus curiae presentados', '14 · 2 admitidos en 2026'],
                ['Base pública de sentencias', '1.204 resoluciones indexadas'],
              ].map(([t,s])=>(
                <a key={t} href="#" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 4px', borderBottom:'1px solid var(--border-1)', textDecoration:'none', color:'var(--fg-1)' }}
                   onMouseEnter={e=>e.currentTarget.style.background='var(--uj-navy-50)'}
                   onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <i data-lucide="file-text" style={{ width:18, height:18, color:'var(--uj-navy-600)' }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{t}</div>
                    <div style={{ fontSize:12, color:'var(--fg-3)' }}>{s}</div>
                  </div>
                  <i data-lucide="arrow-up-right" style={{ width:16, height:16, color:'var(--fg-3)' }} />
                </a>
              ))}
            </div>
          </div>
          <div style={{ background:'var(--uj-navy-50)', border:'1px solid var(--uj-navy-100)', padding:32, borderRadius:4 }}>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--uj-navy-700)' }}>Homicidios dolosos por jurisdicción · 2025</div>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${bars.length},1fr)`, gap:12, alignItems:'end', height:200, marginTop:28 }}>
              {bars.map(d=>(
                <div key={d.k} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--uj-navy-700)' }}>{d.v}</div>
                  <div style={{ width:'100%', height:`${d.v/max*160}px`, background:'var(--uj-navy-600)', borderRadius:'2px 2px 0 0' }} />
                  <div style={{ fontSize:11, color:'var(--fg-2)', textAlign:'center' }}>{d.k}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:20, fontSize:11, color:'var(--fg-3)', borderTop:'1px solid var(--uj-navy-100)', paddingTop:14 }}>
              Fuente: relevamiento propio UJ + Ministerio de Seguridad. Tasas cada 100.000 habitantes.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Observatorio });
