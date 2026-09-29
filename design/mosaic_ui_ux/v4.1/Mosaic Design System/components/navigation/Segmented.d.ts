/** Radio-group segmented control: viewport switch, Data-state switcher. */
export interface SegmentedOption{ id:string; label?:string; icon?:string; title?:string }
export interface SegmentedProps{ options:SegmentedOption[]; value:string; onChange?:(id:string)=>void; label:string; size?:'sm'|'md' }
export declare function Segmented(props:SegmentedProps):JSX.Element;
