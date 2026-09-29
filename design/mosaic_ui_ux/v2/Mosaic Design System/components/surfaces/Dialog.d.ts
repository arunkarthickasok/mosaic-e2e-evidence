/** Modal dialog (CKEditor 5 modal, media library, front-end edit). Esc closes. inline=true renders without scrim. */
export interface DialogProps{ title:React.ReactNode; subtitle?:React.ReactNode; children?:React.ReactNode; footer?:React.ReactNode; onClose?:()=>void; width?:number|string; inline?:boolean; headAside?:React.ReactNode; bodyPadding?:number|string }
export declare function Dialog(props:DialogProps):JSX.Element;
