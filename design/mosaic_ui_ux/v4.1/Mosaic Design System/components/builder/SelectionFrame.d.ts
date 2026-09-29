/**
 * Signature drafting-mark selection: hairline outline + four corner ticks + index tab.
 * @startingPoint section="Builder" subtitle="Selected component with drafting marks + toolbar" viewport="700x240"
 */
export interface SelectionFrameProps{ label?:string; index?:string; mode?:'selected'|'keyboard'|'lifted'; toolbar?:React.ReactNode|boolean; children?:React.ReactNode; style?:React.CSSProperties; /** "auto" (default) flips the toolbar below when there is <46px above inside the nearest [data-mos-canvas], or when it would overlap another index tab. Flipped: toolbar 8px under bottom-right, index tab hangs above top-left. */ placement?:'auto'|'above'|'below' }
export declare function SelectionFrame(props:SelectionFrameProps):JSX.Element;
