/** Checkbox for multi-select (allowed children, capabilities, per-component picks). */
export interface CheckboxProps{ checked?:boolean; defaultChecked?:boolean; onChange?:(e:any)=>void; label?:React.ReactNode; description?:string; disabled?:boolean; indeterminate?:boolean; id?:string }
export declare function Checkbox(props:CheckboxProps):JSX.Element;
