import React from 'react';
const BASE='https://unpkg.com/lucide-static@0.460.0/icons/';
export function Icon({name,size=16,label,className,style}){
  const url='url('+BASE+name+'.svg)';
  return <span className={'mos-icon'+(className?' '+className:'')} role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true} style={{width:size,height:size,WebkitMaskImage:url,maskImage:url,...style}}/>;
}
