/** Stacked rail section with mono index (01 Content, 02 Data…). Render only sections the selection can use; never disabled. */
export interface RailSectionProps{ index:string; title:string; aside?:React.ReactNode; note?:React.ReactNode; children?:React.ReactNode; collapsed?:boolean; defaultCollapsed?:boolean; onToggle?:()=>void }
export declare function RailSection(props:RailSectionProps):JSX.Element;
