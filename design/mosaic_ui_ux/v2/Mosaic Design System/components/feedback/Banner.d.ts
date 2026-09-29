/** Inline notice with full border + glyph. Tones: info, attention (min/max, required), error (save), success, data, owned (style ownership). */
export interface BannerProps{ tone?:'info'|'attention'|'error'|'success'|'data'|'owned'; title?:React.ReactNode; children?:React.ReactNode; actions?:React.ReactNode; compact?:boolean; icon?:string; role?:string }
export declare function Banner(props:BannerProps):JSX.Element;
