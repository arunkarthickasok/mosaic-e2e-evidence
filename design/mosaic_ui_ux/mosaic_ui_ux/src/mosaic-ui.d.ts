/**
 * Mosaic UI — the prop contracts.
 *
 * These types document the React layer that the Drupal module renders. They are
 * documentation, not a compiled API: the shipped bundle is framework-neutral,
 * and every component below maps one-to-one onto the class names in
 * `components/bundle.css`. A consumer that renders the same markup gets the same
 * design system.
 */

export type Theme = 'light' | 'dark';

/* --------------------------------------------------------------- controls */

export interface ButtonProps {
  /** One `primary` per rail section and per dialog footer. Never two side by side. */
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  /** `sm` in the rail and tables, `md` in the builder, `lg` in dialogs and on the front end. */
  size?: 'sm' | 'md' | 'lg';
  /** Leading 16px glyph. An icon-only button MUST also set `ariaLabel`. */
  icon?: JSX.Element;
  ariaLabel?: string;
  disabled?: boolean;
  block?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export interface FieldProps {
  /** The schema's own human title. Never a machine name. */
  label: string;
  required?: boolean;
  /** One short sentence. Rendered under the control, above the error. */
  help?: React.ReactNode;
  /** Author-language sentence. Sets `aria-invalid` and `aria-describedby`. */
  error?: React.ReactNode;
  /** Badges rendered beside the label, e.g. the DATA marker. */
  badges?: React.ReactNode;
  children: React.ReactNode;
}

export interface InputProps {
  value: string;
  placeholder?: string;
  /** A legacy binding renders read-only with "Legacy binding — remove to edit". */
  readOnly?: boolean;
  invalid?: boolean;
  onChange?: (value: string) => void;
}

export interface RichTextProps {
  /** Clamped to three lines in the rail. */
  value: string;
  /** Drupal text format, e.g. "Basic HTML". */
  format: string;
  /** Opens CKEditor 5 in a modal. The rail never hosts an inline editor. */
  onEdit: () => void;
}

export interface SelectProps<T extends string = string> {
  value: T;
  options: Array<{ value: T; label: string }>;
  disabled?: boolean;
  onChange?: (value: T) => void;
}

export interface ToggleProps {
  /** Always visible beside the switch. A bare switch is never shipped. */
  label: React.ReactNode;
  /** `switch` for state that applies at once, `checkbox` for state saved with a form. */
  as?: 'switch' | 'checkbox';
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface SegmentedProps<T extends string = string> {
  /** Two to four items. Above four, use a Select. */
  items: Array<{ value: T; label: React.ReactNode }>;
  value: T;
  ariaLabel: string;
  onChange?: (value: T) => void;
}

/* ---------------------------------------------------------------- signals */

export type Readiness = 'ready' | 'attention' | 'blocked';

export interface BadgeProps {
  kind?: Readiness | 'data' | 'restricted' | 'success' | 'neutral';
  /** Rendered before the word. Colour is never the only cue. */
  glyph?: string;
  children: React.ReactNode;
}

export interface BannerProps {
  kind?: 'info' | 'attention' | 'danger' | 'success';
  title: string;
  /** One sentence. A failure sentence must say what was kept. */
  text?: React.ReactNode;
  /** A danger banner never ships without at least one action. */
  actions?: React.ReactNode;
  small?: boolean;
}

export interface OwnershipLineProps {
  library: string;
  component: string;
}

/* ---------------------------------------------------------------- builder */

export type RailSectionId = 'content' | 'data' | 'style' | 'responsive' | 'accessibility';

export interface RailSectionProps {
  id: RailSectionId;
  /** Omit the section entirely when the component cannot use it. Never render it disabled. */
  open?: boolean;
  /** Badge in the header: "5 fields", "1 bound", "1 to fix". */
  meta?: React.ReactNode;
  children: React.ReactNode;
}

export interface SelectionToolbarProps {
  componentName: string;
  /** The front-end dialog omits the toolbar: it cannot move or remove. */
  onMove: () => void;
  onWrap: () => void;
  onDuplicate: () => void;
  onSelectParent: () => void;
  onRemove: () => void;
}

export interface SlotRule {
  /** Human names of the component types this slot accepts. */
  allowed: string[];
  min: number;
  max: number | null;
  /** Offered as the one-click fill on the empty state. */
  defaultChild?: string;
}

export interface SlotZoneProps {
  label: string;
  rule: SlotRule;
  /** `plain` lets an author type content directly instead of placing components. */
  mode?: 'components' | 'plain';
  /** A violation is SHOWN. Mosaic never silently refuses a drop. */
  violation?: 'below-min' | 'above-max' | 'not-allowed';
  emptyMessage?: string;
  children?: React.ReactNode;
}

/* ------------------------------------------------------------------- data */

export type BindingSource = 'page-field' | 'view' | 'entity-reference' | 'context';

export type ArgumentSource =
  | 'page-field' | 'url' | 'reference' | 'taxonomy' | 'current-user' | 'fixed';

export interface ViewBinding {
  kind: 'view';
  viewId: string;
  displayId: string;
  argument?: { name: string; from: ArgumentSource; value?: string };
  exposedFilters: boolean;
  pager: boolean;
  /** Slots only: one child of this type per row. */
  rowComponent?: string;
  /** View field id -> the child's field path, e.g. "content.heading". */
  fieldMap?: Record<string, string>;
}

export interface FieldBinding {
  kind: Exclude<BindingSource, 'view'>;
  path: string;
}

export type Binding = ViewBinding | FieldBinding;

export interface ResultLineProps {
  state: 'populated' | 'empty' | 'failing';
  showing: number;
  total: number;
  /** "Recent notices (Block: latest)". */
  sourceLabel: string;
  /** Mono trailing slot: the argument, or the error code. */
  detail?: string;
}

/* ---------------------------------------------------------------- surface */

export interface StatusBarProps {
  components: number;
  bound: number;
  slotsBelowMinimum: number;
  wcag: { level: 'AA' | 'AAA'; toFix: number };
  /** The layout field's machine name, shown in mono. */
  fieldName: string;
}

export interface SyncState {
  /** Reflects the server's copy, never the last click. */
  inSync: boolean;
  onRevert: () => void;
}

export interface EmptyStateProps {
  kind: 'canvas' | 'slot' | 'palette' | 'data' | 'library-missing';
  title: string;
  text: React.ReactNode;
  actions?: React.ReactNode;
  /** `library-missing` prints the stored props and children in full. */
  storedValues?: Record<string, unknown>;
}

export interface KeyboardMoveState {
  componentName: string;
  /** Announced through a live region on every step. */
  position: { index: number; of: number; parentPath: string[] };
}

/* ------------------------------------------------------------------- root */

export declare const Mosaic: {
  version: string;
  setTheme(id: Theme): Theme;
  theme(): Theme;
  token(name: string): string;
  READINESS: Record<Readiness, { label: string; glyph: string; modifier: string }>;
  DATA_STATES: Array<'populated' | 'one' | 'empty' | 'failing'>;
  KEYBOARD_MOVE: Array<{ keys: string[]; does: string }>;
};
