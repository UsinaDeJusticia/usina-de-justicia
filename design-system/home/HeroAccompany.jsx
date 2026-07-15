// HERO — Acompañamiento. Cálido, foco en el familiar que recién llega.
function HeroAccompany({ tweaks }) {
  return (
    <section style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, var(--uj-navy-50) 0%, #fff 100%)',
    }}>
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 880, margin: '0 auto' }}>
        <div className="reveal">
          <div className="uj-eyebrow" style={{ color: 'var(--uj-navy-700)', marginBottom: 22 }}>
            Ante la pérdida de un ser querido por un hecho de inseguridad
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(44px, 6vw, 86px)', lineHeight: 1.0,
            letterSpacing: '-0.02em', color: 'var(--uj-navy-800)', margin: 0,
          }}>
            Usina de Justicia<br />te acompaña.
          </h1>
          <p className="uj-body-lg" style={{ margin: '28px auto 0', maxWidth: 640, fontSize: 19, color: 'var(--fg-2)' }}>
            Muchos de quienes conformamos Usina estuvimos allí, en ese lugar oscuro
            en el que ninguna víctima eligió ni debería estar.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 36, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#quehacer" className="cta-primary">¿Qué hacer en primer lugar?</a>
            <a href="tel:+5411" className="cta-ghost">Contactarnos ahora</a>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { HeroAccompany });
