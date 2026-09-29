/** Line tabs with teal underline; for admin pages and dialog sub-views. */
export interface TabItem{ id:string; label:string; count?:number }
export interface TabsProps{ tabs:TabItem[]; value:string; onChange?:(id:string)=>void }
export declare function Tabs(props:TabsProps):JSX.Element;
