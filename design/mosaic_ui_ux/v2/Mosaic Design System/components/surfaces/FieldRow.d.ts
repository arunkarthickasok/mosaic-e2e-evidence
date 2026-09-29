/** Label + any control + help/error/example line + machine-name disclosure. Wraps rich-text, image-fill and custom widgets. */
export interface FieldRowProps{ label:string; help?:string; required?:boolean; badge?:React.ReactNode; machineName?:string; error?:string; example?:boolean; htmlFor?:string; children?:React.ReactNode }
export declare function FieldRow(props:FieldRowProps):JSX.Element;
