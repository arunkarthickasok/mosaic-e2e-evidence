import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function ResultLine({state='populated',shown,total,view,display,error}){
  if(state==='failing')return <span className="mos-result mos-result--failing"><Icon name="circle-alert" size={12}/>{error||'View failed to load'} · {view}</span>;
  if(state==='empty')return <span className="mos-result mos-result--empty"><Icon name="circle-dashed" size={12}/><b>0</b> of 0 · {view}{display?' · '+display:''}</span>;
  return <span className="mos-result"><Icon name="database" size={12}/><b>{shown}</b> of {total} · {view}{display?' · '+display:''}</span>;
}
