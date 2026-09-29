import React from 'react';
import { Icon } from './Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function Button({variant='secondary',size='md',icon,iconRight,fullWidth,children,className,type='button',...rest}){
  const is=size==='sm'?14:16;
  return <button type={type} className={cx('mos-btn','mos-btn--'+variant,size!=='md'&&'mos-btn--'+size,fullWidth&&'mos-btn--full',className)} {...rest}>{icon&&<Icon name={icon} size={is}/>}{children}{iconRight&&<Icon name={iconRight} size={is}/>}</button>;
}
