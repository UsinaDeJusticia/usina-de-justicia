function TweaksUJ({ tweaks, set }) {
  return (
    <div style={{
      position:'fixed', right:20, bottom:20, zIndex:100,
      background:'#fff', border:'1px solid var(--border-1)', borderRadius:10,
      boxShadow:'var(--shadow-lg)', padding:16, width:280, fontFamily:'var(--font-body)'
    }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--uj-navy-700)', marginBottom:12 }}>Tweaks</div>

      <Field label="Variación del hero">
        <Segmented value={tweaks.variant} onChange={v=>set('variant',v)} options={[
          { k:'editorial', l:'Editorial' },
          { k:'acompany',  l:'Acompaña' },
          { k:'data',      l:'Datos' },
        ]} />
      </Field>

      <Field label="Densidad">
        <Segmented value={tweaks.density} onChange={v=>set('density',v)} options={[
          { k:'compacto', l:'Compacto' },
          { k:'amplio',   l:'Amplio' },
        ]} />
      </Field>

      <Field label="Retratos de víctimas">
        <Toggle checked={tweaks.portraits} onChange={v=>set('portraits',v)} />
      </Field>

      <Field label="Acento cálido (ámbar)">
        <Toggle checked={tweaks.accentWarm} onChange={v=>set('accentWarm',v)} />
      </Field>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-2)', marginBottom:6 }}>{label}</div>
      {children}
    </div>
  );
}
function Segmented({ value, options, onChange }) {
  return (
    <div style={{ display:'flex', background:'var(--uj-grey-100)', padding:2, borderRadius:6 }}>
      {options.map(o=>(
        <button key={o.k} onClick={()=>onChange(o.k)} style={{
          all:'unset', flex:1, textAlign:'center', padding:'6px 0', fontSize:12, fontWeight:700,
          borderRadius:4, cursor:'pointer',
          background: value===o.k ? '#fff':'transparent',
          color: value===o.k ? 'var(--uj-navy-800)':'var(--fg-2)',
          boxShadow: value===o.k ? 'var(--shadow-sm)':'none'
        }}>{o.l}</button>
      ))}
    </div>
  );
}
function Toggle({ checked, onChange }) {
  return (
    <button onClick={()=>onChange(!checked)} style={{
      all:'unset', cursor:'pointer', width:40, height:22, borderRadius:999,
      background: checked? 'var(--uj-navy-600)' : 'var(--uj-grey-300)',
      position:'relative', transition:'background 150ms'
    }}>
      <span style={{ position:'absolute', top:2, left: checked?20:2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 150ms' }} />
    </button>
  );
}
Object.assign(window, { TweaksUJ });
