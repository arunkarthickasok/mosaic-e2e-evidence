const MR2 = window.MosaicDesignSystem_9c1bff;

function HtmlField({ initial = 'empty' }) {
  const [mode, setMode] = React.useState(initial);
  return <MR2.FieldRow label="Media" help={mode === 'empty' ? 'Write text or add an image. One or the other fills this area.' : undefined} machineName="media · string (html)">
    {mode === 'empty' && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="mos-rich mos-rich--example" role="button" tabIndex={0} onClick={() => setMode('text')}>Write text…<span className="mos-rich__open"><MR2.Icon name="square-pen" size={12} />Open editor</span></div>
      <div style={{ display: 'flex', gap: 6 }}><MR2.Button variant="add" size="sm" icon="image-plus" onClick={() => setMode('image')}>Add image</MR2.Button></div>
    </div>}
    {(mode === 'image' || mode === 'confirm') && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="mos-filled"><span className="mos-filled__thumb" style={{ background: 'linear-gradient(160deg,#c9d6e6,#8fa6c2)' }} /><div style={{ flex: 1, minWidth: 0 }}><div className="mos-label" style={{ fontSize: 12 }}>Filled by Image</div><div className="mos-help" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>work-zone-i70.jpg</div></div><MR2.Button size="sm" variant="link">Edit</MR2.Button><span className="mos-sync__sep">·</span><MR2.Button size="sm" variant="link" onClick={() => setMode('empty')}>Remove</MR2.Button></div>
      <MR2.Input label="Alt text" required defaultValue="Lane closure signs in a highway work zone" help="Required before saving." />
      {mode === 'image' && <div><MR2.Button size="sm" variant="ghost" icon="type" onClick={() => setMode('confirm')}>Use text instead</MR2.Button></div>}
      {mode === 'confirm' && <div role="alertdialog" aria-labelledby="rq-t" style={{ padding: 12, border: '1px solid var(--mos-border-default)', borderRadius: 6, background: 'var(--mos-surface-raised)', boxShadow: 'var(--mos-shadow-md)', display: 'flex', flexDirection: 'column', gap: 8, animation: 'mos-insert var(--mos-dur-base) var(--mos-ease-entrance) both' }}>
        <div id="rq-t" className="mos-label">Replace the image with text?</div>
        <div className="mos-help">The image leaves this card but stays in the media library. You can undo this.</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><MR2.Button size="sm" onClick={() => setMode('image')}>Keep image</MR2.Button><MR2.Button size="sm" variant="primary" onClick={() => setMode('text')}>Replace with text</MR2.Button></div>
      </div>}
    </div>}
    {mode === 'text' && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="mos-rich" role="button" tabIndex={0}>Crews are working on I-70 between exits 12 and 18 through November.<span className="mos-rich__open"><MR2.Icon name="square-pen" size={12} />Edit</span></div>
      <div className="mos-help" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>Filled by Text<span className="mos-sync__sep">·</span><MR2.Button size="sm" variant="link" onClick={() => setMode('empty')}>Remove</MR2.Button></div>
    </div>}
  </MR2.FieldRow>;
}

function RailHtml({ initial }) {
  return <Rail head={<RailHead crumbs={['Page', 'Card row', 'Card']} name="Card" lib="Civic UI" />}>
    <div style={{ padding: '12px 16px 4px' }}><MR2.Banner tone="owned" compact>Styling is owned by Civic UI Card</MR2.Banner></div>
    <MR2.RailSection index="01" title="Content">
      <MR2.Input label="Title" required defaultValue="Work-zone safety" />
      <HtmlField key={initial} initial={initial} />
      <MR2.Select label="Variant" options={['Default', 'Featured', 'Compact']} />
    </MR2.RailSection>
    <MR2.RailSection index="02" title="Slots" defaultCollapsed aside={<span className="mos-count">1</span>} />
    <MR2.RailSection index="03" title="Data" defaultCollapsed />
    <MR2.RailSection index="04" title="Accessibility" defaultCollapsed aside={<MR2.Badge tone="ready" size="sm">AA</MR2.Badge>} />
  </Rail>;
}

function RailRep({ kind, items, setItems }) {
  const cards = kind === 'g-max';
  const [grab, setGrab] = React.useState(null);
  const [live, setLive] = React.useState('');
  const [active, setActive] = React.useState(items[0] && items[0].id);
  const move = (id, d) => { const i = items.findIndex(x => x.id === id), j = i + d; if (j < 0 || j >= items.length) return; const n = items.slice(); [n[i], n[j]] = [n[j], n[i]]; setItems(n); setLive(n[j].summary + ', position ' + (j + 1) + ' of ' + n.length); };
  const onKey = e => { if (!grab) return; if (e.key === 'ArrowUp') { e.preventDefault(); move(grab, -1); } if (e.key === 'ArrowDown') { e.preventDefault(); move(grab, 1); } if (e.key === 'Enter' || e.key === 'Escape') setGrab(null); };
  const min = cards ? 2 : 1, max = cards ? 4 : 12;
  return <Rail head={<RailHead crumbs={cards ? ['Page', 'Card row'] : ['Page', 'Accordion']} name={cards ? 'Card row' : 'Accordion'} lib={cards ? 'Civic UI' : 'Mosaic Starter'} grade={items.length < min ? 'attention' : 'ready'} />}>
    {cards && <div style={{ padding: '12px 16px 4px' }}><MR2.Banner tone="owned" compact>Styling is owned by Civic UI Card row</MR2.Banner></div>}
    <MR2.RailSection index="01" title={cards ? 'Cards' : 'Items'} aside={<span className="mos-count">{items.length}/{max}</span>} note={cards ? 'Each card is a Card (Civic UI). Select one on the canvas to edit it.' : undefined}>
      <div onKeyDown={onKey}><MR2.Repeater items={items} min={min} max={max} addLabel={cards ? 'Add Card' : 'Add item'} activeId={active} grabbedId={grab} onSelect={setActive} onMove={move}
        onRemove={id => { setItems(items.filter(x => x.id !== id)); setLive('Removed. ' + (items.length - 1) + ' left.'); }}
        onAdd={() => { const id = 'n' + Date.now(); setItems([...items, { id, summary: cards ? 'New card' : 'New item', meta: cards ? 'Card · example' : 'Accordion item · empty' }]); setActive(id); setLive('Added. ' + (items.length + 1) + ' items.'); }} /></div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><MR2.Button size="sm" icon="move-vertical" disabled={items.length < 2} onClick={() => setGrab(grab ? null : active)}>{grab ? 'Drop here' : 'Reorder with keyboard'}</MR2.Button>{grab && <span className="mos-help">↑ ↓ move · Enter drops · Esc cancels</span>}</div>
      <div className="mos-help" aria-live="assertive" style={{ minHeight: 18, fontFamily: 'var(--mos-font-mono)' }}>{live}</div>
    </MR2.RailSection>
    {!cards && <MR2.RailSection index="02" title="Style" defaultCollapsed />}
    <MR2.RailSection index={cards ? '02' : '03'} title="Accessibility" defaultCollapsed aside={<MR2.Badge tone="ready" size="sm">AA</MR2.Badge>} />
  </Rail>;
}

function RailNotices() {
  return <Rail head={<RailHead crumbs={['Page', 'Card row', 'Card']} name="Card" lib="Civic UI" grade="attention" />}>
    <div style={{ padding: '12px 16px 4px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <MR2.Banner tone="owned" compact>Styling is owned by Civic UI Card</MR2.Banner>
      <MR2.Notice kind="legacy-override" field="Padding" onAction={() => {}}>Set to Large before Civic UI owned this component's styling. It still applies.</MR2.Notice>
    </div>
    <MR2.RailSection index="01" title="Content" aside={<MR2.Badge tone="attention" size="sm">3</MR2.Badge>}>
      <MR2.Notice kind="removed" field="Eyebrow" onAction={() => {}}>Civic UI 3.2 removed this field. The value “New for 2026” is kept but not shown.</MR2.Notice>
      <MR2.Input label="Title" required defaultValue="Road Safety Initiative 2026" />
      <MR2.Notice kind="type" field="Summary">Now rich text. Your text was kept as a paragraph.</MR2.Notice>
      <RichRow label="Summary" text="A federal–state partnership to reduce highway fatalities 15% by 2028." />
      <MR2.Notice kind="attention" field="Variant">“Spotlight” is no longer offered. The card shows Default until you choose.</MR2.Notice>
      <MR2.Select label="Variant" options={['Choose a variant…', 'Default', 'Featured', 'Compact']} error=" " />
    </MR2.RailSection>
    <MR2.RailSection index="02" title="Data" aside={<MR2.Badge tone="data" size="sm">1</MR2.Badge>}>
      <MR2.Notice kind="legacy-binding" field="Summary" onAction={() => {}}>Bound in an older format. It still shows the page's Body; remove it to bind again.</MR2.Notice>
      <BindRow label="Link" bound="This page › URL alias" />
    </MR2.RailSection>
    <MR2.RailSection index="03" title="Accessibility" defaultCollapsed aside={<MR2.Badge tone="ready" size="sm">AA</MR2.Badge>} />
  </Rail>;
}

const BG_TOKENS = [['surface', 'Surface', '#ffffff'], ['tint', 'Tint', '#f2f5f9'], ['brand', 'Brand', '#1b2a4a'], ['warm', 'Warm', '#fbf6ec']];
const PAD = ['None', 'S', 'M', 'L'];

function RailStyle({ style, setStyle }) {
  const [bp, setBp] = React.useState({ padding: ['L', 'M', 'S'], gap: ['M', 'M', 'S'], width: ['Contained', 'Contained', 'Full'] });
  const [hide, setHide] = React.useState([false, false, false]);
  const def = { padding: 'L', gap: 'M', width: 'Contained' };
  const opts = { padding: PAD, gap: PAD, width: ['Contained', 'Full'] };
  return <Rail head={<RailHead crumbs={['Page', 'Section']} name="Section" lib="Mosaic Starter" />}>
    <MR2.RailSection index="01" title="Content"><MR2.Select label="Heading level" options={['H2 (recommended)', 'H3']} help="First heading under the page title." /></MR2.RailSection>
    <MR2.RailSection index="02" title="Style">
      <div className="mos-field"><span className="mos-label" id="bg-l">Background</span>
        <div role="radiogroup" aria-labelledby="bg-l" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 6 }}>{BG_TOKENS.map(([k, l, c]) => <button key={k} role="radio" aria-checked={style.bg === k} onClick={() => setStyle({ ...style, bg: k })} style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, padding: 6, borderRadius: 4, border: '1px solid ' + (style.bg === k ? 'var(--mos-border-selected)' : 'var(--mos-border-subtle)'), boxShadow: style.bg === k ? '0 0 0 1px var(--mos-border-selected)' : 'none' }}><span style={{ height: 22, borderRadius: 3, background: c, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)' }} /><span style={{ font: 'var(--mos-type-help)', color: 'var(--mos-text-strong)' }}>{l}</span><span className="mos-fieldrow__machine">bg.{k}</span></button>)}</div>
      </div>
      <div className="mos-field"><span className="mos-label">Padding</span><MR2.Segmented label="Padding" size="sm" value={style.pad} onChange={v => setStyle({ ...style, pad: v })} options={PAD.map(p => ({ id: p, label: p }))} /><span className="mos-help">Site spacing tokens: space.{style.pad.toLowerCase()}</span></div>
    </MR2.RailSection>
    <MR2.RailSection index="03" title="Responsive" aside={<span className="mos-count">4 overrides</span>} note="Only layout properties can vary by breakpoint.">
      <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(3,minmax(0,1fr))', gap: '6px 6px', alignItems: 'center' }}>
        <span />{['Desktop', 'Tablet', 'Mobile'].map(h => <span key={h} className="mos-help" style={{ display: 'flex', gap: 4, alignItems: 'center' }}><MR2.Icon name={h === 'Desktop' ? 'monitor' : h === 'Tablet' ? 'tablet' : 'smartphone'} size={12} />{h}</span>)}
        {Object.keys(bp).map(k => <React.Fragment key={k}><span className="mos-label" style={{ fontSize: 12, textTransform: 'capitalize' }}>{k}</span>{bp[k].map((v, i) => <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><MR2.Select size="sm" value={v} onChange={e => setBp({ ...bp, [k]: bp[k].map((x, j) => j === i ? e.target.value : x) })} options={opts[k]} aria-label={k + ' on ' + ['Desktop', 'Tablet', 'Mobile'][i]} />{v !== def[k] && <span className="mos-override">Override</span>}</div>)}</React.Fragment>)}
      </div>
    </MR2.RailSection>
    <MR2.RailSection index="04" title="Visibility" aside={hide.some(Boolean) ? <span className="mos-count">Hidden on {hide.filter(Boolean).length}</span> : null}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>{['Desktop', 'Tablet', 'Mobile'].map((b, i) => <MR2.Checkbox key={b} checked={hide[i]} onChange={() => setHide(hide.map((h, j) => j === i ? !h : h))} label={'Hide on ' + b} />)}</div>
      <MR2.Banner tone="info" compact icon="eye-off">Hidden content is still downloaded and indexed.</MR2.Banner>
    </MR2.RailSection>
    <MR2.RailSection index="05" title="Accessibility" defaultCollapsed aside={<MR2.Badge tone="ready" size="sm">AA</MR2.Badge>} />
  </Rail>;
}

function CanvasSection({ pw, style }) {
  const bg = BG_TOKENS.find(b => b[0] === style.bg)[2];
  const dark = style.bg === 'brand';
  const p = { None: 0, S: 16, M: 28, L: 44 }[style.pad];
  const c = pw < 500 ? 1 : pw < 700 ? 2 : 3;
  return <Page width={pw}>
    <SiteHeading size={pw < 500 ? 24 : 30}>Federal Highway Safety Standards 2026</SiteHeading>
    <Sel on label="Section · Mosaic Starter" index="02" compact>
      <div className="mos-fresh" key={style.bg + style.pad} style={{ background: bg, padding: p, borderRadius: 2, transition: 'background var(--mos-dur-crossfade) var(--mos-ease-standard)' }}>
        <div style={{ font: hf(22), color: dark ? '#fff' : site.ink, marginBottom: 14 }}>Programs</div>
        <CardRow cols={c}><SiteCard title="Work-zone safety" body="Updated traffic control guidance." narrow /><SiteCard title="RAISE grants" body="Local and regional projects." narrow />{c > 2 && <SiteCard title="Safe Streets for All" body="Grants for local roadway safety plans." narrow />}</CardRow>
      </div>
    </Sel>
  </Page>;
}

function CanvasCards({ pw, items }) {
  const c = pw < 500 ? 1 : pw < 700 ? 2 : Math.min(4, Math.max(2, items.length));
  return <Page width={pw}>
    <SiteHeading size={pw < 500 ? 24 : 28}>Grant programs</SiteHeading>
    <Sel on label="Card row · Civic UI" index="02" compact>
      <CardRow cols={c} gap={12}>{items.map(it => <SiteCard key={it.id} title={it.summary} body="Funding and guidance for state DOTs." narrow example={it.meta.includes('example')} />)}</CardRow>
    </Sel>
  </Page>;
}

const ACC_ONE = [{ id: 'a', summary: 'Who is eligible?', meta: 'Accordion item · 1 paragraph' }];
const CARDS4 = [['c1', 'Safe Streets for All'], ['c2', 'RAISE grants'], ['c3', 'Bridge investment'], ['c4', 'Work-zone safety']].map(([id, s]) => ({ id, summary: s, meta: 'Card' }));

function RailStatesScreen({ st, B }) {
  const [items, setItems] = React.useState(() => st === 'g-floor' ? ACC_ONE : st === 'g-max' ? CARDS4 : []);
  const [style, setStyle] = React.useState({ bg: 'tint', pad: 'L' });
  if (st.startsWith('f')) return B({ canvas: pw => <CanvasCardRow pw={pw} compact />, rail: <RailHtml initial={st === 'f-empty' ? 'empty' : st === 'f-filled' ? 'image' : 'confirm'} />, sync: 'unsaved' });
  if (st.startsWith('g')) return B({ canvas: pw => st === 'g-max' ? <CanvasCards pw={pw} items={items} /> : <CanvasAccordion pw={pw} items={items} activeId={items[0] && items[0].id} />, rail: <RailRep key={st} kind={st} items={items} setItems={setItems} />, sync: 'unsaved', wcag: items.length < 1 ? 'AA · 1 area needs content' : 'AA · 0 issues' });
  if (st === 'h') return B({ canvas: pw => <CanvasCardRow pw={pw} compact />, rail: <RailNotices />, wcag: 'AA · 0 issues · 3 library notices' });
  if (st === 'i') return B({ canvas: pw => <CanvasSection pw={pw} style={style} />, rail: <RailStyle style={style} setStyle={setStyle} />, sync: 'unsaved' });
  if (st === 'j') return B({ canvas: pw => <CanvasCardRow pw={pw} />, palette: true, setPalette: () => {}, rail: null });
  return null;
}

Object.assign(window, { RailStatesScreen, HtmlField });
