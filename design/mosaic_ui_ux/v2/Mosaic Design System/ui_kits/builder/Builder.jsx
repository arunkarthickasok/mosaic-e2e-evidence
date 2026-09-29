const MB = window.MosaicDesignSystem_9c1bff;

function useWidth(ref) {
  const [w, setW] = React.useState(800);
  React.useLayoutEffect(() => { if (!ref.current) return; const ro = new ResizeObserver(e => setW(e[0].contentRect.width)); ro.observe(ref.current); return () => ro.disconnect(); }, []);
  return w;
}

function Builder({ vp, theme, canvas, rail, palette, setPalette, sync = 'synced', onRevert, counts = [14, 2], wcag = 'AA · 0 issues', dataState, setDataState, errorSummary, keyboardBar, height, stale, onRailChange, overlay }) {
  const mob = vp === 'mobile', tab = vp === 'tablet';
  const [cvp, setCvp] = React.useState('d');
  const areaRef = React.useRef(null);
  const aw = useWidth(areaRef);
  const pad = mob ? 12 : 24;
  const pw = cvp === 'm' ? Math.min(375, aw - pad * 2) : cvp === 't' ? Math.min(640, aw - pad * 2) : aw - pad * 2;
  const H = height || (mob ? 700 : tab ? 860 : 800);
  const sheet = mob && (rail || palette);
  return <div className="mosaic" data-mosaic-theme={theme} style={{ height: H, display: 'flex', flexDirection: 'column', border: '1px solid var(--mos-border-default)', borderRadius: 8, overflow: 'hidden', background: 'var(--mos-surface-chrome)', position: 'relative', boxShadow: 'var(--mos-shadow-sm)' }}>
    <div style={{ height: 44, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', borderBottom: '1px solid var(--mos-border-subtle)' }}>
      {mob ? <MB.Button size="sm" variant="primary" icon="plus" onClick={() => setPalette && setPalette(!palette)}>Add</MB.Button> : <span style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 4 }}><span style={{ font: '600 13px/1 var(--mos-font-sans)', color: 'var(--mos-text-strong)', letterSpacing: '-.01em' }}>Mosaic</span><span className="mos-index">LAYOUT</span></span>}
      <span style={{ display: 'flex' }}><MB.IconButton size="sm" icon="undo-2" label="Undo" /><MB.IconButton size="sm" icon="redo-2" label="Redo" /></span>
      <span style={{ flex: 1 }} />
      <MB.Segmented label="Canvas viewport" size="sm" value={cvp} onChange={setCvp} options={[{ id: 'd', icon: 'monitor', label: mob ? '' : 'Desktop', title: 'Desktop' }, { id: 't', icon: 'tablet', label: mob ? '' : 'Tablet', title: 'Tablet' }, { id: 'm', icon: 'smartphone', label: mob ? '' : 'Mobile', title: 'Mobile' }]} />
      <span style={{ flex: 1 }} />
      {dataState && !mob && <MB.Segmented label="Data state" size="sm" value={dataState} onChange={setDataState} options={[{ id: 'pop', label: 'Populated' }, { id: 'one', label: 'One item' }, { id: 'empty', label: 'Empty' }, { id: 'fail', label: 'Failing' }]} />}
      {!mob && <MB.IconButton size="sm" icon="maximize-2" label="Focus mode" />}
      {mob && <MB.IconButton size="sm" icon="more-horizontal" label="More" />}
    </div>
    {dataState && mob && <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--mos-border-subtle)', overflow: 'auto' }}><MB.Segmented label="Data state" size="sm" value={dataState} onChange={setDataState} options={[{ id: 'pop', label: 'Populated' }, { id: 'one', label: 'One' }, { id: 'empty', label: 'Empty' }, { id: 'fail', label: 'Failing' }]} /></div>}
    {errorSummary}
    <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
      {!mob && <div style={{ width: 48, flex: 'none', borderRight: '1px solid var(--mos-border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0' }}>
        <MB.IconButton icon="blocks" label="Components" pressed={!!palette} onClick={() => setPalette && setPalette(!palette)} />
        <MB.IconButton icon="list-tree" label="Outline" />
        <span style={{ flex: 1 }} />
        <MB.IconButton icon="keyboard" label="Keyboard shortcuts" size="sm" />
      </div>}
      {palette && !mob && !tab && <div style={{ width: 264, flex: 'none', borderRight: '1px solid var(--mos-border-subtle)', minHeight: 0 }}><Palette onClose={() => setPalette(false)} /></div>}
      <div ref={areaRef} style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'var(--mos-surface-canvas)', padding: pad + 'px ' + pad + 'px ' + (sheet ? 380 : pad) + 'px', paddingTop: pad + 30 }}>
        {keyboardBar}
        <div className={stale ? 'mos-stale' : 'mos-fresh'} key={stale ? 's' : 'f'} style={{ minHeight: '100%' }}>{canvas(pw)}</div>
      </div>
      {rail && !mob && !tab && <div onChangeCapture={onRailChange} style={{ width: 320, flex: 'none', borderLeft: '1px solid var(--mos-border-subtle)', minHeight: 0 }}>{rail}</div>}
      {rail && tab && <div onChangeCapture={onRailChange} style={{ position: 'absolute', top: 8, right: 8, bottom: 8, width: 320, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--mos-border-default)', boxShadow: 'var(--mos-shadow-lg)', zIndex: 10 }}>{rail}</div>}
      {palette && tab && <div style={{ position: 'absolute', top: 8, left: 56, bottom: 8, width: 280, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--mos-border-default)', boxShadow: 'var(--mos-shadow-lg)', zIndex: 11 }}><Palette onClose={() => setPalette(false)} /></div>}
      {sheet && <div onChangeCapture={onRailChange} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '62%', background: 'var(--mos-surface-chrome)', borderTop: '1px solid var(--mos-border-default)', borderRadius: '12px 12px 0 0', boxShadow: 'var(--mos-shadow-dialog)', zIndex: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 2px', flex: 'none' }}><span style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--mos-border-strong)' }} /></div>
        <div style={{ flex: 1, minHeight: 0 }}>{palette ? <Palette onClose={() => setPalette(false)} /> : rail}</div>
      </div>}
    </div>
    <div style={{ height: 32, flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', borderTop: '1px solid var(--mos-border-subtle)', background: 'var(--mos-surface-chrome)', overflow: 'hidden' }}>
      <MB.SyncStatus state={stale ? 'stale' : sync} onRevert={onRevert} components={mob ? undefined : counts[0]} bound={mob ? undefined : counts[1]} />
      <span style={{ flex: 1 }} />
      {!mob && <span className="mos-help" style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}><MB.Icon name="accessibility" size={12} />{wcag}</span>}
      {!mob && !tab && <span className="mos-help" style={{ whiteSpace: 'nowrap' }}><span className="mos-kbd">M</span> move · <span className="mos-kbd">?</span> shortcuts</span>}
    </div>
    {overlay}
  </div>;
}

function ErrorSummary({ onJump, vp }) {
  const items = [
    { t: 'Teaser (Olivero) needs content in its Content area', a: 'Go to area' },
    { t: 'Card (Civic UI) image needs alt text', a: 'Fix alt text', alt: true },
    { t: 'Plain content can only be placed inside another component\u2019s area', a: 'Show me' }
  ];
  return <div role="alert" tabIndex={-1} style={{ padding: '10px 12px', borderBottom: '1px solid var(--mos-state-blocked-border)', background: 'var(--mos-state-blocked-bg)', flex: 'none' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><MB.Icon name="circle-alert" size={16} style={{ color: 'var(--mos-state-blocked-fg)' }} /><b style={{ font: 'var(--mos-type-ui-strong)', color: 'var(--mos-text-strong)' }}>3 things to fix before this page can be saved</b><span className="mos-help" style={{ marginLeft: 'auto' }}>{vp === 'mobile' ? '' : 'Your changes are kept.'}</span></div>
    <ol style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>{items.map(i => <li key={i.t} style={{ font: 'var(--mos-type-ui)', color: 'var(--mos-text-default)' }}><span>{i.t}</span> <button className="mos-btn mos-btn--link" style={{ fontSize: 12, marginLeft: 6 }} onClick={() => onJump && onJump(i)}>{i.a}</button></li>)}</ol>
  </div>;
}

function KeyboardBar({ vp }) {
  return <div className="mosaic" style={{ position: 'sticky', top: -24, zIndex: 25, margin: '-24px 0 16px', display: 'flex', justifyContent: 'center' }}>
    <div role="status" aria-live="assertive" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 8px 7px 12px', borderRadius: 8, background: 'var(--mos-surface-inverse)', color: 'var(--mos-text-inverse)', boxShadow: 'var(--mos-shadow-lg)', font: 'var(--mos-type-ui)', flexWrap: 'wrap', maxWidth: '100%' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MB.Icon name="move" size={14} /><b>Moving Card</b> · before “Work-zone safety”, position 1 of 3 in Card row</span>
      {vp !== 'mobile' && <span style={{ display: 'flex', gap: 10, opacity: .85, fontSize: 12 }}><span>↑↓ move</span><span>→ into Footer</span><span>← out of Card row</span><span>Enter drop</span><span>Esc cancel</span></span>}
      {vp === 'mobile' && <span style={{ display: 'flex', gap: 4 }}>{['arrow-up', 'arrow-down', 'arrow-right', 'arrow-left'].map(i => <button key={i} className="mos-seltool__btn" style={{ width: 44, height: 44 }} aria-label={i.replace('arrow-', 'Move ')}><MB.Icon name={i} size={16} /></button>)}</span>}
      <span style={{ display: 'flex', gap: 4 }}><button className="mos-toast__action">Drop</button><button className="mos-toast__action" style={{ color: 'inherit', opacity: .8 }}>Cancel</button></span>
    </div>
  </div>;
}

Object.assign(window, { Builder, ErrorSummary, KeyboardBar, useWidth });
