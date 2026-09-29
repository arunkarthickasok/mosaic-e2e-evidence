// Canvas content renders in the SITE's front-end theme (serif, navy) — only the chrome around it is Mosaic.
const M = window.MosaicDesignSystem_9c1bff;
const site = {
  ink: '#1b2a4a', body: '#2f3a4f', muted: '#5b6477', link: '#1a5fb4', line: '#d8dde6', bg: '#ffffff', tint: '#f2f5f9',
  h: '600 {s}px/1.15 Lora,Georgia,serif', p: '400 15px/1.6 "Source Sans 3","Segoe UI",sans-serif'
};
const hf = s => site.h.replace('{s}', s);

function ExampleCorner({ label = 'EXAMPLE' }) {
  return <span className="mosaic" style={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}><span className="mos-badge mos-badge--example mos-badge--sm" style={{ background: 'var(--mos-surface-raised)' }}>{label}</span></span>;
}

function Sel({ on, label, index, mode, toolbar, children, compact }) {
  if (!on) return children;
  const f = () => {};
  const tb = toolbar === false ? null : (toolbar || <M.SelectionToolbar compact={compact} onParent={f} onMoveUp={f} onMoveDown={f} onKeyboardMove={f} onWrap={f} onDuplicate={f} onRemove={f} />);
  return <div className="mosaic" style={{ font: 'inherit', color: 'inherit' }}><M.SelectionFrame label={label} index={index} mode={mode} toolbar={tb}>{children}</M.SelectionFrame></div>;
}

function SiteHeading({ children, size = 30, sub }) {
  return <div style={{ padding: '4px 0 12px' }}><div style={{ font: hf(size), color: site.ink, letterSpacing: '-.01em' }}>{children}</div>{sub && <p style={{ font: site.p, color: site.body, margin: '10px 0 0', maxWidth: 620 }}>{sub}</p>}</div>;
}

function SiteCard({ title, body, img = true, example, selected, narrow, footer, imgEmpty, missingAlt }) {
  return <div style={{ position: 'relative', background: site.bg, border: '1px solid ' + site.line, borderRadius: 4, overflow: 'visible', display: 'flex', flexDirection: 'column', height: '100%' }}>
    {example && <ExampleCorner />}
    {img && <div style={{ height: narrow ? 90 : 110, background: imgEmpty ? 'repeating-linear-gradient(135deg,#eef1f5 0 8px,#e4e8ee 8px 9px)' : 'linear-gradient(160deg,#c9d6e6,#8fa6c2)', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b6477', font: '12px "Source Sans 3",sans-serif', outline: missingAlt ? '2px solid var(--mos-state-blocked-fg)' : 'none', outlineOffset: -2 }}>{imgEmpty ? 'No image' : ''}</div>}
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <div style={{ font: hf(narrow ? 16 : 18), color: site.ink }}>{title}</div>
      <div style={{ font: site.p, fontSize: 14, color: example ? site.muted : site.body, fontStyle: example ? 'italic' : 'normal' }}>{body}</div>
      {footer}
      <a style={{ font: site.p, fontSize: 14, color: site.link, marginTop: 'auto' }}>Read more</a>
    </div>
  </div>;
}

function CardRow({ cols, children, gap = 16 }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ',minmax(0,1fr))', gap }}>{children}</div>;
}

function Page({ children, width }) {
  return <div style={{ background: site.bg, maxWidth: width, margin: '0 auto', padding: width && width < 500 ? '20px 16px 40px' : '32px 36px 56px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100%', color: site.body }}>{children}</div>;
}

function cols(pw, n) { return pw < 500 ? 1 : pw < 700 ? Math.min(2, n) : n; }

// Screen 1 / 10 / 11: card row with a Civic UI card selected
function CanvasCardRow({ pw, mode = 'selected', errors, compact }) {
  const c = cols(pw, 3);
  const f = () => {};
  const tb = mode === 'keyboard' ? false : undefined;
  return <Page width={pw}>
    <SiteHeading size={pw < 500 ? 24 : 30} sub="The National Highway Traffic Safety Administration publishes annual safety data for all 50 states, at county level from fiscal year 2024.">Federal Highway Safety Standards 2026</SiteHeading>
    <div style={{ position: 'relative' }}>
      {mode === 'keyboard' && <div className="mosaic" style={{ marginBottom: 10 }}><div className="mos-drop-line" /></div>}
      <CardRow cols={c}>
        <SiteCard title="Work-zone safety" body="Updated temporary traffic control guidance for 2026." narrow={pw < 700} />
        <Sel on label="Card · Civic UI" index="04" mode={mode === 'keyboard' ? 'keyboard' : undefined} toolbar={tb} compact={compact}>
          <SiteCard title="Road Safety Initiative 2026" body="A federal–state partnership to reduce highway fatalities 15% by 2028." example={!errors} imgEmpty={errors} missingAlt={errors} narrow={pw < 700}
            footer={<div className="mosaic" style={{ marginTop: 6 }}><M.Zone label="Footer" index="A" empty addLabel="Add Button" onAdd={f} emptyText={pw < 500 ? null : undefined} /></div>} />
        </Sel>
        {c > 2 && <SiteCard title="RAISE grants" body="Funding for local and regional transportation projects." narrow={pw < 700} />}
      </CardRow>
    </div>
    {errors && <div className="mosaic"><M.Zone label="Teaser (Olivero) · Content" index="B" required empty emptyText="Needs at least 1 item — this is why Save stopped." addLabel="Add Text" onAdd={f} /></div>}
    <div><div style={{ font: hf(22), color: site.ink, marginBottom: 8 }}>Data and reports</div><p style={{ font: site.p, margin: 0 }}>County-level fatality data, crash reports and research summaries.</p></div>
  </Page>;
}

// Screen 3: accordion (Mosaic Starter) selected
function CanvasAccordion({ pw, items, activeId }) {
  const f = () => {};
  return <Page width={pw}>
    <SiteHeading size={pw < 500 ? 24 : 28}>Safety grant FAQ</SiteHeading>
    <Sel on label="Accordion · Mosaic Starter" index="02">
      <div style={{ border: '1px solid ' + site.line, borderRadius: 4 }}>
        {items.map((it, i) => <div key={it.id} style={{ borderTop: i ? '1px solid ' + site.line : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', font: hf(17), color: site.ink, background: it.id === activeId ? site.tint : 'none' }}>{it.summary}<span style={{ marginLeft: 'auto', font: '20px sans-serif', color: site.muted }}>{it.id === activeId ? '–' : '+'}</span></div>
          {it.id === activeId && <div className="mosaic" style={{ padding: '0 16px 16px' }}><M.Zone label="Panel content" index="A" required empty emptyText="Requires at least 1 item — 0/1" addLabel="Add Text" onAdd={f} /></div>}
        </div>)}
        {items.length === 0 && <div className="mosaic" style={{ padding: 12 }}><M.Zone label="Items" index="A" required empty emptyText="Requires at least 1 item — 0/1" addLabel="Add item" onAdd={f} /></div>}
      </div>
    </Sel>
    <p style={{ font: site.p, margin: 0 }}>Still have questions? Contact your FHWA division office.</p>
  </Page>;
}

// Screen 4: columns zone bound to a View
function CanvasBound({ pw, ds }) {
  const n = cols(pw, 3);
  const rows = ds === 'one' ? MOS_DATA.news.slice(0, 1) : MOS_DATA.news;
  const f = () => {};
  let inner;
  if (ds === 'empty') inner = <div className="mos-zone__empty" style={{ minHeight: 150 }}><M.Icon name="circle-dashed" size={20} /><b style={{ color: 'var(--mos-text-strong)', font: 'var(--mos-type-ui-strong)' }}>No results for Topic = Road safety</b><span>Visitors see the View's empty text: "No news yet."<br />Rows appear here as soon as matching content is published.</span></div>;
  else if (ds === 'fail') inner = <div className="mos-zone__empty" style={{ minHeight: 150, background: 'var(--mos-state-blocked-bg)' }}><M.Icon name="circle-alert" size={20} style={{ color: 'var(--mos-state-blocked-fg)' }} /><b style={{ color: 'var(--mos-state-blocked-fg)', font: 'var(--mos-type-ui-strong)' }}>Latest news couldn't load</b><span>The View returned an error. Visitors see nothing in this area; the rest of the page is unaffected.</span><button className="mos-zone__cta"><M.Icon name="refresh-cw" size={14} />Retry preview</button></div>;
  else inner = <div className="mos-fresh" style={{ display: 'grid', gridTemplateColumns: 'repeat(' + n + ',minmax(0,1fr))', gap: 12, fontFamily: 'initial' }}>{rows.map(r => <div key={r.t} style={{ background: '#fff', border: '1px solid ' + site.line, borderRadius: 4, padding: 12, color: site.body }}><div style={{ height: 60, background: 'linear-gradient(160deg,#d6dfeb,#a6b8cf)', borderRadius: 2, marginBottom: 10 }} /><div style={{ font: hf(15), color: site.ink }}>{r.t}</div><div style={{ font: site.p, fontSize: 13, color: site.muted, marginTop: 4 }}>{r.d}</div></div>)}</div>;
  const rl = ds === 'fail' ? <M.ResultLine state="failing" view="Latest news" error="View returned an error" /> : ds === 'empty' ? <M.ResultLine state="empty" view="Latest news" display="Block" /> : <M.ResultLine shown={rows.length} total={128} view="Latest news" display="Block" />;
  return <Page width={pw}>
    <SiteHeading size={pw < 500 ? 24 : 28} sub="The latest on road safety from across the department.">Road safety news</SiteHeading>
    <Sel on label="Columns · Mosaic Starter" index="02" compact>
      <div className="mosaic"><M.Zone label="Columns · each row → Card" index="A" state={ds === 'fail' ? 'failing' : 'bound'} rule="VIEW" count={<M.Badge tone="data" size="sm">DATA</M.Badge>} footer={rl}>{inner}</M.Zone></div>
    </Sel>
  </Page>;
}

// Screen 6: canvas states composite
function CanvasStates({ pw, picker, setPicker, toast, setToast }) {
  const f = () => {};
  const narrow = pw < 500;
  return <Page width={pw}>
    <SiteHeading size={narrow ? 24 : 28}>Grant programs</SiteHeading>
    <div style={{ position: 'relative' }} className="mosaic">
      <div style={{ font: 'var(--mos-type-help)', color: 'var(--mos-text-faint)', marginBottom: 6, fontFamily: 'var(--mos-font-mono)' }}>SECTION · MOSAIC STARTER</div>
      <M.Zone label="Section · Content" index="A" empty emptyText={narrow ? null : 'Drag from the palette, or add here.'} addLabel="Add" onAdd={() => setPicker(!picker)} state={picker ? 'highlight' : undefined} />
      {picker && <div style={{ position: 'absolute', top: narrow ? 108 : 118, left: narrow ? 0 : '50%', transform: narrow ? 'none' : 'translateX(-50%)', zIndex: 20 }}><M.Picker title="Add to Section · Content" groups={MOS_DATA.pickerGroups} onClose={() => setPicker(false)} onSelect={() => { setPicker(false); setToast(true); }} /></div>}
    </div>
    <CardRow cols={cols(pw, 2)}>
      <div style={{ position: 'relative' }}>
        <SiteCard title="Safe Streets for All" body="Example summary — replace with real content." example narrow />
      </div>
      <div style={{ position: 'relative' }}>
        <SiteCard title="Bridge investment" body="Competitive grants for bridge replacement and repair." narrow footer={<div className="mosaic" style={{ marginTop: 6, position: 'relative' }}>
          <M.Zone label="Footer" index="A" state="refused" empty emptyText=" " />
          <div style={{ position: 'absolute', top: 30, left: 10, right: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--mos-surface-raised)', border: '1px solid var(--mos-border-default)', borderRadius: 4, boxShadow: 'var(--mos-lift-shadow)', transform: 'rotate(-1.5deg)', font: 'var(--mos-type-ui-strong)', color: 'var(--mos-text-strong)', opacity: .95 }}><M.Icon name="panel-top" size={14} />Hero</div>
            <span className="mos-refused-tip"><M.Icon name="ban" size={12} />Hero can't go in Footer — allowed: Button, Link list</span>
          </div>
        </div>} />
      </div>
    </CardRow>
    {toast && <div className="mosaic" style={{ position: 'sticky', bottom: 12, display: 'flex', justifyContent: 'center', zIndex: 30 }}><M.Toast icon="wrap-text" action="Undo" onAction={() => setToast(false)} onClose={() => setToast(false)}>Placed inside a new <strong>Section</strong></M.Toast></div>}
  </Page>;
}

// Screen 9 (builder view): library missing
function CanvasMissing({ pw }) {
  return <Page width={pw}>
    <SiteHeading size={pw < 500 ? 24 : 30}>Federal Highway Safety Standards 2026</SiteHeading>
    <Sel on label="Card · Civic UI (missing)" index="04" toolbar={<M.SelectionToolbar onParent={() => {}} onRemove={() => {}} />}>
      <div className="mosaic"><M.MissingCard library="Civic UI" component="Card" values={[{ label: 'Heading', value: 'Road Safety Initiative 2026' }, { label: 'Summary', value: 'A federal–state partnership to reduce…' }, { label: 'Media', value: 'road-safety-hero.jpg · alt set' }]} binding="Latest news · Block" /></div>
    </Sel>
    <p style={{ font: site.p, margin: 0 }}>County-level fatality data, crash reports and research summaries.</p>
  </Page>;
}

function CanvasEmpty({ pw }) {
  return <Page width={pw}><div className="mosaic" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', minHeight: 320, border: '1px dashed var(--mos-border-strong)', borderRadius: 6, padding: 24 }}>
    <M.Icon name="layout-template" size={24} style={{ color: 'var(--mos-text-faint)' }} />
    <div style={{ font: 'var(--mos-type-title)', color: 'var(--mos-text-strong)' }}>This layout is empty</div>
    <div className="mos-help" style={{ maxWidth: 320 }}>Drag a component from the palette, start from a pattern, or add one here. Nothing is published until you save.</div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}><M.Button variant="primary" icon="plus">Add component</M.Button><M.Button icon="layout-grid">Use a pattern</M.Button></div>
  </div></Page>;
}

Object.assign(window, { site, hf, Sel, SiteHeading, SiteCard, CardRow, Page, CanvasCardRow, CanvasAccordion, CanvasBound, CanvasStates, CanvasMissing, CanvasEmpty, ExampleCorner });
