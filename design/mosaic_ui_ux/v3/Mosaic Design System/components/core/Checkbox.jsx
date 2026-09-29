import React from 'react';
import { Icon } from './Icon.jsx';
export function Checkbox({checked,defaultChecked,onChange,label,description,disabled,indeterminate,id}){
  const ref=React.useRef(null);
  React.useEffect(()=>{if(ref.current)ref.current.indeterminate=!!indeterminate},[indeterminate]);
  const on=checked||indeterminate;
  return <label className="mos-check"><input ref={ref} type="checkbox" id={id} checked={checked} defaultChecked={defaultChecked} onChange={onChange} disabled={disabled}/><span className="mos-check__box">{on&&<Icon name={indeterminate?'minus':'check'} size={12}/>}</span>{(label||description)&&<span className="mos-choice__text">{label&&<span>{label}</span>}{description&&<span className="mos-help">{description}</span>}</span>}</label>;
}
