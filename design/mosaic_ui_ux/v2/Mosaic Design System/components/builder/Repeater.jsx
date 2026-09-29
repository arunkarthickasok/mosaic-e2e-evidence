import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Button } from '../core/Button.jsx';
export function Repeater({items=[],min,max,addLabel='Add item',onAdd,onRemove,onMove,onSelect,activeId,grabbedId}){
  return <div className="mos-rep" role="list">
    {items.length===0&&<div className="mos-rep__empty">No items yet.</div>}
    {items.map((it,i)=><div key={it.id} className="mos-rep__row" role="listitem" data-active={activeId===it.id} data-grabbed={grabbedId===it.id} onClick={()=>onSelect&&onSelect(it.id)}>
      <span className="mos-rep__grip" aria-hidden="true"><Icon name="grip-vertical" size={14}/></span>
      <span className="mos-rep__n">{String(i+1).padStart(2,'0')}</span>
      <span className="mos-rep__sum"><b>{it.summary}</b>{it.meta&&<span>{it.meta}</span>}</span>
      <span className="mos-rep__acts"><IconButton size="sm" icon="arrow-up" label={'Move '+it.summary+' up'} disabled={i===0} onClick={e=>{e.stopPropagation();onMove&&onMove(it.id,-1)}}/><IconButton size="sm" icon="arrow-down" label={'Move '+it.summary+' down'} disabled={i===items.length-1} onClick={e=>{e.stopPropagation();onMove&&onMove(it.id,1)}}/><IconButton size="sm" icon="x" label={'Remove '+it.summary} disabled={min!=null&&items.length<=min&&false} onClick={e=>{e.stopPropagation();onRemove&&onRemove(it.id)}}/></span>
    </div>)}
    <div className="mos-rep__foot"><Button variant="add" size="sm" icon="plus" onClick={onAdd} disabled={max!=null&&items.length>=max}>{addLabel}</Button>{(min!=null||max!=null)&&<span className="mos-rep__count">{items.length}{max!=null?'/'+max:''}{min!=null&&max==null?' · min '+min:''}</span>}</div>
  </div>;
}
