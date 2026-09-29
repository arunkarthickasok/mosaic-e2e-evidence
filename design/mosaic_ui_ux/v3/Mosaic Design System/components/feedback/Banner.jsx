import React from 'react';
import { Icon } from '../core/Icon.jsx';
const ICONS={info:'info',attention:'triangle-alert',error:'circle-alert',success:'circle-check',data:'database',owned:'lock'};
export function Banner({tone='info',title,children,actions,compact,icon,role}){
  return <div className={'mos-banner mos-banner--'+tone+(compact?' mos-banner--compact':'')} role={role||(tone==='error'?'alert':undefined)}>
    <Icon name={icon||ICONS[tone]} size={16}/>
    {title&&<div className="mos-banner__title">{title}</div>}
    {children&&<div className="mos-banner__body" style={title?null:{gridRow:1}}>{children}</div>}
    {actions&&<div className="mos-banner__actions">{actions}</div>}
  </div>;
}
