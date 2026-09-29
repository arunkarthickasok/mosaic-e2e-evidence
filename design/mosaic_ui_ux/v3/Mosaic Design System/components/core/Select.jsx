import React from 'react';
import { Icon } from './Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function Select({label,help,options=[],id,size='md',badge,required,error,...rest}){
  const iid=id||('mos-sel-'+Math.random().toString(36).slice(2,8));
  return <div className="mos-field">
    {label&&<div className="mos-field__head"><label className="mos-label" htmlFor={iid}>{label}{required&&<span className="mos-req" aria-hidden="true"> *</span>}</label>{badge}</div>}
    <div className={cx('mos-control','mos-control--select',size==='sm'&&'mos-control--sm',error&&'mos-control--error')}>
      <select id={iid} {...rest}>{options.map(o=>typeof o==='string'?<option key={o} value={o}>{o}</option>:<option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}</select>
      <Icon name="chevrons-up-down" size={14}/>
    </div>
    {error?<div className="mos-err"><Icon name="circle-alert" size={14}/>{error}</div>:help&&<div className="mos-help">{help}</div>}
  </div>;
}
