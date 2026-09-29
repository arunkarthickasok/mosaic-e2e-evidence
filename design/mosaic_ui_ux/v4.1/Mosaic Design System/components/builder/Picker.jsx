import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Picker({groups=[],title,activeId,onSelect,onClose,query='',onQuery}){
  const flat=groups.flatMap(g=>g.items.filter(i=>!i.disabled));
  const [act,setAct]=React.useState(activeId||(flat[0]&&flat[0].id));
  const key=e=>{const i=flat.findIndex(x=>x.id===act);if(e.key==='ArrowDown'){e.preventDefault();setAct(flat[Math.min(flat.length-1,i+1)].id)}if(e.key==='ArrowUp'){e.preventDefault();setAct(flat[Math.max(0,i-1)].id)}if(e.key==='Enter'){onSelect&&onSelect(act)}if(e.key==='Escape'){onClose&&onClose()}};
  return <div className="mos-picker" onKeyDown={key} role="dialog" aria-label={title||'Add to area'}>
    <div className="mos-picker__search"><div className="mos-control mos-control--sm"><Icon name="search" size={14} style={{color:'var(--mos-text-faint)'}}/><input autoFocus placeholder={title||'Search components'} value={query} onChange={e=>onQuery&&onQuery(e.target.value)} role="combobox" aria-expanded="true" aria-activedescendant={'pk-'+act}/></div></div>
    <div className="mos-picker__list" role="listbox">{groups.map(g=><div key={g.label} role="group" aria-label={g.label}><div className="mos-picker__group">{g.label}</div>{g.items.map(it=><div key={it.id} id={'pk-'+it.id} role="option" className="mos-picker__opt" aria-selected={act===it.id} aria-disabled={it.disabled||undefined} onMouseEnter={()=>!it.disabled&&setAct(it.id)} onClick={()=>!it.disabled&&onSelect&&onSelect(it.id)}><span className="mos-picker__ico"><Icon name={it.icon||'square'} size={14}/></span><span style={{minWidth:0,flex:1}}><span style={{display:'block',font:'var(--mos-type-ui-strong)',color:'var(--mos-text-strong)'}}>{it.name}</span>{(it.reason||it.blurb)&&<span className="mos-help" style={{display:'block',color:it.reason?'var(--mos-state-attention-fg)':undefined}}>{it.reason||it.blurb}</span>}</span>{it.preferred&&<span className="mos-badge mos-badge--accent mos-badge--sm">Preferred</span>}</div>)}</div>)}</div>
    <div className="mos-picker__foot"><span><span className="mos-kbd">↑</span> <span className="mos-kbd">↓</span> choose</span><span><span className="mos-kbd">↵</span> insert</span><span><span className="mos-kbd">Esc</span> close</span></div>
  </div>;
}
