/** The author-trust status line: saved/unsaved/refreshing, revert, component + bound counts, WCAG summary. */
export interface SyncStatusProps{ state?:'synced'|'unsaved'|'stale'; components?:number; bound?:number; wcag?:string; onRevert?:()=>void }
export declare function SyncStatus(props:SyncStatusProps):JSX.Element;
