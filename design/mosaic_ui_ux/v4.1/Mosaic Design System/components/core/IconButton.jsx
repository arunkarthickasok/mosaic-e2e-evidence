import React from 'react';
import { Icon } from './Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function IconButton({icon,label,variant='ghost',size='md',pressed,className,...rest}){
  return <button type="button" aria-label={label} title={label} aria-pressed={pressed===undefined?undefined:pressed} className={cx('mos-btn','mos-iconbtn','mos-btn--'+variant,size!=='md'&&'mos-btn--'+size,className)} {...rest}><Icon name={icon} size={size==='sm'?14:16}/></button>;
}
