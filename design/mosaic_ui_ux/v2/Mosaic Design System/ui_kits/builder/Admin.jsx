const MA = window.MosaicDesignSystem_9c1bff;
const GRADE = { ready: 'Ready', attention: 'Attention', blocked: 'Blocked' };

function MosRegion({ theme, children }) {
  return <div className="mosaic" data-mosaic-theme={theme} style={{ background: 'var(--mos-surface-chrome)', border: '1px solid var(--mos-border-subtle)', borderRadius: 8, overflow: 'hidden', color: 'var(--mos-text-default)' }}>{children}</div>;
}

function LibrariesPage({ vp, theme }) {
  const [sel, setSel] = React.useState('civic');
  const [open, setOpen] = React.useState('Card');
  const [libs, setLibs] = React.useState(MOS_DATA.libraries);
  const [comps, setComps] = React.useState(MOS_DATA.civicComponents);
  const mob = vp === 'mobile', stacked = vp !== 'desktop';
  const L = libs.find(l => l.id === sel);
  const list = <div style={{ display: 'flex', flexDirection: stacked ? 'row' : 'column', gap: 8, overflow: stacked ? 'auto' : 'visible', padding: stacked ? '0 0 4px' : 0 }}>
    {libs.map(l => <div key={l.id} style={{ minWidth: stacked ? 230 : 0 }}><MA.Card interactive selected={sel === l.id} onClick={() => setSel(l.id)} title={<span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{l.name}<span className="mos-index">{l.version}</span></span>} meta={l.note} aside={<span onClick={e => e.stopPropagation()}><MA.Toggle checked={l.on} showState onChange={() => setLibs(libs.map(x => x.id === l.id ? { ...x, on: !x.on } : x))} /></span>}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}><MA.Badge tone="ready" size="sm">{l.ready}</MA.Badge>{l.attention > 0 && <MA.Badge tone="attention" size="sm">{l.attention}</MA.Badge>}{l.blocked > 0 && <MA.Badge tone="blocked" size="sm">{l.blocked}</MA.Badge>}{l.own && <MA.Badge tone="accent" size="sm" icon={false}>Mosaic</MA.Badge>}</div>
    </MA.Card></div>)}
  </div>;
  const row = c => <React.Fragment key={c.name}>
    <tr>
      <td><button className="mos-btn mos-btn--link" onClick={() => setOpen(open === c.name ? null : c.name)} aria-expanded={open === c.name} style={{ color: 'var(--mos-text-strong)', gap: 6 }}><MA.Icon name={open === c.name ? 'chevron-down' : 'chevron-right'} size={14} />{c.name}</button><div className="mos-fieldrow__machine" style={{ paddingLeft: 20 }}>civic_ui:{c.name.toLowerCase().replace(' ', '_')}</div></td>
      <td><MA.Toggle checked={c.on} showState onChange={() => setComps(comps.map(x => x.name === c.name ? { ...x, on: !x.on } : x))} disabled={c.grade === 'blocked'} /></td>
      <td><MA.Checkbox checked={c.restricted} label="Admin only" onChange={() => setComps(comps.map(x => x.name === c.name ? { ...x, restricted: !x.restricted } : x))} /></td>
      <td><MA.Badge tone={c.grade}>{GRADE[c.grade]}</MA.Badge>{c.reason && <div className="mos-help" style={{ marginTop: 4, maxWidth: 260, color: c.grade === 'blocked' ? 'var(--mos-state-blocked-fg)' : 'var(--mos-state-attention-fg)' }}>{c.reason}</div>}</td>
      <td className="mos-mono" style={{ color: 'var(--mos-text-muted)' }}>{c.fields} fields · {c.slots} slots</td>
      <td><MA.Button size="sm" variant="ghost" iconRight="arrow-right">Manage authoring</MA.Button></td>
    </tr>
    {open === c.name && <tr><td colSpan={6} style={{ background: 'var(--mos-surface-sunken)', padding: 16 }}><Docs /></td></tr>}
  </React.Fragment>;
  const cards = <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{comps.map(c => <MA.Card key={c.name} title={c.name} meta={c.fields + ' fields · ' + c.slots + ' slots'} aside={<MA.Badge tone={c.grade}>{GRADE[c.grade]}</MA.Badge>}>{c.reason && <div className="mos-help" style={{ color: 'var(--mos-state-attention-fg)', marginBottom: 8 }}>{c.reason}</div>}<div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}><MA.Toggle checked={c.on} showState label="Enabled" /><MA.Checkbox checked={c.restricted} label="Admin only" /></div>{open === c.name && <div style={{ marginTop: 12 }}><Docs /></div>}</MA.Card>)}</div>;
  return <MosRegion theme={theme}>
    <div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="mos-help" style={{ fontSize: 13, maxWidth: 680 }}>Libraries supply components to Mosaic. Turning a library off hides its components from every palette; pages that already use them keep their values and show a “Library missing” card to editors.</div>
      <div style={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ width: stacked ? '100%' : 280, flex: 'none' }}>{list}</div>
        <div style={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span style={{ font: 'var(--mos-type-title)', color: 'var(--mos-text-strong)' }}>{L.name}</span><span className="mos-index">{L.version}</span><span style={{ flex: 1 }} /><MA.Button size="sm" icon="book-open">Living docs</MA.Button></div>
          {L.id === 'civic' && <MA.Banner tone="info" compact icon="box">Styles in JavaScript (shadow DOM). Civic UI owns its look; content placed in its areas renders without Mosaic styling.</MA.Banner>}
          {L.id === 'olivero' && <MA.Banner tone="attention" compact title="Theme-bound · ships global styles">Only available while Olivero is the default front-end theme. Its CSS loads on every page that uses it.</MA.Banner>}
          {L.id === 'ds' && <MA.Banner tone="attention" compact title="Ships global resets">Enabling this library loads a CSS reset site-wide, which may change typography on existing pages.</MA.Banner>}
          {L.id === 'starter' && <MA.Banner tone="success" compact>Uses Mosaic tokens. Style, Spacing and Responsive are available on every component.</MA.Banner>}
          {mob ? cards : <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th>Component</th><th>Enabled</th><th>Access</th><th>Readiness</th><th>Schema</th><th /></tr></thead><tbody>{comps.map(row)}</tbody></table></div>}
        </div>
      </div>
    </div>
  </MosRegion>;
}

function Docs() {
  const d = MOS_DATA.cardDocs;
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
    <div><div className="mos-caps" style={{ color: 'var(--mos-text-muted)', marginBottom: 8 }}>Fields · from schema</div>{d.fields.map(f => <div key={f[1]} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 8, padding: '5px 0', borderTop: '1px solid var(--mos-border-subtle)' }}><span className="mos-label" style={{ fontSize: 12 }}>{f[0]}</span><span className="mos-help"><span className="mos-mono">{f[1]} · {f[2]}</span><br />{f[3]} · {f[4]}</span></div>)}</div>
    <div><div className="mos-caps" style={{ color: 'var(--mos-text-muted)', marginBottom: 8 }}>Slots & rules</div>{d.slots.map(s => <div key={s[1]} style={{ padding: '5px 0', borderTop: '1px solid var(--mos-border-subtle)' }}><span className="mos-label" style={{ fontSize: 12 }}>{s[0]}</span> <span className="mos-mono" style={{ color: 'var(--mos-text-faint)' }}>{s[1]}</span><div className="mos-help">Accepts {s[2]} · {s[3]} items · preferred fill: {s[4]}</div></div>)}<div className="mos-help" style={{ marginTop: 8 }}>Allowed in: Card row, Section · Needs a Card row when placed in a Columns area.</div></div>
  </div>;
}

function ManageAuthoring({ vp, theme }) {
  const [tab, setTab] = React.useState('ma');
  const mob = vp === 'mobile';
  const rows = [
    { l: 'Heading', m: 'heading', w: 'Plain text', req: true, caps: [1, 0, 0], d: '' },
    { l: 'Summary', m: 'summary', w: 'Rich text', req: false, caps: [1, 0, 0], d: 'Example text' },
    { l: 'Media', m: 'media', w: 'Image fill', req: false, caps: [0, 1, 0], d: '' },
    { l: 'Variant', m: 'variant', w: 'Dropdown', req: false, caps: [0, 1, 0], d: 'Default' },
    { l: 'Link', m: 'url', w: 'Plain text', req: false, caps: [1, 0, 0], d: '' }
  ];
  const capLabels = ['Bindable', 'Breakpoint', 'Stylable'];
  const fieldRow = (r, i) => mob ? <MA.Card key={r.m} title={<span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MA.Icon name="grip-vertical" size={14} style={{ color: 'var(--mos-text-faint)' }} />{r.l}<span className="mos-mono" style={{ color: 'var(--mos-text-faint)' }}>{r.m}</span></span>}><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><MA.Select label="Widget" size="sm" value={r.w} options={['Rich text', 'Plain text', 'Image fill', 'Open cell', 'Dropdown', 'Hidden']} /><MA.Input size="sm" label="Help" placeholder="Help for authors" /><MA.Checkbox checked={r.req} label="Required" /></div></MA.Card> :
    <tr key={r.m}><td style={{ width: 24, color: 'var(--mos-text-faint)' }}><MA.Icon name="grip-vertical" size={14} /></td><td><div className="mos-label">{r.l}</div><div className="mos-fieldrow__machine">{r.m}</div></td><td style={{ minWidth: 130 }}><MA.Select size="sm" value={r.w} options={['Rich text', 'Plain text', 'Image fill', 'Open cell', 'Dropdown', 'Hidden']} /></td><td style={{ minWidth: 120 }}><MA.Input size="sm" defaultValue={r.l} /></td><td style={{ minWidth: 140 }}><MA.Input size="sm" placeholder="Help for authors" /></td><td><MA.Checkbox checked={r.req} label="" /></td><td style={{ minWidth: 100 }}><MA.Input size="sm" defaultValue={r.d} placeholder="—" /></td><td><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{capLabels.map((c, k) => <MA.Checkbox key={c} checked={!!r.caps[k]} label={<span style={{ fontSize: 12 }}>{c}</span>} disabled={k === 2} />)}</div></td></tr>;
  return <MosRegion theme={theme}>
    <div style={{ padding: mob ? '8px 14px 0' : '8px 20px 0' }}><MA.Tabs value={tab} onChange={setTab} tabs={[{ id: 'ma', label: 'Manage authoring' }, { id: 'ft', label: 'Field types', count: 9 }]} /></div>
    {tab === 'ma' ? <div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span style={{ font: 'var(--mos-type-title)', color: 'var(--mos-text-strong)' }}>Card</span><span className="mos-help">Civic UI · 3.2.1</span><MA.Badge tone="ready">Ready</MA.Badge><span style={{ flex: 1 }} /><MA.Button size="sm" variant="link">Show row weights</MA.Button></div>
      <MA.Banner tone="owned" compact>Stylable is unavailable: Civic UI owns this component's look.</MA.Banner>
      <div className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Fields</div>
      {mob ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{rows.map(fieldRow)}</div> : <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th /><th>Field</th><th>Widget</th><th>Label</th><th>Help</th><th>Req.</th><th>Default</th><th>Capabilities</th></tr></thead><tbody>{rows.map(fieldRow)}</tbody></table></div>}
      <div className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Slots</div>
      <MA.Card title={<span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MA.Icon name="grip-vertical" size={14} style={{ color: 'var(--mos-text-faint)' }} />Footer <span className="mos-mono" style={{ color: 'var(--mos-text-faint)' }}>footer</span></span>}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(4,minmax(0,1fr))', gap: 14, alignItems: 'start' }}>
          <div className="mos-field"><span className="mos-label">Allowed children</span><MA.Checkbox checked label="Button" /><MA.Checkbox checked label="Link list" /><MA.Checkbox label="Plain content" /></div>
          <MA.Select label="Preferred fill" options={['Button', 'Link list']} help="Shown as “+ Add Button”." />
          <MA.Select label="Repeater child" options={['— none —', 'Button']} help="Single-child areas list as a repeater in the rail." />
          <div style={{ display: 'flex', gap: 8 }}><MA.Input label="Min" defaultValue="0" /><MA.Input label="Max" defaultValue="2" /></div>
        </div>
      </MA.Card>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <MA.Toggle checked showState label="Example previews" description="Untouched fields show example content, marked EXAMPLE." />
        <div className="mos-field"><span className="mos-label">Patterns that show this component</span><MA.Checkbox checked label="Card row (3 cards)" /><MA.Checkbox label="Card + button" /></div>
      </div>
      <div><MA.Button variant="primary">Save configuration</MA.Button></div>
    </div> : <FieldTypes mob={mob} />}
  </MosRegion>;
}

function FieldTypes({ mob }) {
  const rows = [['string', 'Plain text', 'B · R', 184], ['string (html)', 'Rich text', 'B', 62], ['string (uri)', 'Plain text', 'B', 40], ['enum', 'Dropdown', 'R · S', 97], ['boolean', 'Toggle', 'R', 33], ['number', 'Plain text (number)', 'R · S', 21], ['object {src, alt}', 'Image fill', '—', 28], ['array<string>', 'Repeater', 'B', 9], ['number | string', null, '—', 2]];
  return <div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div className="mos-help" style={{ fontSize: 13 }}>Site-wide defaults. Every library's schema shapes map to a widget here; Manage authoring can override per field.</div>
    <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th>Shape</th><th>Default widget</th>{!mob && <th>Capabilities</th>}<th>Used by</th></tr></thead><tbody>{rows.map(r => <tr key={r[0]}><td className="mos-mono" style={{ color: 'var(--mos-text-strong)', fontSize: 12 }}>{r[0]}</td><td style={{ minWidth: 150 }}>{r[1] ? <MA.Select size="sm" value={r[1]} options={[r[1], 'Plain text', 'Rich text', 'Dropdown', 'Hidden']} /> : <div><MA.Select size="sm" error=" " options={['Choose a widget…', 'Plain text', 'Dropdown']} /><div className="mos-help" style={{ color: 'var(--mos-state-attention-fg)', marginTop: 4 }}>No default — 2 fields show Attention</div></div>}</td>{!mob && <td className="mos-mono" style={{ color: 'var(--mos-text-muted)' }}>{r[2]}</td>}<td className="mos-mono" style={{ color: 'var(--mos-text-muted)' }}>{r[3]} fields</td></tr>)}</tbody></table></div>
    <div className="mos-help">B = bindable · R = varies by breakpoint · S = stylable. Capabilities decide which rail sections appear.</div>
  </div>;
}

function ChangesReport({ vp, theme }) {
  const mob = vp === 'mobile';
  const rows = [
    ['Federal Highway Safety Standards 2026', 'Card', 'Civic UI', 'removed', 'Library removed', 'Heading, Summary, Media, binding kept'],
    ['Grant programs', 'Card', 'Civic UI', 'type', 'Summary: string → string (html)', 'Text kept as rich text'],
    ['Road safety news', 'Stat', 'Civic UI', 'attention', 'Value has no default widget', 'Value kept, not editable']
  ];
  const tag = k => k === 'removed' ? <MA.Badge tone="blocked" icon="triangle-alert">Removed</MA.Badge> : k === 'type' ? <MA.Badge tone="attention" icon="flag">Type changed</MA.Badge> : <MA.Badge tone="attention" icon="circle-alert">Attention</MA.Badge>;
  return <MosRegion theme={theme}><div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}><span style={{ font: 'var(--mos-type-title)', color: 'var(--mos-text-strong)' }}>Library changes</span><span className="mos-help">Civic UI 3.1 → 3.2 · 27 Sep 2026</span></div>
    {mob ? rows.map(r => <MA.Card key={r[0] + r[1]} title={r[0]} meta={r[1] + ' · ' + r[2]} aside={tag(r[3])}><div className="mos-help">{r[4]}. {r[5]}.</div><div style={{ marginTop: 8 }}><MA.Button size="sm">Open in builder</MA.Button></div></MA.Card>) :
      <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th>Page</th><th>Component</th><th>Change</th><th>Detail</th><th>What was kept</th><th /></tr></thead><tbody>{rows.map(r => <tr key={r[0] + r[1]}><td style={{ color: 'var(--mos-text-strong)', fontWeight: 500 }}>{r[0]}</td><td>{r[1]} <span className="mos-help">· {r[2]}</span></td><td>{tag(r[3])}</td><td className="mos-help">{r[4]}</td><td className="mos-help">{r[5]}</td><td><MA.Button size="sm" iconRight="arrow-up-right">Open in builder</MA.Button></td></tr>)}</tbody></table></div>}
  </div></MosRegion>;
}

Object.assign(window, { LibrariesPage, ManageAuthoring, FieldTypes, ChangesReport, MosRegion });
