/** Repeater list for single-child slots: summary rows, drag grip + keyboard up/down, remove, "+ Add item", count. */
export interface RepeaterItem{ id:string; summary:string; meta?:string }
export interface RepeaterProps{ items:RepeaterItem[]; min?:number; max?:number; addLabel?:string; onAdd?:()=>void; onRemove?:(id:string)=>void; onMove?:(id:string,dir:-1|1)=>void; onSelect?:(id:string)=>void; activeId?:string; grabbedId?:string }
export declare function Repeater(props:RepeaterProps):JSX.Element;
