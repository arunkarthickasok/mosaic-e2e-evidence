/** Single-line text field with label, help and error. Used for every plain-text schema field. */
export interface InputProps{ label?:string; help?:string; error?:string; required?:boolean; id?:string; prefix?:string; suffix?:string; mono?:boolean; readOnly?:boolean; size?:'sm'|'md'; badge?:React.ReactNode; value?:string; defaultValue?:string; placeholder?:string; onChange?:(e:any)=>void; inputRef?:any }
export declare function Input(props:InputProps):JSX.Element;
