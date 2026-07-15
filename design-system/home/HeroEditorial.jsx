// HERO — Editorial (default). Tipográfico, institucional, emotional restrain.
function HeroEditorialUJ({ tweaks }) {
  return (
    <section style={{ padding: '80px 0 72px', background: 'var(--uj-ivory)', borderBottom: '1px solid var(--border-1)' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 64, alignItems: 'center' }}>
        <div className="reveal">
          <div className="uj-eyebrow" style={{ marginBottom: 18 }}>Asociación Civil · desde 2014</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(40px, 5.4vw, 76px)', lineHeight: 1.02,
            letterSpacing: '-0.015em', color: 'var(--uj-navy-900)', margin: 0,
          }}>
            Una justicia justa<br />
            <span style={{ color: 'var(--uj-navy-600)' }}>para las víctimas.</span>
          </h1>
          <p className="uj-body-lg" style={{ maxWidth: 520, marginTop: 22, color: 'var(--fg-2)' }}>
            Acompañamos a las familias que perdieron a un ser querido por un hecho de inseguridad,
            con contención emocional y asesoramiento legal. Trabajamos contra la impunidad
            y por los derechos de las víctimas en el proceso penal.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
            <a href="#acompany" className="cta-primary">Si perdiste a un ser querido →</a>
            <a href="#observatorio" className="cta-ghost">Ver el observatorio</a>
          </div>
        </div>
        <div className="reveal" style={{ position: 'relative' }}>
          <div style={{
            aspectRatio: '4/5', borderRadius: 4,
            background: "linear-gradient(180deg, rgba(16,27,42,0) 30%, rgba(16,27,42,0.55) 100%), center/cover no-repeat url('https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=900')",
            boxShadow: 'var(--shadow-md)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding: 28, color:'#fff' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85 }}>Testimonio</div>
              <blockquote style={{ margin:'6px 0 0', fontFamily:'var(--font-display)', fontSize:22, fontStyle:'italic', lineHeight:1.35, fontWeight:400 }}>
                “Murió en agosto, y cuando ese mes llegó a su fin, yo no hacía más que pensar ¿cómo voy a poder pasar a septiembre quedándose él en agosto?”
              </blockquote>
              <div style={{ fontSize:12, marginTop:10, opacity:.8 }}>— David Grossman, citado por UJ</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .cta-primary { display:inline-flex; align-items:center; gap:8px; font-weight:700; font-size:15px;
          background: var(--uj-navy-600); color:#fff; padding: 14px 22px; border-radius: 6px;
          text-decoration:none; transition: background 150ms var(--ease-out); }
        .cta-primary:hover { background: var(--uj-navy-800); }
        .cta-ghost { display:inline-flex; align-items:center; gap:8px; font-weight:700; font-size:15px;
          color: var(--uj-navy-700); padding: 14px 22px; border-radius: 6px;
          text-decoration:underline; text-underline-offset:4px; }
      `}</style>
    </section>
  );
}
Object.assign(window, { HeroEditorialUJ });
