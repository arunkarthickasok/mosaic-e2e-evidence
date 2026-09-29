/** On/off switch for library + component enablement and capability flags. */
export interface ToggleProps{ checked?:boolean; defaultChecked?:boolean; onChange?:(e:any)=>void; label?:string; description?:string; disabled?:boolean; /** Show "On"/"Off" text so state is never colour-only */ showState?:boolean; id?:string }
export declare function Toggle(props:ToggleProps):JSX.Element;
