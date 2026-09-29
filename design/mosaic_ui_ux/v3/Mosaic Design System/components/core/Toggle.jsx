import React from 'react';
export function Toggle({checked,defaultChecked,onChange,label,description,disabled,showState,id}){
  return <label className="mos-toggle"><input type="checkbox" role="switch" id={id} checked={checked} defaultChecked={defaultChecked} onChange={onChange} disabled={disabled}/><span className="mos-toggle__track"/>{showState&&<span className="mos-toggle__state">{checked?'On':'Off'}</span>}{(label||description)&&<span className="mos-choice__text">{label&&<span className="mos-label">{label}</span>}{description&&<span className="mos-help">{description}</span>}</span>}</label>;
}
