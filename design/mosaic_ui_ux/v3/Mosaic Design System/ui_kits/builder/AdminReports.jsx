const MQ = window.MosaicDesignSystem_9c1bff;
const CHG = {
  added: { tone: 'ready', icon: 'plus', label: 'Added' },
  removed: { tone: 'blocked', icon: 'triangle-alert', label: 'Removed' },
  type: { tone: 'attention', icon: 'flag', label: 'Type changed' },
  required: { tone: 'attention', icon: 'asterisk', label: 'Required added' },
  'legacy-binding': { tone: 'data', icon: 'history', label: 'Legacy binding' },
  'legacy-override': { tone: 'neutral', icon: 'history', label: 'Legacy override' }
};
const chg = k => <MQ.Badge tone={CHG[k].tone} icon={CHG[k].icon}>{CHG[k].label}</MQ.Badge>;
const REPORT = [
  { lib: 'Civic UI', from: '3.1.0', to: '3.2.1', schema: [
    ['Card', 'Eyebrow', 'removed', 'Field removed. Values kept on 3 pages, not shown.', 3],
    ['Card', 'Summary', 'type', 'string → string (html). Text kept as rich text.', 2],
    ['Card', 'Badge text', 'added', 'New optional field.', 0],
    ['Hero', 'Alt text', 'required', 'Now required. 1 page has no value.', 1]
  ], pages: [['Federal Highway Safety Standards 2026', 3], ['Grant programs', 1], ['Road safety news', 1]] },
  { lib: 'Olivero', from: '11.0', to: '11.1', schema: [
    ['Teaser', 'Content', 'required', 'Area now needs at least 1 item. 1 page is empty.', 1],
    ['Teaser', 'Date format', 'added', 'New optional field, defaults to medium date.', 0]
  ], pages: [['Safety grant FAQ', 1]] }
];
const LEGACY = [
  ['Federal Highway Safety Standards 2026', 'Card · Civic UI', 'legacy-binding', 'Summary bound with the Mosaic 0.9 token format.'],
  ['Grant programs', 'Card · Civic UI', 'legacy-override', 'Padding: Large set before Civic UI owned this component’s styling.']
];

function Count({ n, k }) { return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{chg(k)}<span className="mos-count" style={{ color: 'var(--mos-text-strong)' }}>{n}</span></span>; }

function ChangesReport({ vp, theme, st = 'report' }) {
  const mob = vp === 'mobile';
  if (st === 'empty') return <MosRegion theme={theme}><EmptyState icon="circle-check" title="No library changes since the last sync" actions={<MQ.Button icon="refresh-cw">Sync libraries</MQ.Button>}>Last synced 29 Sep 2026, 09:12. When a library update adds, removes or retypes a field, the affected pages are listed here.</EmptyState></MosRegion>;
  const all = REPORT.flatMap(r => r.schema);
  const n = k => all.filter(x => x[2] === k).length;
  const table = rows => mob ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{rows.map(r => <MQ.Card key={r[0] + r[1]} title={r[0] + ' · ' + r[1]} aside={chg(r[2])}><div className="mos-help">{r[3]}</div>{r[4] > 0 && <div style={{ marginTop: 8 }}><MQ.Button size="sm" variant="link">{r[4]} page{r[4] > 1 ? 's' : ''}</MQ.Button></div>}</MQ.Card>)}</div>
    : <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th>Component</th><th>Field</th><th>Change</th><th>Detail</th><th>Pages</th></tr></thead><tbody>{rows.map(r => <tr key={r[0] + r[1]}><td style={{ color: 'var(--mos-text-strong)', fontWeight: 500 }}>{r[0]}</td><td>{r[1]}</td><td>{chg(r[2])}</td><td className="mos-help">{r[3]}</td><td>{r[4] > 0 ? <MQ.Button size="sm" variant="link">{r[4]} page{r[4] > 1 ? 's' : ''}</MQ.Button> : <span className="mos-help">—</span>}</td></tr>)}</tbody></table></div>;
  return <MosRegion theme={theme}><div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}><span className="mos-help" style={{ fontSize: 13 }}>Since the sync on 29 Sep 2026, 09:12 · 2 libraries · 6 pages affected</span><span style={{ flex: 1 }} /><MQ.Button size="sm" icon="refresh-cw">Sync libraries</MQ.Button></div>
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}><Count n={n('added')} k="added" /><Count n={n('removed')} k="removed" /><Count n={n('type')} k="type" /><Count n={n('required')} k="required" /><Count n={1} k="legacy-binding" /><Count n={1} k="legacy-override" /></div>
    {REPORT.map(r => <details key={r.lib} open style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6 }}>
      <summary style={{ cursor: 'pointer', padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', listStyle: 'none' }}><MQ.Icon name="chevron-down" size={14} /><span style={{ font: 'var(--mos-type-ui-strong)', color: 'var(--mos-text-strong)' }}>{r.lib}</span><span className="mos-count">{r.from} → {r.to}</span><span className="mos-help">· {r.schema.length} schema changes · {r.pages.length} pages</span></summary>
      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {table(r.schema)}
        <div className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Affected pages</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{r.pages.map(p => <div key={p[0]} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid var(--mos-border-subtle)', flexWrap: 'wrap' }}><span style={{ font: 'var(--mos-type-ui-strong)', color: 'var(--mos-text-strong)', flex: 1, minWidth: 180 }}>{p[0]}</span><span className="mos-count">{p[1]} change{p[1] > 1 ? 's' : ''}</span><MQ.Button size="sm" iconRight="arrow-up-right">Open in builder</MQ.Button></div>)}</div>
      </div>
    </details>)}
    <div className="mos-caps" style={{ color: 'var(--mos-text-muted)' }}>Legacy bindings and overrides</div>
    {mob ? LEGACY.map(l => <MQ.Card key={l[0] + l[2]} title={l[0]} meta={l[1]} aside={chg(l[2])}><div className="mos-help">{l[3]} Remove it to edit this field again.</div><div style={{ marginTop: 8 }}><MQ.Button size="sm">Open in builder</MQ.Button></div></MQ.Card>) :
      <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th>Page</th><th>Component</th><th>Kind</th><th>Detail</th><th /></tr></thead><tbody>{LEGACY.map(l => <tr key={l[0] + l[2]}><td style={{ color: 'var(--mos-text-strong)', fontWeight: 500 }}>{l[0]}</td><td>{l[1]}</td><td>{chg(l[2])}</td><td className="mos-help">{l[3]} Remove it to edit this field again.</td><td><MQ.Button size="sm" iconRight="arrow-up-right">Open in builder</MQ.Button></td></tr>)}</tbody></table></div>}
  </div></MosRegion>;
}

const USAGE = [
  ['Card', 'Civic UI', 24, 71, 18, 'ready'], ['Section', 'Mosaic Starter', 38, 96, 0, 'ready'], ['Columns', 'Mosaic Starter', 17, 22, 9, 'ready'], ['Heading', 'Mosaic Starter', 36, 88, 4, 'ready'],
  ['Accordion', 'Mosaic Starter', 9, 11, 0, 'ready'], ['Hero', 'Civic UI', 12, 12, 0, 'attention'], ['Teaser', 'Olivero', 6, 19, 19, 'ready'], ['Stat', 'Civic UI', 3, 9, 7, 'attention']
];
function UsageReport({ vp, theme }) {
  const [lib, setLib] = React.useState('All libraries');
  const mob = vp === 'mobile';
  const rows = USAGE.filter(u => lib === 'All libraries' || u[1] === lib);
  return <MosRegion theme={theme}><div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ width: 200 }}><MQ.Select label="Library" size="sm" value={lib} onChange={e => setLib(e.target.value)} options={['All libraries', 'Mosaic Starter', 'Civic UI', 'Olivero']} /></div>
      <div style={{ width: 200 }}><MQ.Select label="Content type" size="sm" options={['All content types', 'Basic page', 'Article', 'Landing page']} /></div>
      <span style={{ flex: 1 }} /><span className="mos-help">38 pages use Mosaic layouts · 328 placements · 57 bound</span>
    </div>
    {mob ? rows.map(u => <MQ.Card key={u[0]} title={u[0]} meta={u[1]} aside={<MQ.Badge tone={u[5]} size="sm">{GRADE[u[5]]}</MQ.Badge>}><div className="mos-count">{u[2]} pages · {u[3]} placements · {u[4]} bound</div></MQ.Card>) :
      <div style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, overflow: 'auto' }}><table className="mos-table"><thead><tr><th>Component</th><th>Library</th><th>Pages</th><th>Placements</th><th>Bound</th><th>Readiness</th></tr></thead><tbody>{rows.map(u => <tr key={u[0]}><td style={{ color: 'var(--mos-text-strong)', fontWeight: 500 }}>{u[0]}</td><td>{u[1]}</td><td><MQ.Button size="sm" variant="link">{u[2]} pages</MQ.Button></td><td className="mos-count">{u[3]}</td><td className="mos-count" style={{ color: u[4] ? 'var(--mos-state-data-fg)' : undefined }}>{u[4]}</td><td><MQ.Badge tone={u[5]} size="sm">{GRADE[u[5]]}</MQ.Badge></td></tr>)}</tbody></table></div>}
    <div className="mos-help">Counts come from saved layouts. Unsaved changes aren't included.</div>
  </div></MosRegion>;
}

Object.assign(window, { ChangesReport, UsageReport });
