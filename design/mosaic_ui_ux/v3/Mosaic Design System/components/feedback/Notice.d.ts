/** Library-change and legacy notice family for rail rows: ⚠ Removed, ⚑ Type changed, ! Attention, Legacy binding, Legacy override. */
export interface NoticeProps{ kind:'removed'|'type'|'attention'|'legacy-binding'|'legacy-override'; /** Field or component the notice is about */ field?:string; children?:React.ReactNode; actionLabel?:string; onAction?:()=>void }
export declare function Notice(props:NoticeProps):JSX.Element;
