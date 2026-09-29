/**
 * Anchored "+ Add" picker: Plain content first, then components grouped by library; fully keyboard.
 * @startingPoint section="Builder" subtitle="Anchored add picker" viewport="700x460"
 */
export interface PickerItem{ id:string; name:string; icon?:string; blurb?:string; reason?:string; disabled?:boolean; preferred?:boolean }
export interface PickerGroup{ label:string; items:PickerItem[] }
export interface PickerProps{ groups:PickerGroup[]; title?:string; activeId?:string; query?:string; onQuery?:(q:string)=>void; onSelect?:(id:string)=>void; onClose?:()=>void }
export declare function Picker(props:PickerProps):JSX.Element;
