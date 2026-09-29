import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function Zone({label,index,children,empty,emptyText,addLabel='Add',onAdd,required,state,count,rule,footer,style}){
  return <div className={cx('mos-zone',required&&empty&&'mos-zone--required',state&&'mos-zone--'+state)} style={style} role="group" aria-label={label+' area'}>
    <div className="mos-zone__head"><span className="mos-zone__label">{index&&<span className="mos-index">{index}</span>}{label}{required&&<span aria-label="required">*</span>}</span><span className="mos-zone__meta">{rule&&<span className="mos-index">{rule}</span>}{count}{!empty&&onAdd&&<button className="mos-zone__add" aria-label={'Add to '+label} onClick={onAdd}><Icon name="plus" size={14}/></button>}</span></div>
    {empty?<div className="mos-zone__empty">{emptyText&&<span>{emptyText}</span>}{onAdd&&<button className="mos-zone__cta" onClick={onAdd}><Icon name="plus" size={14}/>{addLabel}</button>}</div>:children}
    {footer&&<div className="mos-zone__foot">{footer}</div>}
  </div>;
}
