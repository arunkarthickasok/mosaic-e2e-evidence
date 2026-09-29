import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function RailSection({index,title,aside,note,children,collapsed:ctl,defaultCollapsed=false,onToggle}){
  const [open,setOpen]=React.useState(!defaultCollapsed);
  const collapsed=ctl!==undefined?ctl:!open;
  return <section className="mos-rs" data-collapsed={collapsed}>
    <button className="mos-rs__head" aria-expanded={!collapsed} onClick={()=>{setOpen(!open);onToggle&&onToggle()}}><span className="mos-index">{index}</span><span className="mos-rs__title">{title}</span><span className="mos-rs__aside">{aside}<Icon name="chevron-down" size={14} className="mos-rs__chev"/></span></button>
    {!collapsed&&<div className="mos-rs__body">{note&&<div className="mos-rs__note">{note}</div>}{children}</div>}
  </section>;
}
