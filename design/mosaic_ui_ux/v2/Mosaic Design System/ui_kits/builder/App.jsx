const MX = window.MosaicDesignSystem_9c1bff;
const SIZES = { desktop: [1440, 1000], tablet: [834, 1112], mobile: [390, 844] };
const ACC0 = [{ id: 'a', summary: 'Who is eligible?', meta: 'Accordion item · 1 paragraph' }, { id: 'b', summary: 'How do I apply?', meta: 'Accordion item · empty' }];

const SCREENS = [
  { id: 'builder', n: '01', t: 'Builder in the node form', why: 'The builder is one field in the Drupal form, so the palette folds to a 48px strip and the canvas gets the width. The rail shows only the sections a Civic UI Card can use, under the line saying who owns its styling.' },
  { id: 'fe', n: '02', t: 'Front-end edit dialog', why: 'The same RailCard component as screen 1, docked beside the live page. It is non-modal, so the page stays readable and every rail section works the same in both places.' },
  { id: 'accordion', n: '03', t: 'Accordion · repeater', why: 'A single-child slot becomes a repeater list in the rail. Rows are numbered in mono, reorder works with drag or keyboard, and a min/max banner appears only when a rule is broken.' },
  { id: 'bound', n: '04', t: 'Columns bound to a View', states: [['pop', 'Populated'], ['one', 'One item'], ['empty', 'Empty'], ['fail', 'Failing']], why: 'Indigo is used only for data. The result line under the area and the Data-state switcher let authors check the empty and failing cases before visitors see them.' },
  { id: 'palette', n: '05', t: 'Palette', states: [['full', 'All libraries'], ['empty', 'No results']], why: 'Grouped by library, then category, with Patterns last in each library. DATA and Attention badges appear only where they are true, and Attention always states its reason.' },
  { id: 'canvas', n: '06', t: 'Canvas states', states: [['all', 'Zone, picker, refused, toast'], ['empty', 'Empty canvas']], why: 'Inline controls instead of overlays. The picker anchors to the zone’s “+ Add”, a refused drop names what is allowed, and auto-wrap tells you where the item went, with Undo.' },
  { id: 'libraries', n: '07', t: 'Component libraries', admin: true, why: 'Admin screens use the same Mosaic tokens, set inside the Drupal admin page. Readiness grades sit next to their reasons, and living docs expand in place.' },
  { id: 'authoring', n: '08', t: 'Manage authoring · Field types', admin: true, why: 'Follows Drupal’s own manage-form-display pattern (table-drag, widget per row), so site builders already know it. Capabilities here decide which rail sections appear.' },
  { id: 'missing', n: '09', t: 'Library missing', states: [['visitor', 'Visitor'], ['editor', 'Editor'], ['builder', 'Builder'], ['report', 'Changes report']], why: 'Never a blank page. Visitors see the page without the component. Editors see a small notice. The builder keeps every value and binding, read-only.' },
  { id: 'errors', n: '10', t: 'Save errors · sync', states: [['errors', 'Save error'], ['unsaved', 'Unsaved'], ['revert', 'Revert'], ['synced', 'In sync']], why: 'Errors name the component, the area and the fix in the author’s words. Save moves focus to the first field that needs attention, and your changes are never discarded.' },
  { id: 'keyboard', n: '11', t: 'Keyboard move · admin themes', states: [['keyboard', 'Keyboard move'], ['themes', 'Claro · Gin · Custom']], why: 'Keyboard move changes the selection marks to indigo and states the current position aloud. The three-theme view shows the builder pixel-identical in each.' }
];

function useStored(key, init) {
  const [v, setV] = React.useState(() => { try { const s = JSON.parse(localStorage.getItem('mos-kit') || '{}'); return s[key] ?? init; } catch (e) { return init; } });
  React.useEffect(() => { try { const s = JSON.parse(localStorage.getItem('mos-kit') || '{}'); s[key] = v; localStorage.setItem('mos-kit', JSON.stringify(s)); } catch (e) {} }, [v]);
  return [v, setV];
}

function ScreenBody({ id, st, vp, theme, admin, ctx }) {
  const { acc, setAcc, accActive, setAccActive, pal, setPal, picker, setPicker, toast, setToast, stale, bump, setRich, altRef, setScreen, ds, setDs } = ctx;
  const form = (b, title) => <NodeForm admin={admin} vp={vp} title={title} onSave={() => setScreen('errors', 'errors')}>{b}</NodeForm>;
  const B = p => <Builder vp={vp} theme={theme} stale={stale} onRailChange={bump} sync={stale ? 'stale' : p.sync || 'synced'} {...p} />;
  switch (id) {
    case 'builder': return form(B({ canvas: pw => <CanvasCardRow pw={pw} compact={vp === 'mobile'} />, rail: <RailCard onOpenRich={() => setRich(true)} />, palette: pal, setPalette: setPal, sync: 'unsaved', onRevert: () => {} }));
    case 'fe': return <FrontEndEdit vp={vp} theme={theme} onOpenRich={() => setRich(true)} />;
    case 'accordion': return form(B({ canvas: pw => <CanvasAccordion pw={pw} items={acc} activeId={accActive} />, rail: <RailAccordion items={acc} setItems={setAcc} activeId={accActive} setActive={setAccActive} />, sync: 'unsaved', onRevert: () => {}, counts: [6, 0] }), 'Safety grant FAQ');
    case 'bound': return form(B({ canvas: pw => <CanvasBound pw={pw} ds={ds} />, rail: <RailColumns ds={ds} />, dataState: ds, setDataState: setDs, counts: [5, 1], wcag: ds === 'fail' ? 'AA · 0 issues · 1 data error' : 'AA · 0 issues' }), 'Road safety news');
    case 'palette': return form(B({ canvas: pw => <CanvasCardRow pw={pw} />, palette: <Palette key={st} query={st === 'empty' ? 'carousel' : ''} />, rail: null, setPalette: () => {} }));
    case 'canvas': return form(B({ canvas: pw => st === 'empty' ? <CanvasEmpty pw={pw} /> : <CanvasStates pw={pw} picker={picker} setPicker={setPicker} toast={toast} setToast={setToast} />, rail: null, palette: st === 'empty' && vp === 'desktop' ? true : false, setPalette: setPal, counts: st === 'empty' ? [0, 0] : [7, 0], sync: st === 'empty' ? 'synced' : 'unsaved', onRevert: () => {} }), 'Grant programs');
    case 'libraries': return <DrupalShell admin={admin} vp={vp} pageTitle="Component libraries" crumbs={['Home', 'Administration', 'Structure', 'Mosaic']}><LibrariesPage vp={vp} theme={theme} /></DrupalShell>;
    case 'authoring': return <DrupalShell admin={admin} vp={vp} pageTitle="Manage authoring: Card" crumbs={['Home', 'Structure', 'Mosaic', 'Component libraries', 'Civic UI']}><ManageAuthoring vp={vp} theme={theme} /></DrupalShell>;
    case 'missing':
      if (st === 'visitor' || st === 'editor') return <MissingPages vp={vp} theme={theme} mode={st} />;
      if (st === 'report') return <DrupalShell admin={admin} vp={vp} pageTitle="Library changes" crumbs={['Home', 'Reports', 'Mosaic']}><ChangesReport vp={vp} theme={theme} /></DrupalShell>;
      return form(B({ canvas: pw => <CanvasMissing pw={pw} />, rail: <Rail head={<RailHead crumbs={['Page', 'Card row', 'Card']} name="Card" lib="Civic UI · missing" grade="blocked" />}><div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}><MX.Banner tone="error" icon="triangle-alert" title="Removed — Civic UI isn't installed">Values and the “Latest news” binding are kept read-only. Reinstall the library, or remove this component.</MX.Banner><MX.Input label="Heading" readOnly defaultValue="Road Safety Initiative 2026" /><MX.Input label="Media" readOnly defaultValue="road-safety-hero.jpg" /><MX.Button variant="danger" icon="trash-2">Remove component</MX.Button></div></Rail>, wcag: 'AA · 1 component not rendering' }));
    case 'errors': {
      const overlay = st === 'revert' ? <div style={{ position: 'absolute', left: 12, bottom: 40, zIndex: 40 }}><div className="mos-picker" style={{ width: 300, padding: 14, gap: 10 }} role="alertdialog" aria-label="Revert to saved"><div className="mos-label">Revert to the saved layout?</div><div className="mos-help">Discards 3 changes made since 16:42. This can't be undone.</div><div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><MX.Button size="sm" onClick={() => setScreen('errors', 'unsaved')}>Keep editing</MX.Button><MX.Button size="sm" variant="primary" onClick={() => setScreen('errors', 'synced')}>Revert</MX.Button></div></div></div> : null;
      return form(B({ canvas: pw => <CanvasCardRow pw={pw} errors={st === 'errors'} />, rail: <RailCard errors={st === 'errors'} altRef={altRef} onOpenRich={() => setRich(true)} />, errorSummary: st === 'errors' ? <ErrorSummary vp={vp} onJump={i => i.alt && altRef.current && altRef.current.focus()} /> : null, sync: st === 'synced' ? 'synced' : 'unsaved', onRevert: () => setScreen('errors', 'revert'), wcag: st === 'errors' ? 'AA · 1 issue (alt text)' : 'AA · 0 issues', overlay, counts: st === 'synced' ? [14, 2] : [15, 2] }));
    }
    case 'keyboard': return form(B({ canvas: pw => <CanvasCardRow pw={pw} mode="keyboard" />, keyboardBar: <KeyboardBar vp={vp} />, rail: <RailCard />, sync: 'unsaved', onRevert: () => {} }));
  }
  return null;
}

function Frame({ w, h, scale, children, overlay, label }) {
  return <div style={{ width: w * scale, height: h * scale, flex: 'none', position: 'relative' }}>
    {label && <div className="mos-index" style={{ position: 'absolute', top: -18, left: 0 }}>{label}</div>}
    <div style={{ width: w, height: h, transform: 'scale(' + scale + ')', transformOrigin: '0 0', position: 'absolute', top: 0, left: 0, background: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,.08),0 12px 40px -12px rgba(0,0,0,.25)', borderRadius: 6, overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>{children}</div>
      {overlay}
    </div>
  </div>;
}

function App() {
  const [screen, setScreenId] = useStored('screen', 'builder');
  const [states, setStates] = useStored('states', {});
  const [vp, setVp] = useStored('vp', 'desktop');
  const [theme, setTheme] = useStored('theme', 'light');
  const [admin, setAdmin] = useStored('admin', 'claro');
  const [acc, setAcc] = React.useState(ACC0);
  const [accActive, setAccActive] = React.useState('b');
  const [pal, setPal] = React.useState(false);
  const [picker, setPicker] = React.useState(true);
  const [toast, setToast] = React.useState(true);
  const [stale, setStale] = React.useState(false);
  const [rich, setRich] = React.useState(false);
  const altRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const [sz, setSz] = React.useState([1000, 800]);
  React.useLayoutEffect(() => { const ro = new ResizeObserver(e => setSz([e[0].contentRect.width, e[0].contentRect.height])); ro.observe(stageRef.current); return () => ro.disconnect(); }, []);
  const S = SCREENS.find(s => s.id === screen) || SCREENS[0];
  const st = states[S.id] || (S.states && S.states[0][0]);
  const setScreen = (id, s) => { setScreenId(id); if (s) setStates(x => ({ ...x, [id]: s })); if (id === 'errors' && s === 'errors') setTimeout(() => altRef.current && altRef.current.focus(), 60); };
  const bump = () => { setStale(true); clearTimeout(window.__mosT); window.__mosT = setTimeout(() => setStale(false), 1400); };
  const ctx = { acc, setAcc, accActive, setAccActive, pal, setPal, picker, setPicker, toast, setToast, stale, bump, setRich, altRef, setScreen, ds: S.id === 'bound' ? st : 'pop', setDs: v => setStates(x => ({ ...x, bound: v })) };
  const three = S.id === 'keyboard' && st === 'themes';
  const [W, H] = SIZES[three ? 'desktop' : vp];
  const scale = three ? Math.min((sz[0] - 80) / (W * 3), (sz[1] - 80) / H) : Math.min(1, (sz[0] - 48) / W, (sz[1] - 56) / H);
  const overlay = rich ? <RichTextModal theme={theme} vp={vp} onClose={() => setRich(false)} /> : null;
  return <div style={{ display: 'flex', height: '100vh' }}>
    <aside className="mosaic" data-mosaic-theme={theme} style={{ width: 290, flex: 'none', background: 'var(--mos-surface-chrome)', borderRight: '1px solid var(--mos-border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'baseline', gap: 8 }}><span style={{ font: '600 17px/1 var(--mos-font-sans)', letterSpacing: '-.02em', color: 'var(--mos-text-strong)' }}>Mosaic</span><span className="mos-index">1.0 · AUTHORING UI KIT</span></div>
      <nav style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>{SCREENS.map(s => <button key={s.id} onClick={() => setScreen(s.id)} className="mos-picker__opt" aria-selected={s.id === S.id} style={{ all: 'unset', boxSizing: 'border-box', display: 'flex', gap: 10, alignItems: 'center', padding: '7px 8px', borderRadius: 4, cursor: 'pointer', background: s.id === S.id ? 'var(--mos-accent-soft)' : 'none', boxShadow: s.id === S.id ? 'inset 0 0 0 1px var(--mos-accent-soft-border)' : 'none' }}><span className="mos-index">{s.n}</span><span style={{ font: 'var(--mos-type-ui)', color: 'var(--mos-text-strong)', fontWeight: s.id === S.id ? 500 : 400 }}>{s.t}</span></button>)}
        <a href="motion.html" style={{ display: 'flex', gap: 10, padding: '7px 8px', textDecoration: 'none', color: 'var(--mos-text-strong)' }}><span className="mos-index">12</span><span style={{ font: 'var(--mos-type-ui)' }}>Motion spec ↗</span></a></nav>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--mos-border-subtle)', marginTop: 12 }}>
        {S.states && <div className="mos-field"><span className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>State</span><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{S.states.map(([k, l]) => <MX.Button key={k} size="sm" variant={st === k ? 'primary' : 'secondary'} onClick={() => setScreen(S.id, k)}>{l}</MX.Button>)}</div></div>}
        {!three && <div className="mos-field"><span className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Viewport</span><MX.Segmented label="Viewport" value={vp} onChange={setVp} options={[{ id: 'desktop', label: '1440', icon: 'monitor' }, { id: 'tablet', label: '834', icon: 'tablet' }, { id: 'mobile', label: '390', icon: 'smartphone' }]} /></div>}
        <div className="mos-field"><span className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Mosaic mode</span><MX.Segmented label="Mode" value={theme} onChange={setTheme} options={[{ id: 'light', label: 'Light', icon: 'sun' }, { id: 'dark', label: 'Dark', icon: 'moon' }]} /></div>
        {!three && <div className="mos-field"><span className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Admin theme</span><MX.Segmented label="Admin theme" value={admin} onChange={setAdmin} options={[{ id: 'claro', label: 'Claro' }, { id: 'gin', label: 'Gin' }, { id: 'custom', label: 'Custom' }]} /></div>}
        <div style={{ borderTop: '1px solid var(--mos-border-subtle)', paddingTop: 12 }}><div className="mos-caps" style={{ color: 'var(--mos-text-muted)', marginBottom: 6 }}>{S.n} · The choice</div><p style={{ margin: 0, font: 'var(--mos-type-body)', fontSize: 13, color: 'var(--mos-text-default)', textWrap: 'pretty' }}>{S.why}</p></div>
      </div>
    </aside>
    <main ref={stageRef} style={{ flex: 1, minWidth: 0, background: theme === 'dark' ? '#0b0d0f' : '#e7e9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, overflow: 'hidden', padding: 24 }}>
      {three ? ['claro', 'gin', 'custom'].map(a => <Frame key={a} w={W} h={H} scale={scale} label={a.toUpperCase()}><ScreenBody id="builder" vp="desktop" theme={theme} admin={a} ctx={ctx} /></Frame>)
        : <Frame w={W} h={H} scale={scale} overlay={overlay}><ScreenBody id={S.id} st={st} vp={vp} theme={theme} admin={admin} ctx={ctx} /></Frame>}
    </main>
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
