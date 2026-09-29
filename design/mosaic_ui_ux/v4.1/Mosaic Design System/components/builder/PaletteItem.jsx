import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function PaletteItem({name,blurb,icon='square',thumb,data,attention,restricted,needs,pattern,inserts,image,disabled,onClick}){
  return <button className={cx('mos-pal',pattern&&'mos-pal--pattern',disabled&&'mos-pal--disabled')} onClick={onClick} aria-disabled={disabled||undefined} draggable={!disabled}>
    <span className="mos-pal__thumb">{image?<img className="mos-pal__img" src={image} alt="" width="40" height="28"/>:thumb||<Icon name={icon} size={16}/>}</span>
    <span style={{minWidth:0}}>
      <span className="mos-pal__name">{name}{data&&<Badge tone="data" size="sm">DATA</Badge>}{attention&&<Badge tone="attention" size="sm">Attention</Badge>}{restricted&&<Badge tone="restricted" size="sm">Admin</Badge>}</span>
      {blurb&&<span className="mos-pal__blurb" style={{display:'block'}}>{blurb}</span>}
      {attention&&<span className="mos-pal__reason"><Icon name="corner-down-right" size={12}/>{attention}</span>}
      {needs&&<span className="mos-pal__needs"><Icon name="square-dashed" size={12}/>needs {needs}</span>}
      {inserts&&<span className="mos-pal__needs"><Icon name="layers" size={12}/>Inserts {inserts} components</span>}
    </span>
  </button>;
}
