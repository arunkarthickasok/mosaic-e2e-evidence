import React from 'react';
import { SelectionToolbar } from '../navigation/SelectionToolbar.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');
const ROOM=46;
export function SelectionFrame({label,index,mode='selected',toolbar,children,style,placement='auto'}){
  const ref=React.useRef(null);
  const [below,setBelow]=React.useState(placement==='below');
  React.useLayoutEffect(()=>{
    if(placement!=='auto'){setBelow(placement==='below');return;}
    const el=ref.current;if(!el)return;
    const root=el.closest('[data-mos-canvas]')||el.parentElement;
    const check=()=>{
      const r=el.getBoundingClientRect(),R=root.getBoundingClientRect();
      const k=el.offsetWidth?r.width/el.offsetWidth:1;
      let flip=(r.top-R.top)/k<ROOM;
      const tb={top:r.top-ROOM*k,bottom:r.top-8*k,left:r.right-260*k,right:r.right+6*k};
      root.querySelectorAll('.mos-marks__tab').forEach(t=>{if(el.contains(t))return;const q=t.getBoundingClientRect();if(q.left<tb.right&&q.right>tb.left&&q.top<tb.bottom&&q.bottom>tb.top)flip=true;});
      setBelow(flip);
    };
    check();const ro=new ResizeObserver(check);ro.observe(root);return()=>ro.disconnect();
  },[placement]);
  return <div ref={ref} className={cx('mos-marks',below&&'mos-marks--flip',mode==='keyboard'&&'mos-marks--keyboard',mode==='lifted'&&'mos-marks--lifted')} style={style} data-placement={below?'below':'above'}>
    <span className="mos-marks__b"/>
    {label&&<span className="mos-marks__tab">{index&&<span className="mos-index">{index}</span>}{label}</span>}
    {toolbar&&<div className="mos-marks__tool">{toolbar===true?<SelectionToolbar onParent={()=>{}} onMoveUp={()=>{}} onMoveDown={()=>{}} onKeyboardMove={()=>{}} onWrap={()=>{}} onDuplicate={()=>{}} onRemove={()=>{}}/>:toolbar}</div>}
    {children}
  </div>;
}
