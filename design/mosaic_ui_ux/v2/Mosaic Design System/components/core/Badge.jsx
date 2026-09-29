import React from 'react';
import { Icon } from './Icon.jsx';
const ICONS={ready:'check',attention:'triangle-alert',blocked:'ban',data:'database',restricted:'lock',example:null,neutral:null,accent:null};
export function Badge({tone='neutral',icon,size='md',children,title}){
  const ic=icon===false?null:(icon||ICONS[tone]);
  return <span className={'mos-badge mos-badge--'+tone+(size==='sm'?' mos-badge--sm':'')} title={title}>{ic&&<Icon name={ic} size={size==='sm'?10:12}/>}{children}</span>;
}
