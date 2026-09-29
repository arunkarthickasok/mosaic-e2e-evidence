const MS = window.MosaicDesignSystem_9c1bff;

function SiteHeader({ vp, editor }) {
  const mob = vp === 'mobile';
  return <div>
    {editor && <div style={{ background: '#0f0f0f', color: '#fff', height: 34, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 14, font: '600 12px -apple-system,Segoe UI,sans-serif' }}>☰ Manage<span style={{ marginLeft: 'auto' }}>✎ Edit layout</span></div>}
    <div style={{ background: '#1b2a4a', color: '#fff', padding: mob ? '14px 16px' : '18px 40px', display: 'flex', alignItems: 'center', gap: 24 }}>
      <span style={{ font: '600 18px Lora,Georgia,serif' }}>Department of Transportation</span>
      {!mob && <span style={{ marginLeft: 'auto', display: 'flex', gap: 22, font: '15px "Source Sans 3",sans-serif', opacity: .9 }}><span>Safety</span><span>Grants</span><span>Data</span><span>About</span></span>}
      {mob && <span style={{ marginLeft: 'auto', font: '20px sans-serif' }}>☰</span>}
    </div>
  </div>;
}

function LiveBody({ vp, withCard = true, notice, selected }) {
  const mob = vp === 'mobile';
  const n = mob ? 1 : vp === 'tablet' ? 2 : 3;
  const card = <SiteCard title="Road Safety Initiative 2026" body="A federal–state partnership to reduce highway fatalities 15% by 2028." />;
  return <div style={{ background: '#fff', padding: mob ? '24px 16px 48px' : '40px 40px 64px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1120, margin: '0 auto' }}>
    {notice}
    <SiteHeading size={mob ? 26 : 36} sub="The National Highway Traffic Safety Administration publishes annual safety data for all 50 states, at county level from fiscal year 2024.">Federal Highway Safety Standards 2026</SiteHeading>
    <CardRow cols={n}>
      <SiteCard title="Work-zone safety" body="Updated temporary traffic control guidance for 2026." />
      {withCard && (selected ? <Sel on label="Card · Civic UI" index="04" toolbar={<MS.SelectionToolbar onParent={() => {}} onDuplicate={() => {}} onRemove={() => {}} compact />}>{card}</Sel> : card)}
      {n > 2 && <SiteCard title="RAISE grants" body="Funding for local and regional transportation projects." />}
    </CardRow>
    <div><div style={{ font: hf(24), color: site.ink, marginBottom: 8 }}>Data and reports</div><p style={{ font: site.p, margin: 0, color: site.body }}>County-level fatality data, crash reports and research summaries.</p></div>
  </div>;
}

function FrontEndEdit({ vp, theme, onOpenRich }) {
  const mob = vp === 'mobile';
  const w = vp === 'desktop' ? 400 : 380;
  const [stale, setStale] = React.useState(false);
  const bump = () => { setStale(true); clearTimeout(window.__feT); window.__feT = setTimeout(() => setStale(false), 1400); };
  const panel = <div className="mosaic" data-mosaic-theme={theme} onChangeCapture={bump} style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--mos-surface-chrome)', border: '1px solid var(--mos-border-default)', borderRadius: mob ? '12px 12px 0 0' : 8, boxShadow: 'var(--mos-shadow-dialog)', overflow: 'hidden' }} role="dialog" aria-label="Edit Card">
    {mob && <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 0' }}><span style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--mos-border-strong)' }} /></div>}
    <div style={{ flex: 1, minHeight: 0 }}><RailCard onOpenRich={onOpenRich} /></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderTop: '1px solid var(--mos-border-subtle)' }}><MS.SyncStatus state={stale ? 'stale' : 'unsaved'} onRevert={() => {}} /><span style={{ flex: 1 }} /><MS.Button size="sm">Cancel</MS.Button><MS.Button size="sm" variant="primary">Save</MS.Button></div>
  </div>;
  return <div style={{ position: 'relative', minHeight: '100%', background: '#fff' }}>
    <SiteHeader vp={vp} editor />
    <div style={{ paddingRight: mob ? 0 : w + 24 }}><div className={stale ? 'mosaic mos-stale' : ''}><LiveBody vp={mob ? 'mobile' : 'tablet'} selected /></div></div>
    <div style={mob ? { position: 'absolute', left: 0, right: 0, bottom: 0, height: '64%' } : { position: 'absolute', top: 96, right: 16, width: w, bottom: 16 }}>{panel}</div>
  </div>;
}

function MissingPages({ vp, theme, mode }) {
  if (mode === 'visitor') return <div style={{ background: '#fff', minHeight: '100%' }}><SiteHeader vp={vp} /><LiveBody vp={vp} withCard={false} /></div>;
  return <div style={{ background: '#fff', minHeight: '100%' }}><SiteHeader vp={vp} editor /><LiveBody vp={vp} withCard={false} notice={<div className="mosaic" data-mosaic-theme={theme}><MS.Banner tone="info" icon="unplug" title="1 component isn't showing: Card (Civic UI)" actions={<MS.Button size="sm" iconRight="arrow-up-right">Open in builder</MS.Button>}>The Civic UI library is missing. Its values are kept. Only editors see this notice.</MS.Banner></div>} /></div>;
}

function RichTextModal({ onClose, theme, vp }) {
  const mob = vp === 'mobile';
  return <div className="mosaic" data-mosaic-theme={theme} style={{ position: 'absolute', inset: 0, background: 'var(--mos-surface-overlay)', display: 'flex', alignItems: mob ? 'flex-end' : 'center', justifyContent: 'center', padding: mob ? 0 : 24, zIndex: 100 }}>
    <MS.Dialog inline width={mob ? '100%' : 640} title="Summary" subtitle="Card · Civic UI · formatted text" onClose={onClose} bodyPadding={0} footer={<><span className="mos-help">Text format: Basic HTML</span><span style={{ flex: 1 }} /><MS.Button onClick={onClose}>Cancel</MS.Button><MS.Button variant="primary" onClick={onClose}>Apply</MS.Button></>}>
      <div style={{ borderBottom: '1px solid var(--mos-border-subtle)', display: 'flex', gap: 2, padding: 6, background: 'var(--mos-surface-sunken)', flexWrap: 'wrap' }}>{['bold', 'italic', 'link', 'list', 'list-ordered', 'quote'].map(i => <MS.IconButton key={i} size="sm" icon={i} label={i} />)}<span className="mos-seltool__sep" style={{ background: 'var(--mos-border-default)', alignSelf: 'center' }} /><MS.Button size="sm" variant="ghost" icon="image-plus">Insert media</MS.Button><MS.Select size="sm" options={['Paragraph', 'Heading 3', 'Heading 4']} /></div>
      <div style={{ padding: '18px 20px', minHeight: 180, font: site.p, color: '#222', background: '#fff' }} contentEditable suppressContentEditableWarning>A federal–state partnership to reduce highway fatalities <b>15% by 2028</b>. RAISE Act grant funding is available to states and tribes.</div>
      <div className="mos-help" style={{ padding: '8px 20px', borderTop: '1px solid var(--mos-border-subtle)' }}>Drupal's CKEditor 5 with this site's toolbar. Insert media opens the media library.</div>
    </MS.Dialog>
  </div>;
}

Object.assign(window, { SiteHeader, LiveBody, FrontEndEdit, MissingPages, RichTextModal });
