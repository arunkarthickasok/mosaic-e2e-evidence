/** "Library missing" builder card: keeps values + binding, read-only, never a blank page. */
export interface MissingValue{ label:string; value:string }
export interface MissingCardProps{ library:string; component:string; values?:MissingValue[]; binding?:string; actions?:React.ReactNode }
export declare function MissingCard(props:MissingCardProps):JSX.Element;
