import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Button } from '../core/Button.jsx';
import { Banner } from '../feedback/Banner.jsx';
export function Repeater({items=[],min,max,addLabel='Add item',onAdd,onRemove,onMove,onSelect,activeId,grabbedId,showRules=true}){
  const atFloor=min!=null&&items.length<=min;
  const atMax=max!=null&&items.length>=max;
  return <div style={{display:'flex',flexDirection:'column',gap:8}}>
  <div className="mos-rep" role="list">
    {items.length===0&&<div className="mos-rep__empty">No items yet.</div>}
    {items.map((it,i)=><div key={it.id} className="mos-rep__row" role="listitem" aria-label={it.summary+', '+(i+1)+' of '+items.length} data-active={activeId===it.id} data-grabbed={grabbedId===it.id} onClick={()=>onSelect&&onSelect(it.id)}>
      <span className="mos-rep__grip" aria-hidden="true"><Icon name="grip-vertical" size={14}/></span>
      <span className="mos-rep__sum"><b>{it.summary}</b>{it.meta&&<span>{it.meta}</span>}</span>
      <span className="mos-rep__acts"><IconButton size="sm" icon="arrow-up" label={'Move '+it.summary+' up'} disabled={i===0} onClick={e=>{e.stopPropagation();onMove&&onMove(it.id,-1)}}/><IconButton size="sm" icon="arrow-down" label={'Move '+it.summary+' down'} disabled={i===items.length-1} onClick={e=>{e.stopPropagation();onMove&&onMove(it.id,1)}}/><IconButton size="sm" icon="x" label={atFloor?'Can’t remove — at least '+min+' required':'Remove '+it.summary} disabled={atFloor} onClick={e=>{e.stopPropagation();onRemove&&onRemove(it.id)}}/></span>
    </div>)}
    <div className="mos-rep__foot"><Button variant="add" size="sm" icon="plus" onClick={onAdd} disabled={atMax}>{addLabel}</Button>{(min!=null||max!=null)&&<span className="mos-rep__count">{items.length}{max!=null?'/'+max:''}{min!=null?' · min '+min:''}</span>}</div>
  </div>
  {showRules&&min!=null&&items.length<min&&<Banner tone="attention" compact title={'Requires at least '+min+' item'+(min>1?'s':'')+' — '+items.length+'/'+min}/>}
  {showRules&&atFloor&&items.length>=min&&min>0&&<div className="mos-help" style={{display:'flex',gap:6,alignItems:'center'}}><Icon name="lock" size={12}/>Remove is off: this area needs at least {min}.</div>}
  {showRules&&atMax&&<Banner tone="info" compact icon="circle-slash" title={'Maximum reached — '+items.length+'/'+max}>Remove an item to add another.</Banner>}
  </div>;
}
