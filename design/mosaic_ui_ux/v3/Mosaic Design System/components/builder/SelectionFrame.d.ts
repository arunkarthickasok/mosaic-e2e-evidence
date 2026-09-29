/**
 * Signature drafting-mark selection: hairline outline + four corner ticks + index tab.
 * @startingPoint section="Builder" subtitle="Selected component with drafting marks + toolbar" viewport="700x240"
 */
export interface SelectionFrameProps{ label?:string; index?:string; mode?:'selected'|'keyboard'|'lifted'; toolbar?:React.ReactNode|boolean; children?:React.ReactNode; style?:React.CSSProperties }
export declare function SelectionFrame(props:SelectionFrameProps):JSX.Element;
