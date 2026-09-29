import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({title,subtitle,children,footer,onClose,width=560,inline,headAside,bodyPadding=16}){
  React.useEffect(()=>{if(inline||!onClose)return;const k=e=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[inline,onClose]);
  const box=<div className="mos-dialog" role="dialog" aria-modal={inline?undefined:true} aria-label={typeof title==='string'?title:undefined} style={{width}}>
    <div className="mos-dialog__head"><div style={{flex:1,minWidth:0}}><div className="mos-dialog__title">{title}</div>{subtitle&&<div className="mos-dialog__sub">{subtitle}</div>}</div>{headAside}{onClose&&<IconButton icon="x" label="Close" onClick={onClose}/>}</div>
    <div className="mos-dialog__body" style={{padding:bodyPadding}}>{children}</div>
    {footer&&<div className="mos-dialog__foot">{footer}</div>}
  </div>;
  return inline?box:<div className="mos-dialog-scrim">{box}</div>;
}
