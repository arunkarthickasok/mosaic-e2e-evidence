/** Native select for enum/variant fields and field-map rows. */
export interface SelectOption{ value:string; label:string; disabled?:boolean }
export interface SelectProps{ label?:string; help?:string; error?:string; required?:boolean; options:(string|SelectOption)[]; value?:string; defaultValue?:string; onChange?:(e:any)=>void; size?:'sm'|'md'; id?:string; badge?:React.ReactNode }
export declare function Select(props:SelectProps):JSX.Element;
