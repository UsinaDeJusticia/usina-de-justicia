import React from 'react';

/** Etiqueta de estado / categoría — navy, ocre (IVUJUS), neutral o semántica. */
export function Badge({ tone = 'navy', children, style }) {
  const tones = {
    navy:    { background: 'var(--uj-navy-50)',  color: 'var(--uj-navy-700)',  border: '1px solid var(--uj-navy-100)' },
    ochre:   { background: 'var(--ivu-ochre-50, #FAF4E3)', color: 'var(--ivu-ochre-600, #A06E0F)', border: '1px solid var(--ivu-ochre-100, #F4E7C8)' },
    neutral: { background: 'var(--uj-grey-100, #F2F3F5)', color: 'var(--fg-2)', border: '1px solid var(--border-1)' },
    solid:   { background: 'var(--uj-navy-600)', color: '#fff', border: '1px solid var(--uj-navy-600)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11.5,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '4px 10px', borderRadius: 999,
      ...(tones[tone] || tones.navy), ...style,
    }}>{children}</span>
  );
}
