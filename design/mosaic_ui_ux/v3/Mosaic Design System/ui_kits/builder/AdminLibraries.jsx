const MA = window.MosaicDesignSystem_9c1bff;
const GRADE = { ready: 'Ready', attention: 'Attention', blocked: 'Blocked' };

function MosRegion({ theme, children, stale }) {
  return <div className={'mosaic' + (stale ? ' mos-stale' : '')} data-mosaic-theme={theme} style={{ background: 'var(--mos-surface-chrome)', border: '1px solid var(--mos-border-subtle)', borderRadius: 8, overflow: 'hidden', color: 'var(--mos-text-default)' }}>{children}</div>;
}

function EmptyState({ icon, title, children, actions }) {
  return <div style={{ padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
    <MA.Icon name={icon} size={24} style={{ color: 'var(--mos-text-faint)' }} />
    <div style={{ font: 'var(--mos-type-title)', color: 'var(--mos-text-strong)' }}>{title}</div>
    <div className="mos-help" style={{ maxWidth: 440, fontSize: 13 }}>{children}</div>
    {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>{actions}</div>}
  </div>;
}

function SyncBar({ syncing, synced, onSync, count }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
    <MA.Button size="sm" icon="refresh-cw" onClick={onSync} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync libraries'}</MA.Button>
    <span className="mos-help" role="status" aria-live="polite">{syncing ? 'Reading component schemas from ' + count + ' libraries…' : synced ? <>Synced just now · 1 library changed · <a href="#" onClick={e => e.preventDefault()}>View library changes</a></> : 'Last synced 27 Sep 2026, 16:40'}</span>
  </div>;
}

const LIB_NOTES = {
  starter: <MA.Banner tone="success" compact>Uses Mosaic tokens. Style, Spacing and Responsive are available on every component.</MA.Banner>,
  civic: <MA.Banner tone="info" compact icon="box" title="Styles in JavaScript (shadow DOM)">Civic UI owns its look. Content placed in its areas renders without Mosaic styling, and the rail hides Style, Spacing and Responsive.</MA.Banner>,
  olivero: <><MA.Banner tone="attention" compact icon="palette" title="Theme-bound">Only available while Olivero is the default front-end theme. Switch themes and these components show as “Library missing” to editors.</MA.Banner><MA.Banner tone="attention" compact title="Ships global styles">Olivero's CSS loads on every page that uses one of its components.</MA.Banner></>,
  ds: <MA.Banner tone="attention" compact title="Ships global styles (resets)">Enabling this library loads a CSS reset site-wide, which can change typography on pages that don't use it.</MA.Banner>
};

function Docs({ vp }) {
  const [tab, setTab] = React.useState('fields');
  const d = MOS_DATA.cardDocs;
  const rowS = { display: 'grid', gridTemplateColumns: vp === 'mobile' ? '1fr' : '140px minmax(0,1fr)', gap: '2px 14px', padding: '8px 0', borderTop: '1px solid var(--mos-border-subtle)' };
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <MA.Tabs value={tab} onChange={setTab} tabs={[{ id: 'fields', label: 'Fields', count: d.fields.length }, { id: 'slots', label: 'Slots', count: d.slots.length }, { id: 'rules', label: 'Rules', count: 4 }, { id: 'patterns', label: 'Patterns', count: 2 }]} />
    {tab === 'fields' && d.fields.map(f => <div key={f[1]} style={rowS}><span className="mos-label">{f[0]}</span><span className="mos-help"><span className="mos-mono">{f[1]} · {f[2]}</span> · {f[3]} · {f[4]}</span></div>)}
    {tab === 'slots' && d.slots.map(s => <div key={s[1]} style={rowS}><span className="mos-label">{s[0]}</span><span className="mos-help"><span className="mos-mono">{s[1]}</span> · accepts {s[2]} · {s[3]} items · preferred fill: {s[4]}</span></div>)}
    {tab === 'rules' && ['Allowed in Card row and Section.', 'Needs a Card row when dropped into a Columns area (wrapped automatically).', 'Media: alt text required at save.', 'Title: required by the library, max 90 characters.'].map(r => <div key={r} style={{ ...rowS, gridTemplateColumns: '1fr' }}><span className="mos-help" style={{ color: 'var(--mos-text-default)' }}>{r}</span></div>)}
    {tab === 'patterns' && [['Card row', 'Card row with 3 cards', 4], ['Card + button', 'One card with a footer button', 2]].map(p => <div key={p[0]} style={rowS}><span className="mos-label">{p[0]}</span><span className="mos-help">{p[1]} · inserts {p[2]} components</span></div>)}
    <details><summary className="mos-help" style={{ cursor: 'pointer' }}>Developer details</summary><div className="mos-fieldrow__machine" style={{ marginTop: 6 }}>civic_ui:card · component.yml · props 5 · slots 1</div></details>
  </div>;
}

function LibrariesPage({ vp, theme, st = 'full' }) {
  const [sel, setSel] = React.useState('civic');
  const [open, setOpen] = React.useState(st === 'docs' ? 'Card' : null);
  const [libs, setLibs] = React.useState(MOS_DATA.libraries);
  const [comps, setComps] = React.useState(MOS_DATA.civicComponents);
  const [syncing, setSyncing] = React.useState(false);
  const [synced, setSynced] = React.useState(false);
  React.useEffect(() => { setOpen(st === 'docs' ? 'Card' : null); }, [st]);
  const sync = () => { setSyncing(true); setTimeout(() => { setSyncing(false); setSynced(true); }, 1600); };
  const mob = vp === 'mobile', stacked = vp !== 'desktop';
  if (st === 'empty') return <MosRegion theme={theme}><EmptyState icon="library" title="No component libraries are enabled" actions={<><MA.Button variant="primary" icon="power">Enable Mosaic Starter</MA.Button><MA.Button icon="refresh-cw">Sync libraries</MA.Button></>}>Editors can't add components until a library is on. Mosaic Starter ships with Mosaic. Libraries from installed modules and themes appear here after a sync.</EmptyState></MosRegion>;
  const L = libs.find(l => l.id === sel);
  const list = <div style={{ display: 'flex', flexDirection: stacked ? 'row' : 'column', gap: 8, overflow: stacked ? 'auto' : 'visible', paddingBottom: stacked ? 4 : 0 }}>
    {libs.map(l => <div key={l.id} style={{ minWidth: stacked ? 240 : 0 }}><MA.Card interactive selected={sel === l.id} onClick={() => setSel(l.id)} title={<span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{l.name}<span className="mos-count">{l.version}</span></span>} meta={l.note} aside={<span onClick={e => e.stopPropagation()}><MA.Toggle checked={l.on} showState onChange={() => setLibs(libs.map(x => x.id === l.id ? { ...x, on: !x.on } : x))} /></span>}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}><MA.Badge tone="ready" size="sm">{l.ready}</MA.Badge>{l.attention > 0 && <MA.Badge tone="attention" size="sm">{l.attention}</MA.Badge>}{l.blocked > 0 && <MA.Badge tone="blocked" size="sm">{l.blocked}</MA.Badge>}{l.own && <MA.Badge tone="accent" size="sm" icon={false}>Mosaic</MA.Badge>}{l.theme && <MA.Badge tone="neutral" size="sm" icon="palette">Theme</MA.Badge>}</div>
    </MA.Card></div>)}
  </div>;
  const toggleComp = (n, k) => setComps(comps.map(x => x.name === n ? { ...x, [k]: !x[k] } : x));
  const row = c => <React.Fragment key={c.name}>
    <tr>
      <td><button className="mos-btn mos-btn--link" onClick={() => setOpen(open === c.name ? null : c.name)} aria-expanded={open === c.name} style={{ color: 'var(--mos-text-strong)', gap: 6 }}><MA.Icon name={open === c.name ? 'chevron-down' : 'chevron-right'} size={14} />{c.name}</button></td>
      <td><MA.Toggle checked={c.on} showState onChange={() => toggleComp(c.name, 'on')} disabled={c.grade === 'blocked'} /></td>
      <td><MA.Checkbox checked={c.restricted} label="Admin only" onChange={() => toggleComp(c.name, 'restricted')} /></td>
      <td><MA.Badge tone={c.grade}>{GRADE[c.grade]}</MA.Badge>{c.reason && <div className="mos-help" style={{ marginTop: 4, maxWidth: 280, color: c.grade === 'blocked' ? 'var(--mos-state-blocked-fg)' : 'var(--mos-state-attention-fg)' }}>{c.reason}</div>}</td>
      <td className="mos-count">{c.fields} fields · {c.slots} slots</td>
      <td><MA.Button size="sm" variant="ghost" iconRight="arrow-right">Manage authoring</MA.Button></td>
    </tr>
    {open === c.name && <tr><td colSpan={6} style={{ background: 'var(--mos-surface-sunken)', padding: 16 }}><Docs vp={vp} /></td></tr>}
  </React.Fragment>;
  const cards = <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{comps.map(c => <MA.Card key={c.name} title={c.name} meta={c.fields + ' fields · ' + c.slots + ' slots'} aside={<MA.Badge tone={c.grade}>{GRADE[c.grade]}</MA.Badge>}>
    {c.reason && <div className="mos-help" style={{ color: c.grade === 'blocked' ? 'var(--mos-state-blocked-fg)' : 'var(--mos-state-attention-fg)', marginBottom: 10 }}>{c.reason}</div>}
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}><MA.Toggle checked={c.on} showState label="Enabled" onChange={() => toggleComp(c.name, 'on')} disabled={c.grade === 'blocked'} /><MA.Checkbox checked={c.restricted} label="Admin only" onChange={() => toggleComp(c.name, 'restricted')} /></div>
    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}><MA.Button size="sm" onClick={() => setOpen(open === c.name ? null : c.name)} icon="book-open">{open === c.name ? 'Hide docs' : 'Docs'}</MA.Button><MA.Button size="sm" variant="ghost" iconRight="arrow-right">Manage authoring</MA.Button></div>
    {open === c.name && <div style={{ marginTop: 12 }}><Docs vp={vp} /></div>}
  </MA.Card>)}</div>;
  return <MosRegion theme={theme}>
    <div className={syncing ? 'mos-stale' : ''} style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}><div className="mos-help" style={{ fontSize: 13, maxWidth: 620, flex: 1, minWidth: 240 }}>Libraries supply components to Mosaic. Turning one off hides its components from every palette. Pages that already use them keep their values and show a “Library missing” card to editors.</div><SyncBar syncing={syncing} synced={synced} onSync={sync} count={libs.length} /></div>
      <div style={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ width: stacked ? '100%' : 280, flex: 'none' }}>{list}</div>
        <div style={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span style={{ font: 'var(--mos-type-title)', color: 'var(--mos-text-strong)' }}>{L.name}</span><span className="mos-count">{L.version} · {L.count} components</span></div>
          {LIB_NOTES[L.id]}
          {!L.on && <MA.Banner tone="info" compact icon="power-off">This library is off. Its components are hidden from palettes; existing pages keep their values.</MA.Banner>}
          {mob ? cards : <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th>Component</th><th>Enabled</th><th>Access</th><th>Readiness</th><th>Schema</th><th /></tr></thead><tbody>{comps.map(row)}</tbody></table></div>}
        </div>
      </div>
    </div>
  </MosRegion>;
}

Object.assign(window, { MosRegion, EmptyState, LibrariesPage, Docs, GRADE });
