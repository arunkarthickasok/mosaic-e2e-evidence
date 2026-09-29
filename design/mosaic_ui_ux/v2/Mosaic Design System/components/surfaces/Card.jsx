import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function Card({title,meta,aside,children,footer,selected,interactive,onClick,style}){
  return <div className={cx('mos-card',interactive&&'mos-card--interactive',selected&&'mos-card--selected')} onClick={onClick} style={style}>
    {(title||meta||aside)&&<div className="mos-card__head"><div style={{flex:1,minWidth:0}}>{title&&<div className="mos-card__title">{title}</div>}{meta&&<div className="mos-card__meta">{meta}</div>}</div>{aside}</div>}
    {children&&<div className="mos-card__body">{children}</div>}
    {footer&&<div className="mos-card__foot">{footer}</div>}
  </div>;
}
