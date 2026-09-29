/**
 * Mosaic button. Primary = one per surface (Save/Apply). "add" = dashed affordance for "+ Add image", "+ Add item".
 * @startingPoint section="Core" subtitle="Buttons in every variant" viewport="700x220"
 */
export interface ButtonProps{ variant?:'primary'|'secondary'|'ghost'|'add'|'danger'|'link'; size?:'sm'|'md'|'lg'; /** Lucide name, leading */ icon?:string; iconRight?:string; fullWidth?:boolean; disabled?:boolean; type?:'button'|'submit'; onClick?:(e:any)=>void; children?:React.ReactNode; className?:string }
export declare function Button(props:ButtonProps):JSX.Element;
