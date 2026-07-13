function IvuTweaks({ tweaks, set }) {
  return (
    <div style={{
      position:'fixed', right:20, bottom:20, zIndex:100,
      background:'#fff', border:'1px solid var(--border-1)', borderRadius: 4,
      boxShadow:'var(--shadow-lg)', padding: 18, width: 280,
      fontFamily:'var(--font-body)', borderTop:'3px solid var(--ivu-bordeaux-700)'
    }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.2em', textTransform:'uppercase', color:'var(--ivu-bordeaux-700)', marginBottom: 14 }}>Tweaks</div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color:'var(--fg-2)', marginBottom: 8 }}>Variación del hero</div>
        <div style={{ display:'flex', background:'var(--uj-grey-100)', padding: 2, borderRadius: 3 }}>
          {[
            { k:'editorial', l:'Editorial' },
            { k:'authority', l:'Autoridad' },
          ].map(o => (
            <button key={o.k} onClick={() => set('variant', o.k)} style={{
              all:'unset', flex:1, textAlign:'center', padding:'8px 0', fontSize: 12, fontWeight:700, cursor:'pointer',
              borderRadius: 2,
              background: tweaks.variant === o.k ? '#fff' : 'transparent',
              color: tweaks.variant === o.k ? 'var(--ivu-bordeaux-700)' : 'var(--fg-2)',
              boxShadow: tweaks.variant === o.k ? 'var(--shadow-sm)' : 'none',
            }}>{o.l}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 4, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color:'var(--fg-1)' }}>Mostrar barra UJ</div>
        <button onClick={() => set('showUJLockup', !tweaks.showUJLockup)} style={{
          all:'unset', cursor:'pointer', width: 40, height: 22, borderRadius: 999,
          background: tweaks.showUJLockup ? 'var(--ivu-bordeaux-700)' : 'var(--uj-grey-300)',
          position:'relative', transition:'background 150ms'
        }}>
          <span style={{ position:'absolute', top:2, left: tweaks.showUJLockup ? 20 : 2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 150ms' }} />
        </button>
      </div>
    </div>
  );
}
Object.assign(window, { IvuTweaks });
