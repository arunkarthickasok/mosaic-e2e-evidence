/** Status/label chip. Every semantic tone carries a glyph so colour is never the only cue. */
export interface BadgeProps{ tone?:'ready'|'attention'|'blocked'|'data'|'restricted'|'example'|'neutral'|'accent'; /** Override glyph, or false to hide */ icon?:string|false; size?:'sm'|'md'; title?:string; children?:React.ReactNode }
export declare function Badge(props:BadgeProps):JSX.Element;
