import React from 'react';
import { SelectionToolbar } from '../navigation/SelectionToolbar.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function SelectionFrame({label,index,mode='selected',toolbar,children,style}){
  return <div className={cx('mos-marks',mode==='keyboard'&&'mos-marks--keyboard',mode==='lifted'&&'mos-marks--lifted')} style={style}>
    <span className="mos-marks__b"/>
    {label&&<span className="mos-marks__tab">{index&&<span className="mos-index">{index}</span>}{label}</span>}
    {toolbar&&<div className="mos-marks__tool">{toolbar===true?<SelectionToolbar onParent={()=>{}} onMoveUp={()=>{}} onMoveDown={()=>{}} onKeyboardMove={()=>{}} onWrap={()=>{}} onDuplicate={()=>{}} onRemove={()=>{}}/>:toolbar}</div>}
    {children}
  </div>;
}
