import React from 'react';
import { Icon } from './Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function Input({label,help,error,required,id,prefix,suffix,mono,readOnly,size='md',badge,inputRef,...rest}){
  const iid=id||('mos-in-'+Math.random().toString(36).slice(2,8));
  return <div className="mos-field">
    {label&&<div className="mos-field__head"><label className="mos-label" htmlFor={iid}>{label}{required&&<span className="mos-req" aria-hidden="true"> *</span>}</label>{badge}</div>}
    <div className={cx('mos-control',error&&'mos-control--error',readOnly&&'mos-control--readonly',mono&&'mos-control--mono',size==='sm'&&'mos-control--sm')}>
      {prefix&&<span className="mos-affix">{prefix}</span>}
      <input id={iid} ref={inputRef} readOnly={readOnly} required={required} aria-invalid={error?true:undefined} aria-describedby={(error||help)?iid+'-d':undefined} {...rest}/>
      {suffix&&<span className="mos-affix">{suffix}</span>}
    </div>
    {error?<div className="mos-err" id={iid+'-d'}><Icon name="circle-alert" size={14}/>{error}</div>:help?<div className="mos-help" id={iid+'-d'}>{help}</div>:null}
  </div>;
}
