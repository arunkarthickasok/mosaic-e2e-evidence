/** Palette card: thumbnail, real name, one-line blurb, DATA / Attention (with reason) / Admin badges, "needs {Container}". */
export interface PaletteItemProps{ name:string; blurb?:string; icon?:string; thumb?:React.ReactNode; data?:boolean; /** Attention reason text */ attention?:string; restricted?:boolean; needs?:string; pattern?:boolean; /** Patterns: how many components one click inserts */ inserts?:number; disabled?:boolean; onClick?:()=>void }
export declare function PaletteItem(props:PaletteItemProps):JSX.Element;
