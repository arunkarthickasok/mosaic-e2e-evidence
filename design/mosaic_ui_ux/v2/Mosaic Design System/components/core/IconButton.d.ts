/** Square icon-only button; label is required and becomes aria-label + tooltip. */
export interface IconButtonProps{ icon:string; label:string; variant?:'ghost'|'secondary'|'primary'|'danger'; size?:'sm'|'md'; pressed?:boolean; disabled?:boolean; onClick?:(e:any)=>void; className?:string }
export declare function IconButton(props:IconButtonProps):JSX.Element;
