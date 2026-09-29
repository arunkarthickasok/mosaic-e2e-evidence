import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Segmented({options=[],value,onChange,label,size='md'}){
  return <div className={'mos-seg'+(size==='sm'?' mos-seg--sm':'')} role="radiogroup" aria-label={label}>{options.map(o=><button key={o.id} role="radio" aria-checked={value===o.id} className="mos-seg__opt" onClick={()=>onChange&&onChange(o.id)} title={o.title}>{o.icon&&<Icon name={o.icon} size={size==='sm'?12:14}/>}{o.label}</button>)}</div>;
}
