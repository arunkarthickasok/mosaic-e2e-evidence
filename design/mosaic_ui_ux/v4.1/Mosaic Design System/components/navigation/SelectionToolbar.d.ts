/** The canvas control surface: parent, move, keyboard move, wrap, duplicate, remove. */
export interface SelectionToolbarProps{ label?:string; index?:string; onParent?:()=>void; onMoveUp?:()=>void; onMoveDown?:()=>void; onKeyboardMove?:()=>void; onWrap?:()=>void; onDuplicate?:()=>void; onRemove?:()=>void; compact?:boolean }
export declare function SelectionToolbar(props:SelectionToolbarProps):JSX.Element;
