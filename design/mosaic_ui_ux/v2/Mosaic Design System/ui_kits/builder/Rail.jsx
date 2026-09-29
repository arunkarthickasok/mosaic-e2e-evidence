const MR = window.MosaicDesignSystem_9c1bff;

function RailHead({ crumbs, name, lib, grade = 'ready', onClose }) {
  return <div style={{ padding: '10px 12px 12px 16px', borderBottom: '1px solid var(--mos-border-subtle)', flex: 'none' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <span className="mos-index" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{crumbs.join('  ›  ')}</span>
      <span style={{ marginLeft: 'auto', display: 'flex' }}><MR.IconButton size="sm" icon="arrow-up-left" label="Select parent" /><MR.IconButton size="sm" icon="x" label="Close" onClick={onClose} /></span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ font: 'var(--mos-type-title)', fontSize: 16, color: 'var(--mos-text-strong)' }}>{name}</span>
      <span className="mos-help">{lib}</span>
      <span style={{ marginLeft: 'auto' }}><MR.Badge tone={grade} size="sm">{grade === 'ready' ? 'Ready' : grade === 'attention' ? 'Attention' : 'Blocked'}</MR.Badge></span>
    </div>
  </div>;
}

function Rail({ children, head }) {
  return <div className="mosaic" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--mos-surface-chrome)', minHeight: 0 }}>{head}<div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>{children}</div></div>;
}

function RichRow({ label, text, example, onOpen, machine }) {
  return <MR.FieldRow label={label} example={example} machineName={machine} badge={example ? <MR.Badge tone="example" size="sm">EXAMPLE</MR.Badge> : null}>
    <div className={'mos-rich' + (example ? ' mos-rich--example' : '')} role="button" tabIndex={0} onClick={onOpen}>{text}<span className="mos-rich__open"><MR.Icon name="square-pen" size={12} />Edit</span></div>
  </MR.FieldRow>;
}

function BindRow({ label, bound, legacy, onBind }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 32 }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="mos-label">{label}</div>
      {bound && <div className="mos-result" style={{ marginTop: 2 }}><MR.Icon name="link-2" size={12} />{bound}</div>}
      {legacy && <div className="mos-help" style={{ color: 'var(--mos-state-attention-fg)', display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}><MR.Icon name="history" size={12} />Legacy binding — remove to edit</div>}
      {!bound && !legacy && <div className="mos-help">Not bound</div>}
    </div>
    {legacy ? <MR.Button size="sm" variant="danger">Remove</MR.Button> : bound ? <MR.Button size="sm" variant="ghost">Unbind</MR.Button> : <MR.Button size="sm" icon="database" onClick={onBind}>Bind</MR.Button>}
  </div>;
}

function RailCard({ errors, onOpenRich, altRef, onClose, changes }) {
  const [filled, setFilled] = React.useState(!!errors);
  return <Rail head={<RailHead crumbs={['Page', 'Card row', 'Card']} name="Card" lib="Civic UI" onClose={onClose} />}>
    <div style={{ padding: '12px 16px 4px' }}><MR.Banner tone="owned" compact>Styling is owned by Civic UI Card</MR.Banner></div>
    {changes && <div style={{ padding: '8px 16px 0' }}><MR.Banner tone="attention" compact icon="flag" title="Type changed in Civic UI 3.2">Summary is now rich text. Your text was kept.</MR.Banner></div>}
    <MR.RailSection index="01" title="Content" aside={!errors && <MR.Badge tone="example" size="sm" icon={false}>1 EXAMPLE</MR.Badge>}>
      <MR.Input label="Heading" required defaultValue="Road Safety Initiative 2026" help="Card title. Keep under 90 characters." />
      <RichRow label="Summary" text={errors ? 'A federal–state partnership to reduce highway fatalities 15% by 2028.' : 'A federal–state partnership to reduce highway fatalities 15% by 2028.'} example={!errors} onOpen={onOpenRich} machine="summary · string (html)" />
      <MR.FieldRow label="Media" help="Image or plain content shown above the heading.">
        {filled ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="mos-filled"><span className="mos-filled__thumb"><MR.Icon name="image" size={16} /></span><div style={{ flex: 1, minWidth: 0 }}><div className="mos-label" style={{ fontSize: 12 }}>Filled by Image</div><div className="mos-help" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>road-safety-hero.jpg</div></div><MR.Button size="sm" variant="link">Edit</MR.Button><span className="mos-sync__sep">·</span><MR.Button size="sm" variant="link" onClick={() => setFilled(false)}>Remove</MR.Button></div>
          <MR.Input label="Alt text" required inputRef={altRef} placeholder="Describe the image" error={errors ? 'Add alt text so people using screen readers know what the image shows.' : undefined} help="Required before saving." />
        </div> : <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><MR.Button variant="add" size="sm" icon="image-plus" onClick={() => setFilled(true)}>Add image</MR.Button><MR.Button variant="add" size="sm" icon="text">Add plain content</MR.Button></div>}
      </MR.FieldRow>
      <MR.Select label="Variant" options={['Default', 'Featured', 'Compact']} />
      <MR.Input label="Link" defaultValue="/road-safety" prefix="URL" help="Where “Read more” goes." />
    </MR.RailSection>
    <MR.RailSection index="02" title="Slots" aside={<span className="mos-index">1</span>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', border: '1px dashed var(--mos-slot-line)', borderRadius: 4 }}>
        <span className="mos-index" style={{ color: 'var(--mos-state-data-fg)' }}>A</span>
        <div style={{ flex: 1, minWidth: 0 }}><div className="mos-label">Footer</div><div className="mos-help">Empty · 0–2 · Button, Link list</div></div>
        <MR.Button size="sm" variant="add" icon="plus">Add Button</MR.Button>
      </div>
    </MR.RailSection>
    <MR.RailSection index="03" title="Data" aside={<MR.Badge tone="data" size="sm">1</MR.Badge>} note="Binding shows live values from Drupal; it never copies them.">
      <BindRow label="Heading" />
      <BindRow label="Link" bound="This page › URL alias" />
      <BindRow label="Summary" legacy />
    </MR.RailSection>
    <MR.RailSection index="04" title="Accessibility" aside={<MR.Badge tone={errors ? 'blocked' : 'ready'} size="sm">{errors ? '1 issue' : 'AA'}</MR.Badge>}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><MR.Icon name="heading-3" size={16} style={{ color: 'var(--mos-text-muted)', marginTop: 2 }} /><div><div className="mos-label">Heading renders as H3</div><div className="mos-help">Page outline: H1 › H2 “Federal Highway…” › <b>H3</b>. In order.</div></div></div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><MR.Icon name={errors ? 'circle-alert' : 'check'} size={16} style={{ color: errors ? 'var(--mos-state-blocked-fg)' : 'var(--mos-state-ready-fg)', marginTop: 2 }} /><div><div className="mos-label">Image alt text</div><div className="mos-help">{errors ? 'Missing — required at save.' : 'No image set.'}</div></div></div>
    </MR.RailSection>
  </Rail>;
}

function RailAccordion({ items, setItems, activeId, setActive, onClose }) {
  const [grab, setGrab] = React.useState(null);
  const [live, setLive] = React.useState('');
  const move = (id, d) => { const i = items.findIndex(x => x.id === id); const j = i + d; if (j < 0 || j >= items.length) return; const n = items.slice(); [n[i], n[j]] = [n[j], n[i]]; setItems(n); setLive(n[j].summary + ' moved to position ' + (j + 1) + ' of ' + n.length); };
  const [bp, setBp] = React.useState('d');
  const onKey = e => { if (!grab) return; if (e.key === 'ArrowUp') { e.preventDefault(); move(grab, -1); } if (e.key === 'ArrowDown') { e.preventDefault(); move(grab, 1); } if (e.key === 'Enter' || e.key === 'Escape') setGrab(null); };
  return <Rail head={<RailHead crumbs={['Page', 'Accordion']} name="Accordion" lib="Mosaic Starter" onClose={onClose} />}>
    <MR.RailSection index="01" title="Content">
      <MR.Select label="Item title level" options={['H3 (recommended)', 'H2', 'H4']} help="Follows “Safety grant FAQ” (H2)." />
      <MR.Toggle label="Allow several open at once" description="Off: opening one closes the others." />
    </MR.RailSection>
    <MR.RailSection index="02" title="Items" aside={<span className="mos-index">{items.length}/12</span>}>
      <div onKeyDown={onKey}>
        <MR.Repeater items={items} min={1} max={12} activeId={activeId} grabbedId={grab} onSelect={setActive} onMove={move} onRemove={id => { setItems(items.filter(x => x.id !== id)); setLive('Item removed'); }} onAdd={() => { const id = 'n' + Date.now(); setItems([...items, { id, summary: 'New item', meta: 'Accordion item · empty' }]); setLive('Item added'); }} />
      </div>
      {items.length < 1 && <MR.Banner tone="attention" compact title="Requires at least 1 item — 0/1" />}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <MR.Button size="sm" icon="move-vertical" onClick={() => setGrab(grab ? null : activeId)} disabled={!items.length}>{grab ? 'Drop here' : 'Reorder with keyboard'}</MR.Button>
        {grab && <span className="mos-help">↑ ↓ move · Enter drops</span>}
      </div>
      <div className="mos-help" aria-live="assertive" style={{ minHeight: 16, fontFamily: 'var(--mos-font-mono)', fontSize: 11 }}>{live}</div>
      {items.find(i => i.id === activeId) && <MR.Banner tone="attention" compact title={'“' + items.find(i => i.id === activeId).summary + '” · Panel content'}>Requires at least 1 item — 0/1</MR.Banner>}
    </MR.RailSection>
    <MR.RailSection index="03" title="Style">
      <MR.Select label="Surface" options={['Plain', 'Tinted', 'Outlined']} />
      <MR.Select label="Spacing" options={['Comfortable', 'Compact']} />
    </MR.RailSection>
    <MR.RailSection index="04" title="Responsive" aside={<span className="mos-index">1 override</span>}>
      <MR.Segmented label="Breakpoint" size="sm" value={bp} onChange={setBp} options={[{ id: 'd', label: 'Desktop' }, { id: 't', label: 'Tablet' }, { id: 'm', label: 'Mobile' }]} />
      <MR.Select label="Spacing" options={bp === 'm' ? ['Compact (override)', 'Inherit from Tablet'] : ['Inherit', 'Compact']} help={bp === 'm' ? 'Overrides Desktop “Comfortable”.' : 'Only fields that can vary by breakpoint appear here.'} />
    </MR.RailSection>
    <MR.RailSection index="05" title="Accessibility" aside={<MR.Badge tone="ready" size="sm">AA</MR.Badge>}>
      <div className="mos-help">Items render as buttons with aria-expanded; titles as H3 in order.</div>
    </MR.RailSection>
  </Rail>;
}

function RailColumns({ ds, onClose }) {
  const [n, setN] = React.useState('3');
  const [ctx, setCtx] = React.useState('Page field: Topic');
  return <Rail head={<RailHead crumbs={['Page', 'Columns']} name="Columns" lib="Mosaic Starter" onClose={onClose} />}>
    <MR.RailSection index="01" title="Content">
      <div className="mos-field"><span className="mos-label">Columns</span><MR.Segmented label="Columns" value={n} onChange={setN} options={[{ id: '2', label: '2' }, { id: '3', label: '3' }, { id: '4', label: '4' }]} /></div>
    </MR.RailSection>
    <MR.RailSection index="02" title="Data" aside={<MR.Badge tone="data" size="sm">VIEW</MR.Badge>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MR.Icon name="database" size={16} style={{ color: 'var(--mos-state-data-fg)' }} /><div style={{ flex: 1 }}><div className="mos-label">Columns area is bound to a View</div><div className="mos-help">Each row becomes one child. Nothing is copied.</div></div><MR.Button size="sm" variant="ghost">Unbind</MR.Button></div>
      <MR.Select label="View" options={['Latest news', 'Events', 'Grant programs']} />
      <MR.Select label="Display" options={['Block', 'Page', 'Feed']} />
      <MR.Select label="Contextual filter · Topic" value={ctx} onChange={e => setCtx(e.target.value)} options={['Page field: Topic', 'URL: 2nd path segment', 'Reference: Program › Topic', 'Taxonomy: current term', 'User: current user', 'Fixed value']} help="Fills the View's Topic argument from this page." />
      <div className="mos-help" style={{ display: 'flex', gap: 10 }}><span>Exposed filters: none on this display</span><span>·</span><span>Pager: 3 items</span></div>
      <MR.Select label="Each row becomes" options={['Card · Civic UI', 'Teaser · Olivero']} />
      <div className="mos-field"><span className="mos-label">Field map</span>
        <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
          {MOS_DATA.fieldMap.map(([a, b], i) => <div key={a} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 14px minmax(0,1fr)', alignItems: 'center', gap: 6, padding: '6px 8px', borderTop: i ? '1px solid var(--mos-border-subtle)' : 0 }}><span className="mos-mono" style={{ color: 'var(--mos-state-data-fg)', fontSize: 11.5 }}>{a}</span><MR.Icon name="arrow-right" size={12} style={{ color: 'var(--mos-text-faint)' }} /><MR.Select size="sm" options={[b, 'Heading', 'Summary', 'Media', 'Link', '— none —']} /></div>)}
        </div>
      </div>
      <div style={{ padding: '8px 10px', borderRadius: 4, background: 'var(--mos-surface-sunken)' }}>{ds === 'fail' ? <MR.ResultLine state="failing" view="Latest news" error="View returned an error" /> : ds === 'empty' ? <MR.ResultLine state="empty" view="Latest news" display="Block" /> : <MR.ResultLine shown={ds === 'one' ? 1 : 3} total={128} view="Latest news" display="Block" />}</div>
      <details><summary className="mos-help" style={{ cursor: 'pointer' }}>Developer details</summary><div className="mos-fieldrow__machine" style={{ marginTop: 6, lineHeight: 1.6 }}>view: latest_news · display: block_1<br />arg[0]: node.field_topic<br />child: civic_ui:card</div></details>
    </MR.RailSection>
    <MR.RailSection index="03" title="Style" defaultCollapsed />
    <MR.RailSection index="04" title="Responsive" defaultCollapsed aside={<span className="mos-index">3 · 2 · 1</span>} />
    <MR.RailSection index="05" title="Accessibility" defaultCollapsed aside={<MR.Badge tone="ready" size="sm">AA</MR.Badge>} />
  </Rail>;
}

Object.assign(window, { Rail, RailHead, RailCard, RailAccordion, RailColumns });
