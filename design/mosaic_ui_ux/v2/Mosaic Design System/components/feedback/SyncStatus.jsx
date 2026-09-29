import React from 'react';
const LABEL={synced:'In sync with the saved layout',unsaved:'Unsaved changes',stale:'Refreshing preview…'};
export function SyncStatus({state='synced',components,bound,onRevert,wcag}){
  return <div className={'mos-sync mos-sync--'+state} role="status" aria-live="polite">
    <span className="mos-sync__dot" aria-hidden="true"/><span className="mos-sync__label">{LABEL[state]}</span>
    {state==='unsaved'&&onRevert&&<button className="mos-btn mos-btn--link" style={{fontSize:12}} onClick={onRevert}>Revert to saved</button>}
    {components!=null&&<><span className="mos-sync__sep">·</span><span>{components} components</span></>}
    {bound!=null&&<><span className="mos-sync__sep">·</span><span>{bound} bound</span></>}
    {wcag&&<><span className="mos-sync__sep">·</span><span>{wcag}</span></>}
  </div>;
}
