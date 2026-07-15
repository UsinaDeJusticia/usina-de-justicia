function Programa({ tweaks }) {
  const modulos = [
    { n:'01', t:'Fundamentos de Victimología', h:'12 h', c:['Historia de la disciplina','Víctima, delito y daño','Modelos victimológicos contemporáneos'] },
    { n:'02', t:'Marco jurídico nacional',     h:'18 h', c:['Ley 27.372 — derechos y garantías','Proceso penal y querella','Reparación integral'] },
    { n:'03', t:'Marco internacional y DDHH',  h:'12 h', c:['Sistema Interamericano','Principios de la ONU','Jurisprudencia CIDH sobre víctimas'] },
    { n:'04', t:'Homicidio y femicidio',       h:'16 h', c:['Tipologías','Investigación forense','Tratamiento en el proceso'] },
    { n:'05', t:'Trauma, duelo y proceso',     h:'14 h', c:['Psicología del duelo violento','Revictimización','Acompañamiento interdisciplinario'] },
    { n:'06', t:'Seminario integrador',        h:'10 h', c:['Trabajo final','Defensa','Publicación en repositorio IVUJUS'] },
  ];

  return (
    <section id="programa" style={{ padding: '104px 0', background: 'var(--ivu-parchment)', borderTop: '1px solid var(--border-1)' }}>
      <div className="ivu-wrap">
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 56, alignItems:'end', marginBottom: 56 }}>
          <div>
            <div className="ivu-eyebrow">Programa académico</div>
            <h2 className="ivu-serif" style={{ fontSize: 'clamp(34px, 3.6vw, 52px)', lineHeight: 1.08, margin: '14px 0 0', color: 'var(--ivu-ink)' }}>
              Seis módulos,<br />un año académico.
            </h2>
          </div>
          <div>
            <div style={{ display:'flex', flexDirection:'column', gap:14, fontSize: 14, color:'var(--fg-2)' }}>
              <Meta k="Duración" v="Marzo – Noviembre" />
              <Meta k="Modalidad" v="Híbrida · 16 encuentros" />
              <Meta k="Carga horaria" v="82 horas" />
              <Meta k="Certificación" v="IVUJUS · aval académico UBA (en trámite)" />
            </div>
          </div>
        </div>

        <div className="reveal" style={{ background:'#fff', border:'1px solid var(--border-2)' }}>
          {modulos.map((m, i) => (
            <article key={m.n} style={{
              display:'grid', gridTemplateColumns:'84px 1.2fr 2.4fr 80px',
              gap: 28, padding: '28px 32px',
              borderTop: i===0 ? 'none' : '1px solid var(--border-1)', alignItems:'start'
            }}>
              <div className="ivu-serif" style={{ fontSize: 28, fontWeight: 400, fontStyle:'italic', color: 'var(--ivu-bordeaux-700)', lineHeight: 1 }}>{m.n}</div>
              <div>
                <h3 className="ivu-serif" style={{ fontSize: 20, lineHeight:1.25, margin: 0, color: 'var(--ivu-ink)', fontWeight:700 }}>{m.t}</h3>
              </div>
              <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap: 6 }}>
                {m.c.map(item => (
                  <li key={item} style={{ fontSize: 14, lineHeight: 1.5, color:'var(--fg-2)', display:'flex', gap:10, alignItems:'baseline' }}>
                    <span style={{ width:6, height:6, background:'var(--ivu-ochre)', flexShrink:0, transform:'translateY(-3px)' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: 12, letterSpacing: '.1em', textTransform:'uppercase', color:'var(--fg-3)', fontWeight:700, textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{m.h}</div>
            </article>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 40, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap: 16 }}>
          <div style={{ fontFamily:'var(--ivu-serif)', fontStyle:'italic', fontSize: 16, color:'var(--fg-2)' }}>
            El programa detallado, bibliografía y fechas disponibles en el documento oficial.
          </div>
          <div style={{ display:'flex', gap: 14 }}>
            <a href="#" className="ivu-cta-ghost">Descargar programa (PDF)</a>
            <a href="#inscripcion" className="ivu-cta">Inscribirme</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Meta({ k, v }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', gap:16, borderTop:'1px solid var(--border-1)', paddingTop:10 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--ivu-bordeaux-700)' }}>{k}</div>
      <div style={{ fontFamily:'var(--ivu-serif)', fontSize: 16, color:'var(--ivu-ink)', fontWeight: 600 }}>{v}</div>
    </div>
  );
}
Object.assign(window, { Programa });
