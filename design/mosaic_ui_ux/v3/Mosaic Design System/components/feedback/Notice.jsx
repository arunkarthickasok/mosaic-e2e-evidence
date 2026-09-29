import React from 'react';
import { Banner } from './Banner.jsx';
import { Button } from '../core/Button.jsx';
const KINDS={
  removed:{tone:'error',icon:'triangle-alert',label:'Removed'},
  type:{tone:'attention',icon:'flag',label:'Type changed'},
  attention:{tone:'attention',icon:'circle-alert',label:'Attention'},
  'legacy-binding':{tone:'data',icon:'history',label:'Legacy binding — remove to edit'},
  'legacy-override':{tone:'info',icon:'history',label:'Legacy override — remove to edit'}
};
export function Notice({kind='attention',field,children,actionLabel='Remove',onAction}){
  const k=KINDS[kind]||KINDS.attention;
  return <Banner tone={k.tone} compact icon={k.icon} title={<span>{k.label}{field&&<span style={{fontWeight:400,color:'var(--mos-text-muted)'}}> · {field}</span>}</span>} actions={onAction&&<Button size="sm" onClick={onAction}>{actionLabel}</Button>}>{children}</Banner>;
}
