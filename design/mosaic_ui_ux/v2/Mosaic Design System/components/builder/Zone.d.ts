/** Slot/zone chrome: dashed indigo hairline, mono label, "+ Add" inside when empty, small "+" in header when filled. */
export interface ZoneProps{ label:string; index?:string; children?:React.ReactNode; empty?:boolean; emptyText?:string; addLabel?:string; onAdd?:()=>void; required?:boolean; state?:'highlight'|'refused'|'bound'|'failing'; count?:React.ReactNode; /** e.g. "1–4" */ rule?:string; footer?:React.ReactNode; style?:React.CSSProperties }
export declare function Zone(props:ZoneProps):JSX.Element;
