/** Repeater list for single-child slots: summary rows, drag grip + keyboard up/down, remove (disabled at the floor), "+ Add item" (disabled at max), rule banners. No row numbers (index rule). */
export interface RepeaterItem{ id:string; summary:string; meta?:string }
export interface RepeaterProps{ items:RepeaterItem[]; min?:number; max?:number; addLabel?:string; onAdd?:()=>void; onRemove?:(id:string)=>void; onMove?:(id:string,dir:-1|1)=>void; onSelect?:(id:string)=>void; activeId?:string; grabbedId?:string; /** Render min/max banners below the list (default true) */ showRules?:boolean }
export declare function Repeater(props:RepeaterProps):JSX.Element;
