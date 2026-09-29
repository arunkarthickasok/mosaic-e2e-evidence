import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Toast({icon='info',children,action,onAction,onClose}){
  return <div className="mos-toast" role="status" aria-live="polite"><Icon name={icon} size={16}/><span>{children}</span>{action&&<button className="mos-toast__action" onClick={onAction}>{action}</button>}{onClose&&<button className="mos-toast__close" aria-label="Dismiss" onClick={onClose}><Icon name="x" size={14}/></button>}</div>;
}
