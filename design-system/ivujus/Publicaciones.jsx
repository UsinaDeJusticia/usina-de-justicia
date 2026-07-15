function Publicaciones({ tweaks }) {
  const featured = {
    tipo: 'Libro · 2024',
    titulo: 'Nuevos paradigmas para la justicia penal',
    autores: 'Diana Cohen Agrest (comp.) · con aportes del claustro IVUJUS',
    extracto: 'Un balance de diez años de práctica y pensamiento victimológico en Argentina. Reúne ensayos sobre la Ley 27.372, el rol de la querella, la reparación integral y el lugar del duelo en el proceso penal.',
  };
  const papers = [
    { t:'Revictimización en el proceso penal argentino',               a:'Wlasic, J.C. · Cohen Agrest, D.', y:'2025', k:'Paper' },
    { t:'Amicus curiae y derechos de la víctima: balance 2017–2024',   a:'Equipo IVUJUS',                    y:'2025', k:'Informe' },
    { t:'Duelo traumático y acompañamiento judicial',                  a:'Bleichmar, S. (post.) · equipo clínico UJ', y:'2024', k:'Paper' },
    { t:'Implementación federal de la Ley 27.372',                     a:'Observatorio UJ · IVUJUS',         y:'2024', k:'Informe' },
    { t:'La víctima en el juicio por jurados',                         a:'Rafecas, D.',                      y:'2023', k:'Paper' },
    { t:'Femicidio: tipologías y tratamiento procesal',                a:'Cohen Agrest, D. · Kogan, H.',     y:'2023', k:'Paper' },
  ];
  return (
    <section id="publicaciones" style={{ padding:'104px 0', background:'var(--ivu-parchment)', borderTop:'1px solid var(--border-1)' }}>
      <div className="ivu-wrap">
        <div className="reveal" style={{ maxWidth:760, marginBottom:56 }}>
          <div className="ivu-eyebrow">Investigación y publicaciones</div>
          <h2 className="ivu-serif" style={{ fontSize:'clamp(34px,3.6vw,52px)', lineHeight:1.08, margin:'14px 0 18px', color:'var(--ivu-ink)' }}>
            Pensar la victimología desde <em style={{ fontStyle:'italic', color:'var(--ivu-bordeaux-700)' }}>la evidencia</em>.
          </h2>
          <p style={{ fontFamily:'var(--ivu-serif)', fontSize:19, lineHeight:1.6, color:'var(--fg-2)', margin:0 }}>
            El instituto publica libros, papers e informes que alimentan el debate público y
            el trabajo de incidencia de Usina de Justicia.
          </p>
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:56, alignItems:'start', marginBottom:48 }}>
          {/* Featured book */}
          <article style={{ background:'#fff', border:'1px solid var(--border-2)', padding:0, display:'flex' }}>
            <div style={{
              width:180, flexShrink:0,
              background:'linear-gradient(180deg, var(--ivu-bordeaux-800) 0%, var(--ivu-bordeaux-600) 100%)',
              color:'#fff', padding:'28px 22px', display:'flex', flexDirection:'column', justifyContent:'space-between',
              borderRight:'1px solid var(--border-2)',
            }}>
              <div className="ivu-serif" style={{ fontSize:18, lineHeight:1.2, fontWeight:700, fontStyle:'italic' }}>
                Nuevos paradigmas para la justicia penal
              </div>
              <div style={{ fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--ivu-ochre-100)' }}>IVUJUS · 2024</div>
            </div>
            <div style={{ padding:'28px 30px', flex:1 }}>
              <div className="ivu-eyebrow" style={{ color:'var(--fg-3)' }}>{featured.tipo}</div>
              <h3 className="ivu-serif" style={{ fontSize:24, lineHeight:1.2, margin:'12px 0 8px', color:'var(--ivu-ink)' }}>{featured.titulo}</h3>
              <div style={{ fontSize:13, fontStyle:'italic', fontFamily:'var(--ivu-serif)', color:'var(--fg-2)', marginBottom:14 }}>{featured.autores}</div>
              <p style={{ fontSize:14, lineHeight:1.65, color:'var(--fg-2)', margin:'0 0 20px' }}>{featured.extracto}</p>
              <a href="#" className="ivu-cta-ghost" style={{ fontSize:13 }}>Ver ficha del libro →</a>
            </div>
          </article>

          {/* Papers list */}
          <div>
            <div className="ivu-eyebrow" style={{ color:'var(--fg-3)', marginBottom:14 }}>Últimas publicaciones</div>
            <div style={{ borderTop:'1px solid var(--border-2)' }}>
              {papers.map(p=>(
                <a key={p.t} href="#" style={{
                  display:'grid', gridTemplateColumns:'56px 1fr 70px', gap:16, alignItems:'start',
                  padding:'16px 0', borderBottom:'1px solid var(--border-2)', textDecoration:'none', color:'var(--ivu-ink)'
                }}>
                  <div style={{ fontSize:10, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ivu-bordeaux-700)', fontWeight:700, paddingTop:3 }}>{p.k}</div>
                  <div>
                    <div className="ivu-serif" style={{ fontSize:15, fontWeight:700, lineHeight:1.35, color:'var(--ivu-ink)' }}>{p.t}</div>
                    <div style={{ fontSize:12, color:'var(--fg-2)', fontStyle:'italic', fontFamily:'var(--ivu-serif)', marginTop:4 }}>{p.a}</div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--fg-3)', fontVariantNumeric:'tabular-nums', textAlign:'right', paddingTop:3 }}>{p.y}</div>
                </a>
              ))}
            </div>
            <div style={{ marginTop:18, textAlign:'right' }}>
              <a href="#" className="ivu-cta-ghost" style={{ fontSize:13 }}>Ver repositorio completo →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Publicaciones });
