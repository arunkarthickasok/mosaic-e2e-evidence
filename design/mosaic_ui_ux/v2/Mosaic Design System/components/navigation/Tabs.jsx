import React from 'react';
export function Tabs({tabs=[],value,onChange}){
  return <div className="mos-tabs" role="tablist">{tabs.map(t=><button key={t.id} role="tab" className="mos-tab" aria-selected={value===t.id} tabIndex={value===t.id?0:-1} onClick={()=>onChange&&onChange(t.id)}>{t.label}{t.count!=null&&<span className="mos-tab__count">{t.count}</span>}</button>)}</div>;
}
