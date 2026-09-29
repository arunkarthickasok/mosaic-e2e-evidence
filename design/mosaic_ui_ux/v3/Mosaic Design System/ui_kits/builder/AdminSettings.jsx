const MG = window.MosaicDesignSystem_9c1bff;

function FormGroup({ title, children }) {
  return <fieldset style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6, padding: '14px 16px 16px', margin: 0, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}><legend className="mos-caps" style={{ padding: '0 6px', color: 'var(--mos-text-muted)' }}>{title}</legend>{children}</fieldset>;
}

function SettingsForm({ vp, theme }) {
  const mob = vp === 'mobile';
  return <MosRegion theme={theme}><div style={{ padding: mob ? 14 : 20, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
    <FormGroup title="Editing">
      <MG.Toggle checked showState label="Front-end editing" description="Editors with permission can open the edit dialog on the live page." />
      <MG.Toggle checked showState label="Example previews" description="Untouched fields show example content marked EXAMPLE. Manage authoring can turn this off per component." />
    </FormGroup>
    <FormGroup title="Rich text and media">
      <MG.Select label="Text format for rich-text fields" options={['Basic HTML', 'Full HTML', 'Restricted HTML']} help="The CKEditor 5 modal opens with this format's toolbar." />
      <MG.Select label="Media type for Image fill" options={['Image', 'Remote image']} help="The media library opens filtered to this type." />
    </FormGroup>
    <FormGroup title="Accessibility">
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><MG.Icon name="lock" size={16} style={{ color: 'var(--mos-text-muted)', marginTop: 2 }} /><div style={{ flex: 1 }}><div className="mos-label">Alt text required at save</div><div className="mos-help">Always on. Save stops and focuses the field until alt text is set or the image is marked decorative.</div></div><MG.Badge tone="neutral" icon="lock">Always on</MG.Badge></div>
      <MG.Select label="Layout headings start at" options={['H2', 'H3']} help="Heading guidance checks each layout's outline from this level, below the page title (H1)." />
    </FormGroup>
    <div style={{ display: 'flex', gap: 8 }}><MG.Button variant="primary">Save configuration</MG.Button></div>
  </div></MosRegion>;
}

const GOV_LIBS = [
  { id: 'starter', name: 'Mosaic Starter', note: '14 components', on: true, mode: 'all' },
  { id: 'civic', name: 'Civic UI', note: '12 components · shadow DOM', on: true, mode: 'choose' },
  { id: 'olivero', name: 'Olivero', note: '6 components · theme-bound', on: false, mode: 'all' }
];

function Governance({ vp, theme, admin }) {
  const t = ADMIN_THEMES[admin];
  const mob = vp === 'mobile';
  const [libs, setLibs] = React.useState(GOV_LIBS);
  const [picks, setPicks] = React.useState(() => Object.fromEntries(MOS_DATA.civicComponents.map(c => [c.name, c.on && c.grade !== 'blocked' && c.name !== 'Stat'])));
  const civic = libs.find(l => l.id === 'civic');
  const civicCount = Object.values(picks).filter(Boolean).length;
  const total = (libs[0].on ? 14 : 0) + (civic.on ? (civic.mode === 'all' ? 11 : civicCount) : 0) + (libs[2].on ? 6 : 0);
  const vtabs = ['Submission form settings', 'Publishing options', 'Display settings', 'Menu settings', 'Mosaic layout'];
  const setLib = (id, k, v) => setLibs(libs.map(l => l.id === id ? { ...l, [k]: v } : l));
  const section = <MosRegion theme={theme}><div style={{ padding: mob ? 14 : 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span className="mos-label">Layout field</span><span className="mos-fieldrow__machine">field_layout</span><span style={{ flex: 1 }} /><span className="mos-help" role="status">{total} components available to Basic page editors</span></div>
    {libs.map(l => <div key={l.id} style={{ border: '1px solid var(--mos-border-subtle)', borderRadius: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', flexWrap: 'wrap' }}>
        <MG.Toggle checked={l.on} showState onChange={() => setLib(l.id, 'on', !l.on)} label={l.name} description={l.note} />
        <span style={{ flex: 1 }} />
        {l.on && <MG.Segmented size="sm" label={l.name + ' components'} value={l.mode} onChange={v => setLib(l.id, 'mode', v)} options={[{ id: 'all', label: 'All components' }, { id: 'choose', label: 'Choose components' }]} />}
      </div>
      {l.on && l.mode === 'choose' && l.id === 'civic' && <div style={{ borderTop: '1px solid var(--mos-border-subtle)', padding: '10px 12px', display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(2,minmax(0,1fr))', gap: '10px 20px' }}>
        {MOS_DATA.civicComponents.map(c => <div key={c.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}><MG.Checkbox checked={!!picks[c.name]} disabled={c.grade === 'blocked' || !c.on} onChange={() => setPicks({ ...picks, [c.name]: !picks[c.name] })} label={c.name} description={!c.on ? 'Off on the libraries page' : c.grade === 'blocked' ? 'Blocked: ' + c.reason : c.grade === 'attention' ? c.reason : undefined} /><span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>{c.restricted && <MG.Badge tone="restricted" size="sm">Admin only</MG.Badge>}{c.grade !== 'ready' && <MG.Badge tone={c.grade} size="sm">{GRADE[c.grade]}</MG.Badge>}</span></div>)}
      </div>}
    </div>)}
    <div className="mos-help">Admin only components stay available to administrators. Pages that already use a component you turn off keep it; editors can't add new ones.</div>
  </div></MosRegion>;
  return <DrupalShell admin={admin} vp={vp} pageTitle="Edit Basic page content type" crumbs={['Home', 'Administration', 'Structure', 'Content types']} footer={t2 => <><AdminBtn t={t2}>Save content type</AdminBtn><AdminBtn t={t2} kind="danger">Delete</AdminBtn></>}>
    <div style={{ marginBottom: 20, maxWidth: 520 }}><div style={{ font: '600 14px ' + t.font, marginBottom: 6 }}>Name <span style={{ color: '#d72222' }}>*</span></div><div style={{ border: t.input, borderRadius: t.radius, padding: '10px 12px', background: '#fff' }}>Basic page</div></div>
    <div style={{ display: 'flex', flexDirection: mob ? 'column' : 'row', border: '1px solid ' + t.line, borderRadius: t.radius, background: '#fff' }}>
      <div style={{ width: mob ? '100%' : 220, flex: 'none', background: t.head, borderRight: mob ? 0 : '1px solid ' + t.line, borderBottom: mob ? '1px solid ' + t.line : 0 }}>{vtabs.map(v => <div key={v} style={{ padding: '12px 14px', font: (v === 'Mosaic layout' ? '700' : '400') + ' 14px ' + t.font, color: v === 'Mosaic layout' ? t.primary : t.ink, background: v === 'Mosaic layout' ? '#fff' : 'none', borderBottom: '1px solid ' + t.line, borderLeft: v === 'Mosaic layout' ? '4px solid ' + t.primary : '4px solid transparent', display: mob && v !== 'Mosaic layout' ? 'none' : 'block' }}>{v}{v === 'Mosaic layout' && <div style={{ font: '400 12px ' + t.font, color: t.muted }}>{total} components</div>}</div>)}</div>
      <div style={{ flex: 1, minWidth: 0, padding: mob ? 12 : 18 }}>{section}</div>
    </div>
  </DrupalShell>;
}

Object.assign(window, { SettingsForm, Governance });
