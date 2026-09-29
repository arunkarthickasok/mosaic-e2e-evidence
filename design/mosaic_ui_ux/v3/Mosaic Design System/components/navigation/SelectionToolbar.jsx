import React from 'react';
import { Icon } from '../core/Icon.jsx';
const B=({icon,label,onClick})=><button className="mos-seltool__btn" aria-label={label} title={label} onClick={onClick}><Icon name={icon} size={14}/></button>;
export function SelectionToolbar({label,index,onParent,onMoveUp,onMoveDown,onKeyboardMove,onWrap,onDuplicate,onRemove,compact}){
  return <div className="mos-seltool" role="toolbar" aria-label={(label||'Component')+' actions'}>
    {label&&<span className="mos-seltool__label">{index&&<span className="mos-index">{index}</span>}{label}</span>}
    {onParent&&<B icon="arrow-up-left" label="Select parent" onClick={onParent}/>}
    {!compact&&onMoveUp&&<B icon="arrow-up" label="Move up" onClick={onMoveUp}/>}
    {!compact&&onMoveDown&&<B icon="arrow-down" label="Move down" onClick={onMoveDown}/>}
    {onKeyboardMove&&<B icon="move" label="Move with keyboard (M)" onClick={onKeyboardMove}/>}
    <span className="mos-seltool__sep"/>
    {onWrap&&<B icon="square-dashed-bottom" label="Wrap in container" onClick={onWrap}/>}
    {onDuplicate&&<B icon="copy" label="Duplicate" onClick={onDuplicate}/>}
    {onRemove&&<B icon="trash-2" label="Remove" onClick={onRemove}/>}
  </div>;
}
