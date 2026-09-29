import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';
export function MissingCard({library,component,values=[],binding,actions}){
  return <div className="mos-missing" role="group" aria-label={component+' — library missing'}>
    <div className="mos-missing__head"><Icon name="unplug" size={18} style={{color:'var(--mos-text-muted)',marginTop:1}}/><div style={{flex:1,minWidth:0}}><div style={{font:'var(--mos-type-ui-strong)',color:'var(--mos-text-strong)'}}>{component} <span style={{color:'var(--mos-text-muted)',fontWeight:400}}>· {library}</span></div><div className="mos-help">The {library} library isn't installed. Values are kept and will render again when it returns.</div></div><Badge tone="neutral" icon="eye">Read-only</Badge></div>
    {(values.length>0||binding)&&<dl className="mos-missing__vals">{values.map(v=><React.Fragment key={v.label}><dt>{v.label}</dt><dd>{v.value}</dd></React.Fragment>)}{binding&&<><dt>Content</dt><dd style={{color:'var(--mos-state-data-fg)'}}>bound to {binding}</dd></>}</dl>}
    {actions&&<div style={{display:'flex',gap:8,marginTop:10}}>{actions}</div>}
  </div>;
}
