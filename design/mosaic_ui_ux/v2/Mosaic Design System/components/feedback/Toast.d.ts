/** Transient, non-blocking confirmation on the inverse surface, e.g. auto-wrap "Placed inside a new Section". */
export interface ToastProps{ icon?:string; children?:React.ReactNode; action?:string; onAction?:()=>void; onClose?:()=>void }
export declare function Toast(props:ToastProps):JSX.Element;
