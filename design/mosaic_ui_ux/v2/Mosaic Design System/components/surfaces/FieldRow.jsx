import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function FieldRow({label,help,required,badge,machineName,error,children,htmlFor,example}){
  return <div className={'mos-fieldrow'+(error?' mos-fieldrow--error':'')}>
    <div className="mos-fieldrow__head"><label className="mos-label" htmlFor={htmlFor}>{label}{required&&<span className="mos-req" aria-hidden="true"> *</span>}</label><span className="mos-fieldrow__aside">{badge}</span></div>
    {children}
    {error?<div className="mos-err"><Icon name="circle-alert" size={14}/>{error}</div>:example?<div className="mos-preview-only"><Icon name="eye" size={12}/>Preview only — set a value to publish</div>:help&&<div className="mos-help">{help}</div>}
    {machineName&&<details><summary className="mos-help" style={{cursor:'pointer'}}>Details</summary><div className="mos-fieldrow__machine">{machineName}</div></details>}
  </div>;
}
