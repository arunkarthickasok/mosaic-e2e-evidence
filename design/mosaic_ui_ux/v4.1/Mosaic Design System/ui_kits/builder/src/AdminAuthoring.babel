const MM = window.MosaicDesignSystem_9c1bff;
const WIDGETS = { string: ['Plain text', 'Hidden'], html: ['Rich text', 'Image fill', 'Open cell', 'Hidden'], uri: ['Plain text', 'Hidden'], enum: ['Dropdown', 'Hidden'] };
const PROPS0 = [
  { id: 'title', l: 'Title', m: 'title', shape: 'string', libReq: true, d: { w: 'Plain text', label: 'Title', help: '', req: true, def: '', caps: [1, 0, 0] } },
  { id: 'summary', l: 'Summary', m: 'summary', shape: 'html', d: { w: 'Rich text', label: 'Summary', help: '', req: false, def: '', caps: [1, 0, 0] } },
  { id: 'media', l: 'Media', m: 'media', shape: 'html', d: { w: 'Image fill', label: 'Media', help: '', req: false, def: '', caps: [0, 1, 0] } },
  { id: 'variant', l: 'Variant', m: 'variant', shape: 'enum', d: { w: 'Dropdown', label: 'Variant', help: '', req: false, def: 'Default', caps: [0, 1, 0] } },
  { id: 'url', l: 'Link', m: 'url', shape: 'uri', d: { w: 'Plain text', label: 'Link', help: '', req: false, def: '', caps: [1, 0, 0] } }
].map(p => ({ ...p, v: { ...p.d, caps: [...p.d.caps] } }));
const withOverrides = st => PROPS0.map(p => {
  const v = { ...p.d, caps: [...p.d.caps] };
  if (p.id === 'summary') v.label = 'Teaser text';
  if (p.id === 'url') v.help = 'Where “Read more” goes.';
  if (p.id === 'title' && st === 'error') v.w = 'Hidden';
  return { ...p, v };
});
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function ManageAuthoring({ vp, theme, st = 'clean' }) {
  const [rows, setRows] = React.useState(() => withOverrides(st));
  const [weights, setWeights] = React.useState(false);
  const [onlyOv, setOnlyOv] = React.useState(false);
  const [slot, setSlot] = React.useState({ allowed: ['Button', 'Link list'], pref: 'Button', rep: '— none —', min: '0', max: '2', open: false });
  React.useEffect(() => setRows(withOverrides(st)), [st]);
  const mob = vp === 'mobile';
  const set = (id, k, val) => setRows(rows.map(r => r.id === id ? { ...r, v: { ...r.v, [k]: val } } : r));
  const setCap = (id, i) => setRows(rows.map(r => r.id === id ? { ...r, v: { ...r.v, caps: r.v.caps.map((c, j) => j === i ? (c ? 0 : 1) : c) } } : r));
  const reset = id => setRows(rows.map(r => r.id === id ? { ...r, v: { ...r.d, caps: [...r.d.caps] } } : r));
  const move = (id, dir) => { const i = rows.findIndex(r => r.id === id), j = i + dir; if (j < 0 || j >= rows.length) return; const n = rows.slice(); [n[i], n[j]] = [n[j], n[i]]; setRows(n); };
  const errOf = r => r.libReq && r.v.w === 'Hidden' ? r.l + ' is required by the library; it cannot be hidden.' : null;
  const errs = rows.map(errOf).filter(Boolean);
  const ov = r => !same(r.v, r.d);
  const shown = onlyOv ? rows.filter(ov) : rows;
  const capL = ['Bindable', 'Breakpoint', 'Stylable'];
  const caps = r => <div style={{ display: 'flex', flexDirection: mob ? 'row' : 'column', gap: mob ? 14 : 4, flexWrap: 'wrap' }}>{capL.map((c, k) => <MM.Checkbox key={c} checked={!!r.v.caps[k]} onChange={() => setCap(r.id, k)} disabled={k === 2} label={<span style={{ fontSize: 12 }}>{c}</span>} />)}</div>;
  const req = r => <MM.Checkbox checked={r.v.req || r.libReq} disabled={r.libReq} onChange={() => set(r.id, 'req', !r.v.req)} label={r.libReq ? <span className="mos-help">By library</span> : ''} />;
  const ovCell = r => ov(r) ? <span style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}><span className="mos-override">Overridden</span><MM.Button size="sm" variant="link" onClick={() => reset(r.id)}>Reset</MM.Button></span> : <span className="mos-help">Default</span>;
  const widget = r => <MM.Select size="sm" value={r.v.w} error={errOf(r) ? ' ' : undefined} onChange={e => set(r.id, 'w', e.target.value)} options={WIDGETS[r.shape]} aria-label={r.l + ' widget'} />;
  const tableRows = shown.map((r, i) => <React.Fragment key={r.id}>
    <tr className={errOf(r) ? 'mos-row-error' : ''}>
      <td style={{ width: 28, color: 'var(--mos-text-faint)', cursor: 'grab' }} title="Drag to reorder"><MM.Icon name="grip-vertical" size={14} /></td>
      <td><div className="mos-label">{r.l}</div><div className="mos-fieldrow__machine">{r.m} · {r.shape}</div></td>
      <td style={{ minWidth: 130 }}>{widget(r)}</td>
      <td style={{ minWidth: 120 }}><MM.Input size="sm" value={r.v.label} onChange={e => set(r.id, 'label', e.target.value)} aria-label={r.l + ' label'} /></td>
      <td style={{ minWidth: 150 }}><MM.Input size="sm" value={r.v.help} placeholder="Help for authors" onChange={e => set(r.id, 'help', e.target.value)} aria-label={r.l + ' help'} /></td>
      <td>{req(r)}</td>
      <td style={{ minWidth: 100 }}><MM.Input size="sm" value={r.v.def} placeholder="—" onChange={e => set(r.id, 'def', e.target.value)} aria-label={r.l + ' default'} /></td>
      <td>{caps(r)}</td>
      <td>{ovCell(r)}</td>
      {weights && <td><MM.Select size="sm" value={String(i)} options={rows.map((_, k) => String(k))} onChange={e => move(r.id, +e.target.value - i)} aria-label={r.l + ' weight'} /></td>}
    </tr>
    {errOf(r) && <tr className="mos-row-error"><td /><td colSpan={weights ? 9 : 8} style={{ paddingTop: 0 }}><div className="mos-err"><MM.Icon name="circle-alert" size={14} />{errOf(r)}</div></td></tr>}
  </React.Fragment>);
  const cardRows = shown.map(r => <MM.Card key={r.id} selected={!!errOf(r)} title={<span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MM.Icon name="grip-vertical" size={14} style={{ color: 'var(--mos-text-faint)' }} />{r.l}<span className="mos-fieldrow__machine">{r.m}</span></span>} aside={ov(r) ? <span className="mos-override">Overridden</span> : null}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <MM.Select label="Widget" size="sm" value={r.v.w} onChange={e => set(r.id, 'w', e.target.value)} options={WIDGETS[r.shape]} error={errOf(r) || undefined} />
      <MM.Input size="sm" label="Label" value={r.v.label} onChange={e => set(r.id, 'label', e.target.value)} />
      <MM.Input size="sm" label="Help" value={r.v.help} placeholder="Help for authors" onChange={e => set(r.id, 'help', e.target.value)} />
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>{req(r)}<span className="mos-help">Required</span></div>
      {caps(r)}
      <div style={{ display: 'flex', gap: 8 }}><MM.IconButton size="sm" variant="secondary" icon="arrow-up" label="Move up" onClick={() => move(r.id, -1)} /><MM.IconButton size="sm" variant="secondary" icon="arrow-down" label="Move down" onClick={() => move(r.id, 1)} />{ov(r) && <MM.Button size="sm" variant="link" onClick={() => reset(r.id)}>Reset to default</MM.Button>}</div>
    </div>
  </MM.Card>);
  const children = ['Button', 'Link list', 'Plain content'];
  return <MosRegion theme={theme}>
    <div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span style={{ font: 'var(--mos-type-title)', color: 'var(--mos-text-strong)' }}>Card</span><span className="mos-help">Civic UI · 3.2.1</span><MM.Badge tone="ready">Ready</MM.Badge><span style={{ flex: 1 }} /><MM.Checkbox checked={onlyOv} onChange={() => setOnlyOv(!onlyOv)} label={'Overrides only (' + rows.filter(ov).length + ')'} />{!mob && <MM.Button size="sm" variant="link" onClick={() => setWeights(!weights)}>{weights ? 'Hide row weights' : 'Show row weights'}</MM.Button>}</div>
      {errs.length > 0 && <MM.Banner tone="error" title="This configuration can't be saved">{errs[0]}</MM.Banner>}
      <MM.Banner tone="owned" compact>Stylable is unavailable because Civic UI owns this component's look.</MM.Banner>
      <div className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Fields</div>
      {mob ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{cardRows}</div> : <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th /><th>Field</th><th>Widget</th><th>Label</th><th>Help</th><th>Required</th><th>Default</th><th>Capabilities</th><th /> {weights && <th>Weight</th>}</tr></thead><tbody>{tableRows}</tbody></table></div>}
      <div className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Slots</div>
      <MM.Card title={<span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MM.Icon name="grip-vertical" size={14} style={{ color: 'var(--mos-text-faint)' }} />Footer <span className="mos-fieldrow__machine">footer · slot</span></span>} aside={slot.open ? <span className="mos-override">Overridden</span> : null}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(5,minmax(0,1fr))', gap: 14, alignItems: 'start' }}>
          <div className="mos-field"><span className="mos-label">Allowed children</span>{children.map(c => <MM.Checkbox key={c} checked={slot.allowed.includes(c)} disabled={c === 'Plain content' && !slot.open} onChange={() => setSlot({ ...slot, allowed: slot.allowed.includes(c) ? slot.allowed.filter(x => x !== c) : [...slot.allowed, c] })} label={c} />)}</div>
          <MM.Select label="Preferred fill" value={slot.pref} onChange={e => setSlot({ ...slot, pref: e.target.value })} options={slot.allowed.length ? slot.allowed : ['—']} help={'Shown as “+ Add ' + slot.pref + '”.'} />
          <MM.Select label="Repeater child" value={slot.rep} onChange={e => setSlot({ ...slot, rep: e.target.value })} options={['— none —', ...slot.allowed]} help="Lists the area as a repeater in the rail." />
          <div style={{ display: 'flex', gap: 8 }}><MM.Input label="Min" value={slot.min} onChange={e => setSlot({ ...slot, min: e.target.value })} /><MM.Input label="Max" value={slot.max} onChange={e => setSlot({ ...slot, max: e.target.value })} /></div>
          <MM.Toggle checked={slot.open} onChange={() => setSlot({ ...slot, open: !slot.open })} showState label="Open cell" description="Also accept plain content (text, image)." />
        </div>
      </MM.Card>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        <MM.Toggle checked showState label="Example previews" description="Untouched fields show example content, marked EXAMPLE." />
        <div className="mos-field"><span className="mos-label">Patterns that show this component</span><MM.Checkbox checked label="Card row (3 cards)" /><MM.Checkbox label="Card + button" /></div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}><MM.Button variant="primary" disabled={errs.length > 0}>Save configuration</MM.Button><MM.Button icon="rotate-ccw" onClick={() => { setRows(PROPS0.map(p => ({ ...p, v: { ...p.d, caps: [...p.d.caps] } }))); setSlot({ allowed: ['Button', 'Link list'], pref: 'Button', rep: '— none —', min: '0', max: '2', open: false }); }}>Reset to defaults</MM.Button>{errs.length > 0 && <span className="mos-help" style={{ color: 'var(--mos-state-blocked-fg)' }}>Fix 1 error to save.</span>}</div>
    </div>
  </MosRegion>;
}

const SHAPES = [
  { s: 'string', why: 'Short text from the schema, such as a title.', opts: ['Plain text', 'Hidden'], d: 'Plain text', caps: 'B · R', used: 184 },
  { s: 'string (html)', why: 'Markup the library renders as-is.', opts: ['Rich text', 'Image fill', 'Open cell', 'Hidden'], d: 'Rich text', caps: 'B', used: 62 },
  { s: 'string (uri)', why: 'A link or path.', opts: ['Plain text', 'Hidden'], d: 'Plain text', caps: 'B', used: 40 },
  { s: 'enum', why: 'A fixed list of options from the schema.', opts: ['Dropdown', 'Hidden'], d: 'Dropdown', caps: 'R · S', used: 97 },
  { s: 'boolean', why: 'On or off.', opts: ['Toggle', 'Hidden'], d: 'Toggle', caps: 'R', used: 33 },
  { s: 'number', why: 'A number; the schema’s min and max apply.', opts: ['Plain text (number)', 'Hidden'], d: 'Plain text (number)', caps: 'R · S', used: 21 },
  { s: 'object {src, alt}', why: 'An image with its alt text.', opts: ['Image fill', 'Hidden'], d: 'Image fill', caps: '—', used: 28 },
  { s: 'slot', why: 'An area that accepts components.', opts: ['Open cell', 'Components only'], d: 'Components only', caps: 'B', used: 51 },
  { s: 'slot (single child)', why: 'An area that repeats one kind of child.', opts: ['Repeater', 'Components only'], d: 'Repeater', caps: 'B', used: 12 },
  { s: 'number | string', why: 'Mixed type, so Mosaic can’t choose a widget.', opts: ['Plain text', 'Hidden'], d: null, caps: '—', used: 2 }
];

function FieldTypes({ vp, theme }) {
  const [vals, setVals] = React.useState(() => Object.fromEntries(SHAPES.map(x => [x.s, x.s === 'string (html)' ? 'Open cell' : x.d || ''])));
  const mob = vp === 'mobile';
  const ov = x => x.d !== null && vals[x.s] !== x.d;
  const sel = x => <MM.Select size="sm" value={vals[x.s]} error={!vals[x.s] ? ' ' : undefined} onChange={e => setVals({ ...vals, [x.s]: e.target.value })} options={[...(x.d === null ? [{ value: '', label: 'Choose a widget…' }] : []), ...x.opts]} aria-label={x.s + ' default widget'} />;
  const status = x => x.d === null && !vals[x.s] ? <span className="mos-help" style={{ color: 'var(--mos-state-attention-fg)' }}>No default. {x.used} fields show Attention.</span> : ov(x) ? <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="mos-override">Overridden</span><MM.Button size="sm" variant="link" onClick={() => setVals({ ...vals, [x.s]: x.d })}>Reset</MM.Button></span> : <span className="mos-help">Default</span>;
  return <MosRegion theme={theme}><div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}><div className="mos-help" style={{ fontSize: 13, flex: 1, minWidth: 240 }}>Site-wide defaults. Each schema shape gets a default widget, and only compatible widgets are offered. Manage authoring can override any single field.</div><MM.Button size="sm" icon="rotate-ccw" onClick={() => setVals(Object.fromEntries(SHAPES.map(x => [x.s, x.d || ''])))}>Reset all to defaults</MM.Button></div>
    {mob ? SHAPES.map(x => <MM.Card key={x.s} title={<span className="mos-mono" style={{ fontSize: 12 }}>{x.s}</span>} meta={x.why} aside={<span className="mos-count">{x.used}</span>}><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{sel(x)}{status(x)}</div></MM.Card>) :
      <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th>Shape</th><th>Default widget</th><th>Capabilities</th><th>Used by</th><th /></tr></thead><tbody>{SHAPES.map(x => <tr key={x.s}><td><div className="mos-mono" style={{ color: 'var(--mos-text-strong)', fontSize: 12 }}>{x.s}</div><div className="mos-help">{x.why}</div></td><td style={{ minWidth: 170 }}>{sel(x)}</td><td className="mos-count">{x.caps}</td><td className="mos-count">{x.used} fields</td><td>{status(x)}</td></tr>)}</tbody></table></div>}
    <div className="mos-help">B = bindable · R = can vary by breakpoint · S = stylable. Capabilities decide which rail sections appear for a field.</div>
    <div><MM.Button variant="primary">Save field types</MM.Button></div>
  </div></MosRegion>;
}

Object.assign(window, { ManageAuthoring, FieldTypes });
