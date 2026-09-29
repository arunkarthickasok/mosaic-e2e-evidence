/** Hairline-bordered surface for admin lists, library cards and docs. */
export interface CardProps{ title?:React.ReactNode; meta?:React.ReactNode; aside?:React.ReactNode; children?:React.ReactNode; footer?:React.ReactNode; selected?:boolean; interactive?:boolean; onClick?:()=>void; style?:React.CSSProperties }
export declare function Card(props:CardProps):JSX.Element;
