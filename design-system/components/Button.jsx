import React from 'react';

export function Button({ variant = 'primary', size = 'md', children, href, onClick, style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer',
    borderRadius: 6, textDecoration: 'none', border: '1px solid transparent',
    transition: 'background 150ms var(--ease-out), color 150ms var(--ease-out)',
    fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14,
    padding: size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 24px' : '11px 18px',
  };
  const variants = {
    primary:   { background: 'var(--uj-navy-600)', color: '#fff' },
    secondary: { background: '#fff', color: 'var(--uj-navy-600)', borderColor: 'var(--uj-navy-600)' },
    ghost:     { background: 'transparent', color: 'var(--uj-navy-700)', textDecoration: 'underline', textUnderlineOffset: 4 },
    danger:    { background: 'var(--uj-error, #B3261E)', color: '#fff' },
  };
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick} style={{ ...base, ...(variants[variant] || variants.primary), ...style }}>
      {children}
    </Tag>
  );
}
