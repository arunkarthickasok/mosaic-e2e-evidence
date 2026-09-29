/** Result line under every bound component/zone: "3 of 128 · View · display". */
export interface ResultLineProps{ state?:'populated'|'empty'|'failing'; shown?:number; total?:number; view:string; display?:string; error?:string }
export declare function ResultLine(props:ResultLineProps):JSX.Element;
