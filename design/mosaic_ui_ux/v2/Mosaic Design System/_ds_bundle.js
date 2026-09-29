/* @ds-bundle: {"format":4,"namespace":"MosaicDesignSystem_9c1bff","components":[{"name":"MissingCard","sourcePath":"components/builder/MissingCard.jsx"},{"name":"PaletteItem","sourcePath":"components/builder/PaletteItem.jsx"},{"name":"Picker","sourcePath":"components/builder/Picker.jsx"},{"name":"Repeater","sourcePath":"components/builder/Repeater.jsx"},{"name":"SelectionFrame","sourcePath":"components/builder/SelectionFrame.jsx"},{"name":"Zone","sourcePath":"components/builder/Zone.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"Toggle","sourcePath":"components/core/Toggle.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"ResultLine","sourcePath":"components/feedback/ResultLine.jsx"},{"name":"SyncStatus","sourcePath":"components/feedback/SyncStatus.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Segmented","sourcePath":"components/navigation/Segmented.jsx"},{"name":"SelectionToolbar","sourcePath":"components/navigation/SelectionToolbar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Dialog","sourcePath":"components/surfaces/Dialog.jsx"},{"name":"FieldRow","sourcePath":"components/surfaces/FieldRow.jsx"},{"name":"RailSection","sourcePath":"components/surfaces/RailSection.jsx"}],"sourceHashes":{"components/builder/MissingCard.jsx":"063a7958d4b7","components/builder/PaletteItem.jsx":"44b6dd2a21dd","components/builder/Picker.jsx":"85e7aa0ca9c1","components/builder/Repeater.jsx":"f52e7d4daf2d","components/builder/SelectionFrame.jsx":"3c30067396bd","components/builder/Zone.jsx":"6ec755630a3f","components/core/Badge.jsx":"bced415f5bb5","components/core/Button.jsx":"42680e4f29c1","components/core/Checkbox.jsx":"d231705fa61e","components/core/Icon.jsx":"b71d46ba6a0e","components/core/IconButton.jsx":"90a15f10b2ab","components/core/Input.jsx":"6efbcf4da8d3","components/core/Select.jsx":"2cfc0eae98d7","components/core/Toggle.jsx":"b5ecfdc92255","components/feedback/Banner.jsx":"2ba34de65932","components/feedback/ResultLine.jsx":"9353a10ea009","components/feedback/SyncStatus.jsx":"2463852edcc7","components/feedback/Toast.jsx":"2ab52707fae2","components/navigation/Segmented.jsx":"e7e992402fa1","components/navigation/SelectionToolbar.jsx":"8cecd0984b46","components/navigation/Tabs.jsx":"0ae40e5fd98f","components/surfaces/Card.jsx":"b00bbbf0146d","components/surfaces/Dialog.jsx":"2ddd73d5450d","components/surfaces/FieldRow.jsx":"5e9ad5924486","components/surfaces/RailSection.jsx":"6e1ba376f70b","ui_kits/builder/Admin.jsx":"930769350d5e","ui_kits/builder/App.jsx":"5c3ee0bf8857","ui_kits/builder/Builder.jsx":"134598be1fc7","ui_kits/builder/Canvas.jsx":"df1ecb85b25c","ui_kits/builder/Chrome.jsx":"dae68cb16317","ui_kits/builder/Pages.jsx":"f37a4c950594","ui_kits/builder/Palette.jsx":"27c09fb4f741","ui_kits/builder/Rail.jsx":"74563edf2abf","ui_kits/builder/data.js":"50f25fcae21b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MosaicDesignSystem_9c1bff = window.MosaicDesignSystem_9c1bff || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
const BASE = 'https://unpkg.com/lucide-static@0.460.0/icons/';
function Icon({
  name,
  size = 16,
  label,
  className,
  style
}) {
  const url = 'url(' + BASE + name + '.svg)';
  return /*#__PURE__*/React.createElement("span", {
    className: 'mos-icon' + (className ? ' ' + className : ''),
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: {
      width: size,
      height: size,
      WebkitMaskImage: url,
      maskImage: url,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/builder/Picker.jsx
try { (() => {
function Picker({
  groups = [],
  title,
  activeId,
  onSelect,
  onClose,
  query = '',
  onQuery
}) {
  const flat = groups.flatMap(g => g.items.filter(i => !i.disabled));
  const [act, setAct] = React.useState(activeId || flat[0] && flat[0].id);
  const key = e => {
    const i = flat.findIndex(x => x.id === act);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAct(flat[Math.min(flat.length - 1, i + 1)].id);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAct(flat[Math.max(0, i - 1)].id);
    }
    if (e.key === 'Enter') {
      onSelect && onSelect(act);
    }
    if (e.key === 'Escape') {
      onClose && onClose();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mos-picker",
    onKeyDown: key,
    role: "dialog",
    "aria-label": title || 'Add to area'
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-picker__search"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-control mos-control--sm"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 14,
    style: {
      color: 'var(--mos-text-faint)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    placeholder: title || 'Search components',
    value: query,
    onChange: e => onQuery && onQuery(e.target.value),
    role: "combobox",
    "aria-expanded": "true",
    "aria-activedescendant": 'pk-' + act
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mos-picker__list",
    role: "listbox"
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label,
    role: "group",
    "aria-label": g.label
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-picker__group"
  }, g.label), g.items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    id: 'pk-' + it.id,
    role: "option",
    className: "mos-picker__opt",
    "aria-selected": act === it.id,
    "aria-disabled": it.disabled || undefined,
    onMouseEnter: () => !it.disabled && setAct(it.id),
    onClick: () => !it.disabled && onSelect && onSelect(it.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-picker__ico"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon || 'square',
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--mos-type-ui-strong)',
      color: 'var(--mos-text-strong)'
    }
  }, it.name), (it.reason || it.blurb) && /*#__PURE__*/React.createElement("span", {
    className: "mos-help",
    style: {
      display: 'block',
      color: it.reason ? 'var(--mos-state-attention-fg)' : undefined
    }
  }, it.reason || it.blurb)), it.preferred && /*#__PURE__*/React.createElement("span", {
    className: "mos-badge mos-badge--accent mos-badge--sm"
  }, "Preferred")))))), /*#__PURE__*/React.createElement("div", {
    className: "mos-picker__foot"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "mos-kbd"
  }, "\u2191"), " ", /*#__PURE__*/React.createElement("span", {
    className: "mos-kbd"
  }, "\u2193"), " choose"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "mos-kbd"
  }, "\u21B5"), " insert"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "mos-kbd"
  }, "Esc"), " close")));
}
Object.assign(__ds_scope, { Picker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/builder/Picker.jsx", error: String((e && e.message) || e) }); }

// components/builder/Zone.jsx
try { (() => {
const cx = (...a) => a.filter(Boolean).join(' ');
function Zone({
  label,
  index,
  children,
  empty,
  emptyText,
  addLabel = 'Add',
  onAdd,
  required,
  state,
  count,
  rule,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: cx('mos-zone', required && empty && 'mos-zone--required', state && 'mos-zone--' + state),
    style: style,
    role: "group",
    "aria-label": label + ' area'
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-zone__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-zone__label"
  }, index && /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, index), label, required && /*#__PURE__*/React.createElement("span", {
    "aria-label": "required"
  }, "*")), /*#__PURE__*/React.createElement("span", {
    className: "mos-zone__meta"
  }, rule && /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, rule), count, !empty && onAdd && /*#__PURE__*/React.createElement("button", {
    className: "mos-zone__add",
    "aria-label": 'Add to ' + label,
    onClick: onAdd
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 14
  })))), empty ? /*#__PURE__*/React.createElement("div", {
    className: "mos-zone__empty"
  }, emptyText && /*#__PURE__*/React.createElement("span", null, emptyText), onAdd && /*#__PURE__*/React.createElement("button", {
    className: "mos-zone__cta",
    onClick: onAdd
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 14
  }), addLabel)) : children, footer && /*#__PURE__*/React.createElement("div", {
    className: "mos-zone__foot"
  }, footer));
}
Object.assign(__ds_scope, { Zone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/builder/Zone.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const ICONS = {
  ready: 'check',
  attention: 'triangle-alert',
  blocked: 'ban',
  data: 'database',
  restricted: 'lock',
  example: null,
  neutral: null,
  accent: null
};
function Badge({
  tone = 'neutral',
  icon,
  size = 'md',
  children,
  title
}) {
  const ic = icon === false ? null : icon || ICONS[tone];
  return /*#__PURE__*/React.createElement("span", {
    className: 'mos-badge mos-badge--' + tone + (size === 'sm' ? ' mos-badge--sm' : ''),
    title: title
  }, ic && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: size === 'sm' ? 10 : 12
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/builder/MissingCard.jsx
try { (() => {
function MissingCard({
  library,
  component,
  values = [],
  binding,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mos-missing",
    role: "group",
    "aria-label": component + ' — library missing'
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-missing__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "unplug",
    size: 18,
    style: {
      color: 'var(--mos-text-muted)',
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mos-type-ui-strong)',
      color: 'var(--mos-text-strong)'
    }
  }, component, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--mos-text-muted)',
      fontWeight: 400
    }
  }, "\xB7 ", library)), /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "The ", library, " library isn't installed. Values are kept and will render again when it returns.")), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral",
    icon: "eye"
  }, "Read-only")), (values.length > 0 || binding) && /*#__PURE__*/React.createElement("dl", {
    className: "mos-missing__vals"
  }, values.map(v => /*#__PURE__*/React.createElement(React.Fragment, {
    key: v.label
  }, /*#__PURE__*/React.createElement("dt", null, v.label), /*#__PURE__*/React.createElement("dd", null, v.value))), binding && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "Content"), /*#__PURE__*/React.createElement("dd", {
    style: {
      color: 'var(--mos-state-data-fg)'
    }
  }, "bound to ", binding))), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 10
    }
  }, actions));
}
Object.assign(__ds_scope, { MissingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/builder/MissingCard.jsx", error: String((e && e.message) || e) }); }

// components/builder/PaletteItem.jsx
try { (() => {
const cx = (...a) => a.filter(Boolean).join(' ');
function PaletteItem({
  name,
  blurb,
  icon = 'square',
  thumb,
  data,
  attention,
  restricted,
  needs,
  pattern,
  disabled,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: cx('mos-pal', pattern && 'mos-pal--pattern', disabled && 'mos-pal--disabled'),
    onClick: onClick,
    "aria-disabled": disabled || undefined,
    draggable: !disabled
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-pal__thumb"
  }, thumb || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-pal__name"
  }, name, data && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "data",
    size: "sm"
  }, "DATA"), attention && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "attention",
    size: "sm"
  }, "Attention"), restricted && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "restricted",
    size: "sm"
  }, "Admin")), blurb && /*#__PURE__*/React.createElement("span", {
    className: "mos-pal__blurb",
    style: {
      display: 'block'
    }
  }, blurb), attention && /*#__PURE__*/React.createElement("span", {
    className: "mos-pal__reason"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "corner-down-right",
    size: 12
  }), attention), needs && /*#__PURE__*/React.createElement("span", {
    className: "mos-pal__needs"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "square-dashed",
    size: 12
  }), "needs ", needs)));
}
Object.assign(__ds_scope, { PaletteItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/builder/PaletteItem.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  children,
  className,
  type = 'button',
  ...rest
}) {
  const is = size === 'sm' ? 14 : 16;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cx('mos-btn', 'mos-btn--' + variant, size !== 'md' && 'mos-btn--' + size, fullWidth && 'mos-btn--full', className)
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: is
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: is
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  defaultChecked,
  onChange,
  label,
  description,
  disabled,
  indeterminate,
  id
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    className: "mos-check"
  }, /*#__PURE__*/React.createElement("input", {
    ref: ref,
    type: "checkbox",
    id: id,
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled
  }), /*#__PURE__*/React.createElement("span", {
    className: "mos-check__box"
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: indeterminate ? 'minus' : 'check',
    size: 12
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "mos-choice__text"
  }, label && /*#__PURE__*/React.createElement("span", null, label), description && /*#__PURE__*/React.createElement("span", {
    className: "mos-help"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  pressed,
  className,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    "aria-pressed": pressed === undefined ? undefined : pressed,
    className: cx('mos-btn', 'mos-iconbtn', 'mos-btn--' + variant, size !== 'md' && 'mos-btn--' + size, className)
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 14 : 16
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/builder/Repeater.jsx
try { (() => {
function Repeater({
  items = [],
  min,
  max,
  addLabel = 'Add item',
  onAdd,
  onRemove,
  onMove,
  onSelect,
  activeId,
  grabbedId
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mos-rep",
    role: "list"
  }, items.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mos-rep__empty"
  }, "No items yet."), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "mos-rep__row",
    role: "listitem",
    "data-active": activeId === it.id,
    "data-grabbed": grabbedId === it.id,
    onClick: () => onSelect && onSelect(it.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-rep__grip",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "grip-vertical",
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    className: "mos-rep__n"
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    className: "mos-rep__sum"
  }, /*#__PURE__*/React.createElement("b", null, it.summary), it.meta && /*#__PURE__*/React.createElement("span", null, it.meta)), /*#__PURE__*/React.createElement("span", {
    className: "mos-rep__acts"
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    size: "sm",
    icon: "arrow-up",
    label: 'Move ' + it.summary + ' up',
    disabled: i === 0,
    onClick: e => {
      e.stopPropagation();
      onMove && onMove(it.id, -1);
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    size: "sm",
    icon: "arrow-down",
    label: 'Move ' + it.summary + ' down',
    disabled: i === items.length - 1,
    onClick: e => {
      e.stopPropagation();
      onMove && onMove(it.id, 1);
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    size: "sm",
    icon: "x",
    label: 'Remove ' + it.summary,
    disabled: min != null && items.length <= min && false,
    onClick: e => {
      e.stopPropagation();
      onRemove && onRemove(it.id);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mos-rep__foot"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "add",
    size: "sm",
    icon: "plus",
    onClick: onAdd,
    disabled: max != null && items.length >= max
  }, addLabel), (min != null || max != null) && /*#__PURE__*/React.createElement("span", {
    className: "mos-rep__count"
  }, items.length, max != null ? '/' + max : '', min != null && max == null ? ' · min ' + min : '')));
}
Object.assign(__ds_scope, { Repeater });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/builder/Repeater.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Input({
  label,
  help,
  error,
  required,
  id,
  prefix,
  suffix,
  mono,
  readOnly,
  size = 'md',
  badge,
  inputRef,
  ...rest
}) {
  const iid = id || 'mos-in-' + Math.random().toString(36).slice(2, 8);
  return /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, label && /*#__PURE__*/React.createElement("div", {
    className: "mos-field__head"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mos-label",
    htmlFor: iid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "mos-req",
    "aria-hidden": "true"
  }, " *")), badge), /*#__PURE__*/React.createElement("div", {
    className: cx('mos-control', error && 'mos-control--error', readOnly && 'mos-control--readonly', mono && 'mos-control--mono', size === 'sm' && 'mos-control--sm')
  }, prefix && /*#__PURE__*/React.createElement("span", {
    className: "mos-affix"
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: iid,
    ref: inputRef,
    readOnly: readOnly,
    required: required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error || help ? iid + '-d' : undefined
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    className: "mos-affix"
  }, suffix)), error ? /*#__PURE__*/React.createElement("div", {
    className: "mos-err",
    id: iid + '-d'
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-alert",
    size: 14
  }), error) : help ? /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    id: iid + '-d'
  }, help) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Select({
  label,
  help,
  options = [],
  id,
  size = 'md',
  badge,
  required,
  error,
  ...rest
}) {
  const iid = id || 'mos-sel-' + Math.random().toString(36).slice(2, 8);
  return /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, label && /*#__PURE__*/React.createElement("div", {
    className: "mos-field__head"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mos-label",
    htmlFor: iid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "mos-req",
    "aria-hidden": "true"
  }, " *")), badge), /*#__PURE__*/React.createElement("div", {
    className: cx('mos-control', 'mos-control--select', size === 'sm' && 'mos-control--sm', error && 'mos-control--error')
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: iid
  }, rest), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value,
    disabled: o.disabled
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevrons-up-down",
    size: 14
  })), error ? /*#__PURE__*/React.createElement("div", {
    className: "mos-err"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-alert",
    size: 14
  }), error) : help && /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, help));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/Toggle.jsx
try { (() => {
function Toggle({
  checked,
  defaultChecked,
  onChange,
  label,
  description,
  disabled,
  showState,
  id
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "mos-toggle"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    id: id,
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled
  }), /*#__PURE__*/React.createElement("span", {
    className: "mos-toggle__track"
  }), showState && /*#__PURE__*/React.createElement("span", {
    className: "mos-toggle__state"
  }, checked ? 'On' : 'Off'), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "mos-choice__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "mos-label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "mos-help"
  }, description)));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Banner.jsx
try { (() => {
const ICONS = {
  info: 'info',
  attention: 'triangle-alert',
  error: 'circle-alert',
  success: 'circle-check',
  data: 'database',
  owned: 'lock'
};
function Banner({
  tone = 'info',
  title,
  children,
  actions,
  compact,
  icon,
  role
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: 'mos-banner mos-banner--' + tone + (compact ? ' mos-banner--compact' : ''),
    role: role || (tone === 'error' ? 'alert' : undefined)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || ICONS[tone],
    size: 16
  }), title && /*#__PURE__*/React.createElement("div", {
    className: "mos-banner__title"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "mos-banner__body",
    style: title ? null : {
      gridRow: 1
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    className: "mos-banner__actions"
  }, actions));
}
Object.assign(__ds_scope, { Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Banner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ResultLine.jsx
try { (() => {
function ResultLine({
  state = 'populated',
  shown,
  total,
  view,
  display,
  error
}) {
  if (state === 'failing') return /*#__PURE__*/React.createElement("span", {
    className: "mos-result mos-result--failing"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-alert",
    size: 12
  }), error || 'View failed to load', " \xB7 ", view);
  if (state === 'empty') return /*#__PURE__*/React.createElement("span", {
    className: "mos-result mos-result--empty"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-dashed",
    size: 12
  }), /*#__PURE__*/React.createElement("b", null, "0"), " of 0 \xB7 ", view, display ? ' · ' + display : '');
  return /*#__PURE__*/React.createElement("span", {
    className: "mos-result"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "database",
    size: 12
  }), /*#__PURE__*/React.createElement("b", null, shown), " of ", total, " \xB7 ", view, display ? ' · ' + display : '');
}
Object.assign(__ds_scope, { ResultLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ResultLine.jsx", error: String((e && e.message) || e) }); }

// components/feedback/SyncStatus.jsx
try { (() => {
const LABEL = {
  synced: 'In sync with the saved layout',
  unsaved: 'Unsaved changes',
  stale: 'Refreshing preview…'
};
function SyncStatus({
  state = 'synced',
  components,
  bound,
  onRevert,
  wcag
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: 'mos-sync mos-sync--' + state,
    role: "status",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-sync__dot",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mos-sync__label"
  }, LABEL[state]), state === 'unsaved' && onRevert && /*#__PURE__*/React.createElement("button", {
    className: "mos-btn mos-btn--link",
    style: {
      fontSize: 12
    },
    onClick: onRevert
  }, "Revert to saved"), components != null && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mos-sync__sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, components, " components")), bound != null && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mos-sync__sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, bound, " bound")), wcag && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mos-sync__sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, wcag)));
}
Object.assign(__ds_scope, { SyncStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/SyncStatus.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  icon = 'info',
  children,
  action,
  onAction,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mos-toast",
    role: "status",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, children), action && /*#__PURE__*/React.createElement("button", {
    className: "mos-toast__action",
    onClick: onAction
  }, action), onClose && /*#__PURE__*/React.createElement("button", {
    className: "mos-toast__close",
    "aria-label": "Dismiss",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Segmented.jsx
try { (() => {
function Segmented({
  options = [],
  value,
  onChange,
  label,
  size = 'md'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: 'mos-seg' + (size === 'sm' ? ' mos-seg--sm' : ''),
    role: "radiogroup",
    "aria-label": label
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.id,
    role: "radio",
    "aria-checked": value === o.id,
    className: "mos-seg__opt",
    onClick: () => onChange && onChange(o.id),
    title: o.title
  }, o.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: o.icon,
    size: size === 'sm' ? 12 : 14
  }), o.label)));
}
Object.assign(__ds_scope, { Segmented });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Segmented.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SelectionToolbar.jsx
try { (() => {
const B = ({
  icon,
  label,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  className: "mos-seltool__btn",
  "aria-label": label,
  title: label,
  onClick: onClick
}, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
  name: icon,
  size: 14
}));
function SelectionToolbar({
  label,
  index,
  onParent,
  onMoveUp,
  onMoveDown,
  onKeyboardMove,
  onWrap,
  onDuplicate,
  onRemove,
  compact
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mos-seltool",
    role: "toolbar",
    "aria-label": (label || 'Component') + ' actions'
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "mos-seltool__label"
  }, index && /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, index), label), onParent && /*#__PURE__*/React.createElement(B, {
    icon: "arrow-up-left",
    label: "Select parent",
    onClick: onParent
  }), !compact && onMoveUp && /*#__PURE__*/React.createElement(B, {
    icon: "arrow-up",
    label: "Move up",
    onClick: onMoveUp
  }), !compact && onMoveDown && /*#__PURE__*/React.createElement(B, {
    icon: "arrow-down",
    label: "Move down",
    onClick: onMoveDown
  }), onKeyboardMove && /*#__PURE__*/React.createElement(B, {
    icon: "move",
    label: "Move with keyboard (M)",
    onClick: onKeyboardMove
  }), /*#__PURE__*/React.createElement("span", {
    className: "mos-seltool__sep"
  }), onWrap && /*#__PURE__*/React.createElement(B, {
    icon: "square-dashed-bottom",
    label: "Wrap in container",
    onClick: onWrap
  }), onDuplicate && /*#__PURE__*/React.createElement(B, {
    icon: "copy",
    label: "Duplicate",
    onClick: onDuplicate
  }), onRemove && /*#__PURE__*/React.createElement(B, {
    icon: "trash-2",
    label: "Remove",
    onClick: onRemove
  }));
}
Object.assign(__ds_scope, { SelectionToolbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SelectionToolbar.jsx", error: String((e && e.message) || e) }); }

// components/builder/SelectionFrame.jsx
try { (() => {
const cx = (...a) => a.filter(Boolean).join(' ');
function SelectionFrame({
  label,
  index,
  mode = 'selected',
  toolbar,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: cx('mos-marks', mode === 'keyboard' && 'mos-marks--keyboard', mode === 'lifted' && 'mos-marks--lifted'),
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-marks__b"
  }), label && /*#__PURE__*/React.createElement("span", {
    className: "mos-marks__tab"
  }, index && /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, index), label), toolbar && /*#__PURE__*/React.createElement("div", {
    className: "mos-marks__tool"
  }, toolbar === true ? /*#__PURE__*/React.createElement(__ds_scope.SelectionToolbar, {
    onParent: () => {},
    onMoveUp: () => {},
    onMoveDown: () => {},
    onKeyboardMove: () => {},
    onWrap: () => {},
    onDuplicate: () => {},
    onRemove: () => {}
  }) : toolbar), children);
}
Object.assign(__ds_scope, { SelectionFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/builder/SelectionFrame.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mos-tabs",
    role: "tablist"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    role: "tab",
    className: "mos-tab",
    "aria-selected": value === t.id,
    tabIndex: value === t.id ? 0 : -1,
    onClick: () => onChange && onChange(t.id)
  }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
    className: "mos-tab__count"
  }, t.count))));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
const cx = (...a) => a.filter(Boolean).join(' ');
function Card({
  title,
  meta,
  aside,
  children,
  footer,
  selected,
  interactive,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: cx('mos-card', interactive && 'mos-card--interactive', selected && 'mos-card--selected'),
    onClick: onClick,
    style: style
  }, (title || meta || aside) && /*#__PURE__*/React.createElement("div", {
    className: "mos-card__head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "mos-card__title"
  }, title), meta && /*#__PURE__*/React.createElement("div", {
    className: "mos-card__meta"
  }, meta)), aside), children && /*#__PURE__*/React.createElement("div", {
    className: "mos-card__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "mos-card__foot"
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Dialog.jsx
try { (() => {
function Dialog({
  title,
  subtitle,
  children,
  footer,
  onClose,
  width = 560,
  inline,
  headAside,
  bodyPadding = 16
}) {
  React.useEffect(() => {
    if (inline || !onClose) return;
    const k = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [inline, onClose]);
  const box = /*#__PURE__*/React.createElement("div", {
    className: "mos-dialog",
    role: "dialog",
    "aria-modal": inline ? undefined : true,
    "aria-label": typeof title === 'string' ? title : undefined,
    style: {
      width
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-dialog__head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-dialog__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    className: "mos-dialog__sub"
  }, subtitle)), headAside, onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    className: "mos-dialog__body",
    style: {
      padding: bodyPadding
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "mos-dialog__foot"
  }, footer));
  return inline ? box : /*#__PURE__*/React.createElement("div", {
    className: "mos-dialog-scrim"
  }, box);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/FieldRow.jsx
try { (() => {
function FieldRow({
  label,
  help,
  required,
  badge,
  machineName,
  error,
  children,
  htmlFor,
  example
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: 'mos-fieldrow' + (error ? ' mos-fieldrow--error' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-fieldrow__head"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mos-label",
    htmlFor: htmlFor
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "mos-req",
    "aria-hidden": "true"
  }, " *")), /*#__PURE__*/React.createElement("span", {
    className: "mos-fieldrow__aside"
  }, badge)), children, error ? /*#__PURE__*/React.createElement("div", {
    className: "mos-err"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-alert",
    size: 14
  }), error) : example ? /*#__PURE__*/React.createElement("div", {
    className: "mos-preview-only"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "eye",
    size: 12
  }), "Preview only \u2014 set a value to publish") : help && /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, help), machineName && /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", {
    className: "mos-help",
    style: {
      cursor: 'pointer'
    }
  }, "Details"), /*#__PURE__*/React.createElement("div", {
    className: "mos-fieldrow__machine"
  }, machineName)));
}
Object.assign(__ds_scope, { FieldRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/FieldRow.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/RailSection.jsx
try { (() => {
function RailSection({
  index,
  title,
  aside,
  note,
  children,
  collapsed: ctl,
  defaultCollapsed = false,
  onToggle
}) {
  const [open, setOpen] = React.useState(!defaultCollapsed);
  const collapsed = ctl !== undefined ? ctl : !open;
  return /*#__PURE__*/React.createElement("section", {
    className: "mos-rs",
    "data-collapsed": collapsed
  }, /*#__PURE__*/React.createElement("button", {
    className: "mos-rs__head",
    "aria-expanded": !collapsed,
    onClick: () => {
      setOpen(!open);
      onToggle && onToggle();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, index), /*#__PURE__*/React.createElement("span", {
    className: "mos-rs__title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "mos-rs__aside"
  }, aside, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 14,
    className: "mos-rs__chev"
  }))), !collapsed && /*#__PURE__*/React.createElement("div", {
    className: "mos-rs__body"
  }, note && /*#__PURE__*/React.createElement("div", {
    className: "mos-rs__note"
  }, note), children));
}
Object.assign(__ds_scope, { RailSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/RailSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/Admin.jsx
try { (() => {
const MA = window.MosaicDesignSystem_9c1bff;
const GRADE = {
  ready: 'Ready',
  attention: 'Attention',
  blocked: 'Blocked'
};
function MosRegion({
  theme,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    "data-mosaic-theme": theme,
    style: {
      background: 'var(--mos-surface-chrome)',
      border: '1px solid var(--mos-border-subtle)',
      borderRadius: 8,
      overflow: 'hidden',
      color: 'var(--mos-text-default)'
    }
  }, children);
}
function LibrariesPage({
  vp,
  theme
}) {
  const [sel, setSel] = React.useState('civic');
  const [open, setOpen] = React.useState('Card');
  const [libs, setLibs] = React.useState(MOS_DATA.libraries);
  const [comps, setComps] = React.useState(MOS_DATA.civicComponents);
  const mob = vp === 'mobile',
    stacked = vp !== 'desktop';
  const L = libs.find(l => l.id === sel);
  const list = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: stacked ? 'row' : 'column',
      gap: 8,
      overflow: stacked ? 'auto' : 'visible',
      padding: stacked ? '0 0 4px' : 0
    }
  }, libs.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.id,
    style: {
      minWidth: stacked ? 230 : 0
    }
  }, /*#__PURE__*/React.createElement(MA.Card, {
    interactive: true,
    selected: sel === l.id,
    onClick: () => setSel(l.id),
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center'
      }
    }, l.name, /*#__PURE__*/React.createElement("span", {
      className: "mos-index"
    }, l.version)),
    meta: l.note,
    aside: /*#__PURE__*/React.createElement("span", {
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement(MA.Toggle, {
      checked: l.on,
      showState: true,
      onChange: () => setLibs(libs.map(x => x.id === l.id ? {
        ...x,
        on: !x.on
      } : x))
    }))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(MA.Badge, {
    tone: "ready",
    size: "sm"
  }, l.ready), l.attention > 0 && /*#__PURE__*/React.createElement(MA.Badge, {
    tone: "attention",
    size: "sm"
  }, l.attention), l.blocked > 0 && /*#__PURE__*/React.createElement(MA.Badge, {
    tone: "blocked",
    size: "sm"
  }, l.blocked), l.own && /*#__PURE__*/React.createElement(MA.Badge, {
    tone: "accent",
    size: "sm",
    icon: false
  }, "Mosaic"))))));
  const row = c => /*#__PURE__*/React.createElement(React.Fragment, {
    key: c.name
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "mos-btn mos-btn--link",
    onClick: () => setOpen(open === c.name ? null : c.name),
    "aria-expanded": open === c.name,
    style: {
      color: 'var(--mos-text-strong)',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MA.Icon, {
    name: open === c.name ? 'chevron-down' : 'chevron-right',
    size: 14
  }), c.name), /*#__PURE__*/React.createElement("div", {
    className: "mos-fieldrow__machine",
    style: {
      paddingLeft: 20
    }
  }, "civic_ui:", c.name.toLowerCase().replace(' ', '_'))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(MA.Toggle, {
    checked: c.on,
    showState: true,
    onChange: () => setComps(comps.map(x => x.name === c.name ? {
      ...x,
      on: !x.on
    } : x)),
    disabled: c.grade === 'blocked'
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(MA.Checkbox, {
    checked: c.restricted,
    label: "Admin only",
    onChange: () => setComps(comps.map(x => x.name === c.name ? {
      ...x,
      restricted: !x.restricted
    } : x))
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(MA.Badge, {
    tone: c.grade
  }, GRADE[c.grade]), c.reason && /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      marginTop: 4,
      maxWidth: 260,
      color: c.grade === 'blocked' ? 'var(--mos-state-blocked-fg)' : 'var(--mos-state-attention-fg)'
    }
  }, c.reason)), /*#__PURE__*/React.createElement("td", {
    className: "mos-mono",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, c.fields, " fields \xB7 ", c.slots, " slots"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(MA.Button, {
    size: "sm",
    variant: "ghost",
    iconRight: "arrow-right"
  }, "Manage authoring"))), open === c.name && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6,
    style: {
      background: 'var(--mos-surface-sunken)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(Docs, null))));
  const cards = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, comps.map(c => /*#__PURE__*/React.createElement(MA.Card, {
    key: c.name,
    title: c.name,
    meta: c.fields + ' fields · ' + c.slots + ' slots',
    aside: /*#__PURE__*/React.createElement(MA.Badge, {
      tone: c.grade
    }, GRADE[c.grade])
  }, c.reason && /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      color: 'var(--mos-state-attention-fg)',
      marginBottom: 8
    }
  }, c.reason), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(MA.Toggle, {
    checked: c.on,
    showState: true,
    label: "Enabled"
  }), /*#__PURE__*/React.createElement(MA.Checkbox, {
    checked: c.restricted,
    label: "Admin only"
  })), open === c.name && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Docs, null)))));
  return /*#__PURE__*/React.createElement(MosRegion, {
    theme: theme
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: mob ? 14 : 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      fontSize: 13,
      maxWidth: 680
    }
  }, "Libraries supply components to Mosaic. Turning a library off hides its components from every palette; pages that already use them keep their values and show a \u201CLibrary missing\u201D card to editors."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: stacked ? 'column' : 'row',
      gap: 20,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: stacked ? '100%' : 280,
      flex: 'none'
    }
  }, list), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mos-type-title)',
      color: 'var(--mos-text-strong)'
    }
  }, L.name), /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, L.version), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(MA.Button, {
    size: "sm",
    icon: "book-open"
  }, "Living docs")), L.id === 'civic' && /*#__PURE__*/React.createElement(MA.Banner, {
    tone: "info",
    compact: true,
    icon: "box"
  }, "Styles in JavaScript (shadow DOM). Civic UI owns its look; content placed in its areas renders without Mosaic styling."), L.id === 'olivero' && /*#__PURE__*/React.createElement(MA.Banner, {
    tone: "attention",
    compact: true,
    title: "Theme-bound \xB7 ships global styles"
  }, "Only available while Olivero is the default front-end theme. Its CSS loads on every page that uses it."), L.id === 'ds' && /*#__PURE__*/React.createElement(MA.Banner, {
    tone: "attention",
    compact: true,
    title: "Ships global resets"
  }, "Enabling this library loads a CSS reset site-wide, which may change typography on existing pages."), L.id === 'starter' && /*#__PURE__*/React.createElement(MA.Banner, {
    tone: "success",
    compact: true
  }, "Uses Mosaic tokens. Style, Spacing and Responsive are available on every component."), mob ? cards : /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--mos-border-subtle)',
      borderRadius: 6,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "mos-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Component"), /*#__PURE__*/React.createElement("th", null, "Enabled"), /*#__PURE__*/React.createElement("th", null, "Access"), /*#__PURE__*/React.createElement("th", null, "Readiness"), /*#__PURE__*/React.createElement("th", null, "Schema"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, comps.map(row))))))));
}
function Docs() {
  const d = MOS_DATA.cardDocs;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)',
      marginBottom: 8
    }
  }, "Fields \xB7 from schema"), d.fields.map(f => /*#__PURE__*/React.createElement("div", {
    key: f[1],
    style: {
      display: 'grid',
      gridTemplateColumns: '90px 1fr',
      gap: 8,
      padding: '5px 0',
      borderTop: '1px solid var(--mos-border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-label",
    style: {
      fontSize: 12
    }
  }, f[0]), /*#__PURE__*/React.createElement("span", {
    className: "mos-help"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-mono"
  }, f[1], " \xB7 ", f[2]), /*#__PURE__*/React.createElement("br", null), f[3], " \xB7 ", f[4])))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)',
      marginBottom: 8
    }
  }, "Slots & rules"), d.slots.map(s => /*#__PURE__*/React.createElement("div", {
    key: s[1],
    style: {
      padding: '5px 0',
      borderTop: '1px solid var(--mos-border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-label",
    style: {
      fontSize: 12
    }
  }, s[0]), " ", /*#__PURE__*/React.createElement("span", {
    className: "mos-mono",
    style: {
      color: 'var(--mos-text-faint)'
    }
  }, s[1]), /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "Accepts ", s[2], " \xB7 ", s[3], " items \xB7 preferred fill: ", s[4]))), /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      marginTop: 8
    }
  }, "Allowed in: Card row, Section \xB7 Needs a Card row when placed in a Columns area.")));
}
function ManageAuthoring({
  vp,
  theme
}) {
  const [tab, setTab] = React.useState('ma');
  const mob = vp === 'mobile';
  const rows = [{
    l: 'Heading',
    m: 'heading',
    w: 'Plain text',
    req: true,
    caps: [1, 0, 0],
    d: ''
  }, {
    l: 'Summary',
    m: 'summary',
    w: 'Rich text',
    req: false,
    caps: [1, 0, 0],
    d: 'Example text'
  }, {
    l: 'Media',
    m: 'media',
    w: 'Image fill',
    req: false,
    caps: [0, 1, 0],
    d: ''
  }, {
    l: 'Variant',
    m: 'variant',
    w: 'Dropdown',
    req: false,
    caps: [0, 1, 0],
    d: 'Default'
  }, {
    l: 'Link',
    m: 'url',
    w: 'Plain text',
    req: false,
    caps: [1, 0, 0],
    d: ''
  }];
  const capLabels = ['Bindable', 'Breakpoint', 'Stylable'];
  const fieldRow = (r, i) => mob ? /*#__PURE__*/React.createElement(MA.Card, {
    key: r.m,
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(MA.Icon, {
      name: "grip-vertical",
      size: 14,
      style: {
        color: 'var(--mos-text-faint)'
      }
    }), r.l, /*#__PURE__*/React.createElement("span", {
      className: "mos-mono",
      style: {
        color: 'var(--mos-text-faint)'
      }
    }, r.m))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(MA.Select, {
    label: "Widget",
    size: "sm",
    value: r.w,
    options: ['Rich text', 'Plain text', 'Image fill', 'Open cell', 'Dropdown', 'Hidden']
  }), /*#__PURE__*/React.createElement(MA.Input, {
    size: "sm",
    label: "Help",
    placeholder: "Help for authors"
  }), /*#__PURE__*/React.createElement(MA.Checkbox, {
    checked: r.req,
    label: "Required"
  }))) : /*#__PURE__*/React.createElement("tr", {
    key: r.m
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      width: 24,
      color: 'var(--mos-text-faint)'
    }
  }, /*#__PURE__*/React.createElement(MA.Icon, {
    name: "grip-vertical",
    size: 14
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "mos-label"
  }, r.l), /*#__PURE__*/React.createElement("div", {
    className: "mos-fieldrow__machine"
  }, r.m)), /*#__PURE__*/React.createElement("td", {
    style: {
      minWidth: 130
    }
  }, /*#__PURE__*/React.createElement(MA.Select, {
    size: "sm",
    value: r.w,
    options: ['Rich text', 'Plain text', 'Image fill', 'Open cell', 'Dropdown', 'Hidden']
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      minWidth: 120
    }
  }, /*#__PURE__*/React.createElement(MA.Input, {
    size: "sm",
    defaultValue: r.l
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      minWidth: 140
    }
  }, /*#__PURE__*/React.createElement(MA.Input, {
    size: "sm",
    placeholder: "Help for authors"
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(MA.Checkbox, {
    checked: r.req,
    label: ""
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      minWidth: 100
    }
  }, /*#__PURE__*/React.createElement(MA.Input, {
    size: "sm",
    defaultValue: r.d,
    placeholder: "\u2014"
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, capLabels.map((c, k) => /*#__PURE__*/React.createElement(MA.Checkbox, {
    key: c,
    checked: !!r.caps[k],
    label: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12
      }
    }, c),
    disabled: k === 2
  })))));
  return /*#__PURE__*/React.createElement(MosRegion, {
    theme: theme
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: mob ? '8px 14px 0' : '8px 20px 0'
    }
  }, /*#__PURE__*/React.createElement(MA.Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      id: 'ma',
      label: 'Manage authoring'
    }, {
      id: 'ft',
      label: 'Field types',
      count: 9
    }]
  })), tab === 'ma' ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: mob ? 14 : 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mos-type-title)',
      color: 'var(--mos-text-strong)'
    }
  }, "Card"), /*#__PURE__*/React.createElement("span", {
    className: "mos-help"
  }, "Civic UI \xB7 3.2.1"), /*#__PURE__*/React.createElement(MA.Badge, {
    tone: "ready"
  }, "Ready"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(MA.Button, {
    size: "sm",
    variant: "link"
  }, "Show row weights")), /*#__PURE__*/React.createElement(MA.Banner, {
    tone: "owned",
    compact: true
  }, "Stylable is unavailable: Civic UI owns this component's look."), /*#__PURE__*/React.createElement("div", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, "Fields"), mob ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, rows.map(fieldRow)) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--mos-border-subtle)',
      borderRadius: 6,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "mos-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null), /*#__PURE__*/React.createElement("th", null, "Field"), /*#__PURE__*/React.createElement("th", null, "Widget"), /*#__PURE__*/React.createElement("th", null, "Label"), /*#__PURE__*/React.createElement("th", null, "Help"), /*#__PURE__*/React.createElement("th", null, "Req."), /*#__PURE__*/React.createElement("th", null, "Default"), /*#__PURE__*/React.createElement("th", null, "Capabilities"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(fieldRow)))), /*#__PURE__*/React.createElement("div", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, "Slots"), /*#__PURE__*/React.createElement(MA.Card, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(MA.Icon, {
      name: "grip-vertical",
      size: 14,
      style: {
        color: 'var(--mos-text-faint)'
      }
    }), "Footer ", /*#__PURE__*/React.createElement("span", {
      className: "mos-mono",
      style: {
        color: 'var(--mos-text-faint)'
      }
    }, "footer"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : 'repeat(4,minmax(0,1fr))',
      gap: 14,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-label"
  }, "Allowed children"), /*#__PURE__*/React.createElement(MA.Checkbox, {
    checked: true,
    label: "Button"
  }), /*#__PURE__*/React.createElement(MA.Checkbox, {
    checked: true,
    label: "Link list"
  }), /*#__PURE__*/React.createElement(MA.Checkbox, {
    label: "Plain content"
  })), /*#__PURE__*/React.createElement(MA.Select, {
    label: "Preferred fill",
    options: ['Button', 'Link list'],
    help: "Shown as \u201C+ Add Button\u201D."
  }), /*#__PURE__*/React.createElement(MA.Select, {
    label: "Repeater child",
    options: ['— none —', 'Button'],
    help: "Single-child areas list as a repeater in the rail."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(MA.Input, {
    label: "Min",
    defaultValue: "0"
  }), /*#__PURE__*/React.createElement(MA.Input, {
    label: "Max",
    defaultValue: "2"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(MA.Toggle, {
    checked: true,
    showState: true,
    label: "Example previews",
    description: "Untouched fields show example content, marked EXAMPLE."
  }), /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-label"
  }, "Patterns that show this component"), /*#__PURE__*/React.createElement(MA.Checkbox, {
    checked: true,
    label: "Card row (3 cards)"
  }), /*#__PURE__*/React.createElement(MA.Checkbox, {
    label: "Card + button"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(MA.Button, {
    variant: "primary"
  }, "Save configuration"))) : /*#__PURE__*/React.createElement(FieldTypes, {
    mob: mob
  }));
}
function FieldTypes({
  mob
}) {
  const rows = [['string', 'Plain text', 'B · R', 184], ['string (html)', 'Rich text', 'B', 62], ['string (uri)', 'Plain text', 'B', 40], ['enum', 'Dropdown', 'R · S', 97], ['boolean', 'Toggle', 'R', 33], ['number', 'Plain text (number)', 'R · S', 21], ['object {src, alt}', 'Image fill', '—', 28], ['array<string>', 'Repeater', 'B', 9], ['number | string', null, '—', 2]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: mob ? 14 : 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      fontSize: 13
    }
  }, "Site-wide defaults. Every library's schema shapes map to a widget here; Manage authoring can override per field."), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--mos-border-subtle)',
      borderRadius: 6,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "mos-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Shape"), /*#__PURE__*/React.createElement("th", null, "Default widget"), !mob && /*#__PURE__*/React.createElement("th", null, "Capabilities"), /*#__PURE__*/React.createElement("th", null, "Used by"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0]
  }, /*#__PURE__*/React.createElement("td", {
    className: "mos-mono",
    style: {
      color: 'var(--mos-text-strong)',
      fontSize: 12
    }
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      minWidth: 150
    }
  }, r[1] ? /*#__PURE__*/React.createElement(MA.Select, {
    size: "sm",
    value: r[1],
    options: [r[1], 'Plain text', 'Rich text', 'Dropdown', 'Hidden']
  }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(MA.Select, {
    size: "sm",
    error: " ",
    options: ['Choose a widget…', 'Plain text', 'Dropdown']
  }), /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      color: 'var(--mos-state-attention-fg)',
      marginTop: 4
    }
  }, "No default \u2014 2 fields show Attention"))), !mob && /*#__PURE__*/React.createElement("td", {
    className: "mos-mono",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, r[2]), /*#__PURE__*/React.createElement("td", {
    className: "mos-mono",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, r[3], " fields")))))), /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "B = bindable \xB7 R = varies by breakpoint \xB7 S = stylable. Capabilities decide which rail sections appear."));
}
function ChangesReport({
  vp,
  theme
}) {
  const mob = vp === 'mobile';
  const rows = [['Federal Highway Safety Standards 2026', 'Card', 'Civic UI', 'removed', 'Library removed', 'Heading, Summary, Media, binding kept'], ['Grant programs', 'Card', 'Civic UI', 'type', 'Summary: string → string (html)', 'Text kept as rich text'], ['Road safety news', 'Stat', 'Civic UI', 'attention', 'Value has no default widget', 'Value kept, not editable']];
  const tag = k => k === 'removed' ? /*#__PURE__*/React.createElement(MA.Badge, {
    tone: "blocked",
    icon: "triangle-alert"
  }, "Removed") : k === 'type' ? /*#__PURE__*/React.createElement(MA.Badge, {
    tone: "attention",
    icon: "flag"
  }, "Type changed") : /*#__PURE__*/React.createElement(MA.Badge, {
    tone: "attention",
    icon: "circle-alert"
  }, "Attention");
  return /*#__PURE__*/React.createElement(MosRegion, {
    theme: theme
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: mob ? 14 : 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mos-type-title)',
      color: 'var(--mos-text-strong)'
    }
  }, "Library changes"), /*#__PURE__*/React.createElement("span", {
    className: "mos-help"
  }, "Civic UI 3.1 \u2192 3.2 \xB7 27 Sep 2026")), mob ? rows.map(r => /*#__PURE__*/React.createElement(MA.Card, {
    key: r[0] + r[1],
    title: r[0],
    meta: r[1] + ' · ' + r[2],
    aside: tag(r[3])
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, r[4], ". ", r[5], "."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(MA.Button, {
    size: "sm"
  }, "Open in builder")))) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--mos-border-subtle)',
      borderRadius: 6,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "mos-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Page"), /*#__PURE__*/React.createElement("th", null, "Component"), /*#__PURE__*/React.createElement("th", null, "Change"), /*#__PURE__*/React.createElement("th", null, "Detail"), /*#__PURE__*/React.createElement("th", null, "What was kept"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0] + r[1]
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      color: 'var(--mos-text-strong)',
      fontWeight: 500
    }
  }, r[0]), /*#__PURE__*/React.createElement("td", null, r[1], " ", /*#__PURE__*/React.createElement("span", {
    className: "mos-help"
  }, "\xB7 ", r[2])), /*#__PURE__*/React.createElement("td", null, tag(r[3])), /*#__PURE__*/React.createElement("td", {
    className: "mos-help"
  }, r[4]), /*#__PURE__*/React.createElement("td", {
    className: "mos-help"
  }, r[5]), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(MA.Button, {
    size: "sm",
    iconRight: "arrow-up-right"
  }, "Open in builder")))))))));
}
Object.assign(window, {
  LibrariesPage,
  ManageAuthoring,
  FieldTypes,
  ChangesReport,
  MosRegion
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/Admin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/App.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MX = window.MosaicDesignSystem_9c1bff;
const SIZES = {
  desktop: [1440, 1000],
  tablet: [834, 1112],
  mobile: [390, 844]
};
const ACC0 = [{
  id: 'a',
  summary: 'Who is eligible?',
  meta: 'Accordion item · 1 paragraph'
}, {
  id: 'b',
  summary: 'How do I apply?',
  meta: 'Accordion item · empty'
}];
const SCREENS = [{
  id: 'builder',
  n: '01',
  t: 'Builder in the node form',
  why: 'The builder is one field in the Drupal form, so the palette folds to a 48px strip and the canvas gets the width. The rail shows only the sections a Civic UI Card can use, under the line saying who owns its styling.'
}, {
  id: 'fe',
  n: '02',
  t: 'Front-end edit dialog',
  why: 'The same RailCard component as screen 1, docked beside the live page. It is non-modal, so the page stays readable and every rail section works the same in both places.'
}, {
  id: 'accordion',
  n: '03',
  t: 'Accordion · repeater',
  why: 'A single-child slot becomes a repeater list in the rail. Rows are numbered in mono, reorder works with drag or keyboard, and a min/max banner appears only when a rule is broken.'
}, {
  id: 'bound',
  n: '04',
  t: 'Columns bound to a View',
  states: [['pop', 'Populated'], ['one', 'One item'], ['empty', 'Empty'], ['fail', 'Failing']],
  why: 'Indigo is used only for data. The result line under the area and the Data-state switcher let authors check the empty and failing cases before visitors see them.'
}, {
  id: 'palette',
  n: '05',
  t: 'Palette',
  states: [['full', 'All libraries'], ['empty', 'No results']],
  why: 'Grouped by library, then category, with Patterns last in each library. DATA and Attention badges appear only where they are true, and Attention always states its reason.'
}, {
  id: 'canvas',
  n: '06',
  t: 'Canvas states',
  states: [['all', 'Zone, picker, refused, toast'], ['empty', 'Empty canvas']],
  why: 'Inline controls instead of overlays. The picker anchors to the zone’s “+ Add”, a refused drop names what is allowed, and auto-wrap tells you where the item went, with Undo.'
}, {
  id: 'libraries',
  n: '07',
  t: 'Component libraries',
  admin: true,
  why: 'Admin screens use the same Mosaic tokens, set inside the Drupal admin page. Readiness grades sit next to their reasons, and living docs expand in place.'
}, {
  id: 'authoring',
  n: '08',
  t: 'Manage authoring · Field types',
  admin: true,
  why: 'Follows Drupal’s own manage-form-display pattern (table-drag, widget per row), so site builders already know it. Capabilities here decide which rail sections appear.'
}, {
  id: 'missing',
  n: '09',
  t: 'Library missing',
  states: [['visitor', 'Visitor'], ['editor', 'Editor'], ['builder', 'Builder'], ['report', 'Changes report']],
  why: 'Never a blank page. Visitors see the page without the component. Editors see a small notice. The builder keeps every value and binding, read-only.'
}, {
  id: 'errors',
  n: '10',
  t: 'Save errors · sync',
  states: [['errors', 'Save error'], ['unsaved', 'Unsaved'], ['revert', 'Revert'], ['synced', 'In sync']],
  why: 'Errors name the component, the area and the fix in the author’s words. Save moves focus to the first field that needs attention, and your changes are never discarded.'
}, {
  id: 'keyboard',
  n: '11',
  t: 'Keyboard move · admin themes',
  states: [['keyboard', 'Keyboard move'], ['themes', 'Claro · Gin · Custom']],
  why: 'Keyboard move changes the selection marks to indigo and states the current position aloud. The three-theme view shows the builder pixel-identical in each.'
}];
function useStored(key, init) {
  const [v, setV] = React.useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('mos-kit') || '{}');
      return s[key] ?? init;
    } catch (e) {
      return init;
    }
  });
  React.useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('mos-kit') || '{}');
      s[key] = v;
      localStorage.setItem('mos-kit', JSON.stringify(s));
    } catch (e) {}
  }, [v]);
  return [v, setV];
}
function ScreenBody({
  id,
  st,
  vp,
  theme,
  admin,
  ctx
}) {
  const {
    acc,
    setAcc,
    accActive,
    setAccActive,
    pal,
    setPal,
    picker,
    setPicker,
    toast,
    setToast,
    stale,
    bump,
    setRich,
    altRef,
    setScreen,
    ds,
    setDs
  } = ctx;
  const form = (b, title) => /*#__PURE__*/React.createElement(NodeForm, {
    admin: admin,
    vp: vp,
    title: title,
    onSave: () => setScreen('errors', 'errors')
  }, b);
  const B = p => /*#__PURE__*/React.createElement(Builder, _extends({
    vp: vp,
    theme: theme,
    stale: stale,
    onRailChange: bump,
    sync: stale ? 'stale' : p.sync || 'synced'
  }, p));
  switch (id) {
    case 'builder':
      return form(B({
        canvas: pw => /*#__PURE__*/React.createElement(CanvasCardRow, {
          pw: pw,
          compact: vp === 'mobile'
        }),
        rail: /*#__PURE__*/React.createElement(RailCard, {
          onOpenRich: () => setRich(true)
        }),
        palette: pal,
        setPalette: setPal,
        sync: 'unsaved',
        onRevert: () => {}
      }));
    case 'fe':
      return /*#__PURE__*/React.createElement(FrontEndEdit, {
        vp: vp,
        theme: theme,
        onOpenRich: () => setRich(true)
      });
    case 'accordion':
      return form(B({
        canvas: pw => /*#__PURE__*/React.createElement(CanvasAccordion, {
          pw: pw,
          items: acc,
          activeId: accActive
        }),
        rail: /*#__PURE__*/React.createElement(RailAccordion, {
          items: acc,
          setItems: setAcc,
          activeId: accActive,
          setActive: setAccActive
        }),
        sync: 'unsaved',
        onRevert: () => {},
        counts: [6, 0]
      }), 'Safety grant FAQ');
    case 'bound':
      return form(B({
        canvas: pw => /*#__PURE__*/React.createElement(CanvasBound, {
          pw: pw,
          ds: ds
        }),
        rail: /*#__PURE__*/React.createElement(RailColumns, {
          ds: ds
        }),
        dataState: ds,
        setDataState: setDs,
        counts: [5, 1],
        wcag: ds === 'fail' ? 'AA · 0 issues · 1 data error' : 'AA · 0 issues'
      }), 'Road safety news');
    case 'palette':
      return form(B({
        canvas: pw => /*#__PURE__*/React.createElement(CanvasCardRow, {
          pw: pw
        }),
        palette: /*#__PURE__*/React.createElement(Palette, {
          key: st,
          query: st === 'empty' ? 'carousel' : ''
        }),
        rail: null,
        setPalette: () => {}
      }));
    case 'canvas':
      return form(B({
        canvas: pw => st === 'empty' ? /*#__PURE__*/React.createElement(CanvasEmpty, {
          pw: pw
        }) : /*#__PURE__*/React.createElement(CanvasStates, {
          pw: pw,
          picker: picker,
          setPicker: setPicker,
          toast: toast,
          setToast: setToast
        }),
        rail: null,
        palette: st === 'empty' && vp === 'desktop' ? true : false,
        setPalette: setPal,
        counts: st === 'empty' ? [0, 0] : [7, 0],
        sync: st === 'empty' ? 'synced' : 'unsaved',
        onRevert: () => {}
      }), 'Grant programs');
    case 'libraries':
      return /*#__PURE__*/React.createElement(DrupalShell, {
        admin: admin,
        vp: vp,
        pageTitle: "Component libraries",
        crumbs: ['Home', 'Administration', 'Structure', 'Mosaic']
      }, /*#__PURE__*/React.createElement(LibrariesPage, {
        vp: vp,
        theme: theme
      }));
    case 'authoring':
      return /*#__PURE__*/React.createElement(DrupalShell, {
        admin: admin,
        vp: vp,
        pageTitle: "Manage authoring: Card",
        crumbs: ['Home', 'Structure', 'Mosaic', 'Component libraries', 'Civic UI']
      }, /*#__PURE__*/React.createElement(ManageAuthoring, {
        vp: vp,
        theme: theme
      }));
    case 'missing':
      if (st === 'visitor' || st === 'editor') return /*#__PURE__*/React.createElement(MissingPages, {
        vp: vp,
        theme: theme,
        mode: st
      });
      if (st === 'report') return /*#__PURE__*/React.createElement(DrupalShell, {
        admin: admin,
        vp: vp,
        pageTitle: "Library changes",
        crumbs: ['Home', 'Reports', 'Mosaic']
      }, /*#__PURE__*/React.createElement(ChangesReport, {
        vp: vp,
        theme: theme
      }));
      return form(B({
        canvas: pw => /*#__PURE__*/React.createElement(CanvasMissing, {
          pw: pw
        }),
        rail: /*#__PURE__*/React.createElement(Rail, {
          head: /*#__PURE__*/React.createElement(RailHead, {
            crumbs: ['Page', 'Card row', 'Card'],
            name: "Card",
            lib: "Civic UI \xB7 missing",
            grade: "blocked"
          })
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, /*#__PURE__*/React.createElement(MX.Banner, {
          tone: "error",
          icon: "triangle-alert",
          title: "Removed \u2014 Civic UI isn't installed"
        }, "Values and the \u201CLatest news\u201D binding are kept read-only. Reinstall the library, or remove this component."), /*#__PURE__*/React.createElement(MX.Input, {
          label: "Heading",
          readOnly: true,
          defaultValue: "Road Safety Initiative 2026"
        }), /*#__PURE__*/React.createElement(MX.Input, {
          label: "Media",
          readOnly: true,
          defaultValue: "road-safety-hero.jpg"
        }), /*#__PURE__*/React.createElement(MX.Button, {
          variant: "danger",
          icon: "trash-2"
        }, "Remove component"))),
        wcag: 'AA · 1 component not rendering'
      }));
    case 'errors':
      {
        const overlay = st === 'revert' ? /*#__PURE__*/React.createElement("div", {
          style: {
            position: 'absolute',
            left: 12,
            bottom: 40,
            zIndex: 40
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "mos-picker",
          style: {
            width: 300,
            padding: 14,
            gap: 10
          },
          role: "alertdialog",
          "aria-label": "Revert to saved"
        }, /*#__PURE__*/React.createElement("div", {
          className: "mos-label"
        }, "Revert to the saved layout?"), /*#__PURE__*/React.createElement("div", {
          className: "mos-help"
        }, "Discards 3 changes made since 16:42. This can't be undone."), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end'
          }
        }, /*#__PURE__*/React.createElement(MX.Button, {
          size: "sm",
          onClick: () => setScreen('errors', 'unsaved')
        }, "Keep editing"), /*#__PURE__*/React.createElement(MX.Button, {
          size: "sm",
          variant: "primary",
          onClick: () => setScreen('errors', 'synced')
        }, "Revert")))) : null;
        return form(B({
          canvas: pw => /*#__PURE__*/React.createElement(CanvasCardRow, {
            pw: pw,
            errors: st === 'errors'
          }),
          rail: /*#__PURE__*/React.createElement(RailCard, {
            errors: st === 'errors',
            altRef: altRef,
            onOpenRich: () => setRich(true)
          }),
          errorSummary: st === 'errors' ? /*#__PURE__*/React.createElement(ErrorSummary, {
            vp: vp,
            onJump: i => i.alt && altRef.current && altRef.current.focus()
          }) : null,
          sync: st === 'synced' ? 'synced' : 'unsaved',
          onRevert: () => setScreen('errors', 'revert'),
          wcag: st === 'errors' ? 'AA · 1 issue (alt text)' : 'AA · 0 issues',
          overlay,
          counts: st === 'synced' ? [14, 2] : [15, 2]
        }));
      }
    case 'keyboard':
      return form(B({
        canvas: pw => /*#__PURE__*/React.createElement(CanvasCardRow, {
          pw: pw,
          mode: "keyboard"
        }),
        keyboardBar: /*#__PURE__*/React.createElement(KeyboardBar, {
          vp: vp
        }),
        rail: /*#__PURE__*/React.createElement(RailCard, null),
        sync: 'unsaved',
        onRevert: () => {}
      }));
  }
  return null;
}
function Frame({
  w,
  h,
  scale,
  children,
  overlay,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w * scale,
      height: h * scale,
      flex: 'none',
      position: 'relative'
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    className: "mos-index",
    style: {
      position: 'absolute',
      top: -18,
      left: 0
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      transform: 'scale(' + scale + ')',
      transformOrigin: '0 0',
      position: 'absolute',
      top: 0,
      left: 0,
      background: '#fff',
      boxShadow: '0 0 0 1px rgba(0,0,0,.08),0 12px 40px -12px rgba(0,0,0,.25)',
      borderRadius: 6,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      overflow: 'auto'
    }
  }, children), overlay));
}
function App() {
  const [screen, setScreenId] = useStored('screen', 'builder');
  const [states, setStates] = useStored('states', {});
  const [vp, setVp] = useStored('vp', 'desktop');
  const [theme, setTheme] = useStored('theme', 'light');
  const [admin, setAdmin] = useStored('admin', 'claro');
  const [acc, setAcc] = React.useState(ACC0);
  const [accActive, setAccActive] = React.useState('b');
  const [pal, setPal] = React.useState(false);
  const [picker, setPicker] = React.useState(true);
  const [toast, setToast] = React.useState(true);
  const [stale, setStale] = React.useState(false);
  const [rich, setRich] = React.useState(false);
  const altRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const [sz, setSz] = React.useState([1000, 800]);
  React.useLayoutEffect(() => {
    const ro = new ResizeObserver(e => setSz([e[0].contentRect.width, e[0].contentRect.height]));
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);
  const S = SCREENS.find(s => s.id === screen) || SCREENS[0];
  const st = states[S.id] || S.states && S.states[0][0];
  const setScreen = (id, s) => {
    setScreenId(id);
    if (s) setStates(x => ({
      ...x,
      [id]: s
    }));
    if (id === 'errors' && s === 'errors') setTimeout(() => altRef.current && altRef.current.focus(), 60);
  };
  const bump = () => {
    setStale(true);
    clearTimeout(window.__mosT);
    window.__mosT = setTimeout(() => setStale(false), 1400);
  };
  const ctx = {
    acc,
    setAcc,
    accActive,
    setAccActive,
    pal,
    setPal,
    picker,
    setPicker,
    toast,
    setToast,
    stale,
    bump,
    setRich,
    altRef,
    setScreen,
    ds: S.id === 'bound' ? st : 'pop',
    setDs: v => setStates(x => ({
      ...x,
      bound: v
    }))
  };
  const three = S.id === 'keyboard' && st === 'themes';
  const [W, H] = SIZES[three ? 'desktop' : vp];
  const scale = three ? Math.min((sz[0] - 80) / (W * 3), (sz[1] - 80) / H) : Math.min(1, (sz[0] - 48) / W, (sz[1] - 56) / H);
  const overlay = rich ? /*#__PURE__*/React.createElement(RichTextModal, {
    theme: theme,
    vp: vp,
    onClose: () => setRich(false)
  }) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100vh'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    className: "mosaic",
    "data-mosaic-theme": theme,
    style: {
      width: 290,
      flex: 'none',
      background: 'var(--mos-surface-chrome)',
      borderRight: '1px solid var(--mos-border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 10px',
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 17px/1 var(--mos-font-sans)',
      letterSpacing: '-.02em',
      color: 'var(--mos-text-strong)'
    }
  }, "Mosaic"), /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, "1.0 \xB7 AUTHORING UI KIT")), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, SCREENS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setScreen(s.id),
    className: "mos-picker__opt",
    "aria-selected": s.id === S.id,
    style: {
      all: 'unset',
      boxSizing: 'border-box',
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      padding: '7px 8px',
      borderRadius: 4,
      cursor: 'pointer',
      background: s.id === S.id ? 'var(--mos-accent-soft)' : 'none',
      boxShadow: s.id === S.id ? 'inset 0 0 0 1px var(--mos-accent-soft-border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, s.n), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mos-type-ui)',
      color: 'var(--mos-text-strong)',
      fontWeight: s.id === S.id ? 500 : 400
    }
  }, s.t))), /*#__PURE__*/React.createElement("a", {
    href: "motion.html",
    style: {
      display: 'flex',
      gap: 10,
      padding: '7px 8px',
      textDecoration: 'none',
      color: 'var(--mos-text-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, "12"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mos-type-ui)'
    }
  }, "Motion spec \u2197"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      borderTop: '1px solid var(--mos-border-subtle)',
      marginTop: 12
    }
  }, S.states && /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, "State"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4
    }
  }, S.states.map(([k, l]) => /*#__PURE__*/React.createElement(MX.Button, {
    key: k,
    size: "sm",
    variant: st === k ? 'primary' : 'secondary',
    onClick: () => setScreen(S.id, k)
  }, l)))), !three && /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, "Viewport"), /*#__PURE__*/React.createElement(MX.Segmented, {
    label: "Viewport",
    value: vp,
    onChange: setVp,
    options: [{
      id: 'desktop',
      label: '1440',
      icon: 'monitor'
    }, {
      id: 'tablet',
      label: '834',
      icon: 'tablet'
    }, {
      id: 'mobile',
      label: '390',
      icon: 'smartphone'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, "Mosaic mode"), /*#__PURE__*/React.createElement(MX.Segmented, {
    label: "Mode",
    value: theme,
    onChange: setTheme,
    options: [{
      id: 'light',
      label: 'Light',
      icon: 'sun'
    }, {
      id: 'dark',
      label: 'Dark',
      icon: 'moon'
    }]
  })), !three && /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)'
    }
  }, "Admin theme"), /*#__PURE__*/React.createElement(MX.Segmented, {
    label: "Admin theme",
    value: admin,
    onChange: setAdmin,
    options: [{
      id: 'claro',
      label: 'Claro'
    }, {
      id: 'gin',
      label: 'Gin'
    }, {
      id: 'custom',
      label: 'Custom'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--mos-border-subtle)',
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-muted)',
      marginBottom: 6
    }
  }, S.n, " \xB7 The choice"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--mos-type-body)',
      fontSize: 13,
      color: 'var(--mos-text-default)',
      textWrap: 'pretty'
    }
  }, S.why)))), /*#__PURE__*/React.createElement("main", {
    ref: stageRef,
    style: {
      flex: 1,
      minWidth: 0,
      background: theme === 'dark' ? '#0b0d0f' : '#e7e9ec',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      overflow: 'hidden',
      padding: 24
    }
  }, three ? ['claro', 'gin', 'custom'].map(a => /*#__PURE__*/React.createElement(Frame, {
    key: a,
    w: W,
    h: H,
    scale: scale,
    label: a.toUpperCase()
  }, /*#__PURE__*/React.createElement(ScreenBody, {
    id: "builder",
    vp: "desktop",
    theme: theme,
    admin: a,
    ctx: ctx
  }))) : /*#__PURE__*/React.createElement(Frame, {
    w: W,
    h: H,
    scale: scale,
    overlay: overlay
  }, /*#__PURE__*/React.createElement(ScreenBody, {
    id: S.id,
    st: st,
    vp: vp,
    theme: theme,
    admin: admin,
    ctx: ctx
  }))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/Builder.jsx
try { (() => {
const MB = window.MosaicDesignSystem_9c1bff;
function useWidth(ref) {
  const [w, setW] = React.useState(800);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(e => setW(e[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return w;
}
function Builder({
  vp,
  theme,
  canvas,
  rail,
  palette,
  setPalette,
  sync = 'synced',
  onRevert,
  counts = [14, 2],
  wcag = 'AA · 0 issues',
  dataState,
  setDataState,
  errorSummary,
  keyboardBar,
  height,
  stale,
  onRailChange,
  overlay
}) {
  const mob = vp === 'mobile',
    tab = vp === 'tablet';
  const [cvp, setCvp] = React.useState('d');
  const areaRef = React.useRef(null);
  const aw = useWidth(areaRef);
  const pad = mob ? 12 : 24;
  const pw = cvp === 'm' ? Math.min(375, aw - pad * 2) : cvp === 't' ? Math.min(640, aw - pad * 2) : aw - pad * 2;
  const H = height || (mob ? 700 : tab ? 860 : 800);
  const sheet = mob && (rail || palette);
  return /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    "data-mosaic-theme": theme,
    style: {
      height: H,
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid var(--mos-border-default)',
      borderRadius: 8,
      overflow: 'hidden',
      background: 'var(--mos-surface-chrome)',
      position: 'relative',
      boxShadow: 'var(--mos-shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 8px',
      borderBottom: '1px solid var(--mos-border-subtle)'
    }
  }, mob ? /*#__PURE__*/React.createElement(MB.Button, {
    size: "sm",
    variant: "primary",
    icon: "plus",
    onClick: () => setPalette && setPalette(!palette)
  }, "Add") : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      paddingLeft: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1 var(--mos-font-sans)',
      color: 'var(--mos-text-strong)',
      letterSpacing: '-.01em'
    }
  }, "Mosaic"), /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, "LAYOUT")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(MB.IconButton, {
    size: "sm",
    icon: "undo-2",
    label: "Undo"
  }), /*#__PURE__*/React.createElement(MB.IconButton, {
    size: "sm",
    icon: "redo-2",
    label: "Redo"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(MB.Segmented, {
    label: "Canvas viewport",
    size: "sm",
    value: cvp,
    onChange: setCvp,
    options: [{
      id: 'd',
      icon: 'monitor',
      label: mob ? '' : 'Desktop',
      title: 'Desktop'
    }, {
      id: 't',
      icon: 'tablet',
      label: mob ? '' : 'Tablet',
      title: 'Tablet'
    }, {
      id: 'm',
      icon: 'smartphone',
      label: mob ? '' : 'Mobile',
      title: 'Mobile'
    }]
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), dataState && !mob && /*#__PURE__*/React.createElement(MB.Segmented, {
    label: "Data state",
    size: "sm",
    value: dataState,
    onChange: setDataState,
    options: [{
      id: 'pop',
      label: 'Populated'
    }, {
      id: 'one',
      label: 'One item'
    }, {
      id: 'empty',
      label: 'Empty'
    }, {
      id: 'fail',
      label: 'Failing'
    }]
  }), !mob && /*#__PURE__*/React.createElement(MB.IconButton, {
    size: "sm",
    icon: "maximize-2",
    label: "Focus mode"
  }), mob && /*#__PURE__*/React.createElement(MB.IconButton, {
    size: "sm",
    icon: "more-horizontal",
    label: "More"
  })), dataState && mob && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 8px',
      borderBottom: '1px solid var(--mos-border-subtle)',
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(MB.Segmented, {
    label: "Data state",
    size: "sm",
    value: dataState,
    onChange: setDataState,
    options: [{
      id: 'pop',
      label: 'Populated'
    }, {
      id: 'one',
      label: 'One'
    }, {
      id: 'empty',
      label: 'Empty'
    }, {
      id: 'fail',
      label: 'Failing'
    }]
  })), errorSummary, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      minHeight: 0,
      position: 'relative'
    }
  }, !mob && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      flex: 'none',
      borderRight: '1px solid var(--mos-border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement(MB.IconButton, {
    icon: "blocks",
    label: "Components",
    pressed: !!palette,
    onClick: () => setPalette && setPalette(!palette)
  }), /*#__PURE__*/React.createElement(MB.IconButton, {
    icon: "list-tree",
    label: "Outline"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(MB.IconButton, {
    icon: "keyboard",
    label: "Keyboard shortcuts",
    size: "sm"
  })), palette && !mob && !tab && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 264,
      flex: 'none',
      borderRight: '1px solid var(--mos-border-subtle)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(Palette, {
    onClose: () => setPalette(false)
  })), /*#__PURE__*/React.createElement("div", {
    ref: areaRef,
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'auto',
      background: 'var(--mos-surface-canvas)',
      padding: pad + 'px ' + pad + 'px ' + (sheet ? 380 : pad) + 'px',
      paddingTop: pad + 30
    }
  }, keyboardBar, /*#__PURE__*/React.createElement("div", {
    className: stale ? 'mos-stale' : 'mos-fresh',
    key: stale ? 's' : 'f',
    style: {
      minHeight: '100%'
    }
  }, canvas(pw))), rail && !mob && !tab && /*#__PURE__*/React.createElement("div", {
    onChangeCapture: onRailChange,
    style: {
      width: 320,
      flex: 'none',
      borderLeft: '1px solid var(--mos-border-subtle)',
      minHeight: 0
    }
  }, rail), rail && tab && /*#__PURE__*/React.createElement("div", {
    onChangeCapture: onRailChange,
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      bottom: 8,
      width: 320,
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid var(--mos-border-default)',
      boxShadow: 'var(--mos-shadow-lg)',
      zIndex: 10
    }
  }, rail), palette && tab && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 8,
      left: 56,
      bottom: 8,
      width: 280,
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid var(--mos-border-default)',
      boxShadow: 'var(--mos-shadow-lg)',
      zIndex: 11
    }
  }, /*#__PURE__*/React.createElement(Palette, {
    onClose: () => setPalette(false)
  })), sheet && /*#__PURE__*/React.createElement("div", {
    onChangeCapture: onRailChange,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '62%',
      background: 'var(--mos-surface-chrome)',
      borderTop: '1px solid var(--mos-border-default)',
      borderRadius: '12px 12px 0 0',
      boxShadow: 'var(--mos-shadow-dialog)',
      zIndex: 12,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '6px 0 2px',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: 'var(--mos-border-strong)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0
    }
  }, palette ? /*#__PURE__*/React.createElement(Palette, {
    onClose: () => setPalette(false)
  }) : rail))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 32,
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 12px',
      borderTop: '1px solid var(--mos-border-subtle)',
      background: 'var(--mos-surface-chrome)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(MB.SyncStatus, {
    state: stale ? 'stale' : sync,
    onRevert: onRevert,
    components: mob ? undefined : counts[0],
    bound: mob ? undefined : counts[1]
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), !mob && /*#__PURE__*/React.createElement("span", {
    className: "mos-help",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(MB.Icon, {
    name: "accessibility",
    size: 12
  }), wcag), !mob && !tab && /*#__PURE__*/React.createElement("span", {
    className: "mos-help",
    style: {
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-kbd"
  }, "M"), " move \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "mos-kbd"
  }, "?"), " shortcuts")), overlay);
}
function ErrorSummary({
  onJump,
  vp
}) {
  const items = [{
    t: 'Teaser (Olivero) needs content in its Content area',
    a: 'Go to area'
  }, {
    t: 'Card (Civic UI) image needs alt text',
    a: 'Fix alt text',
    alt: true
  }, {
    t: 'Plain content can only be placed inside another component\u2019s area',
    a: 'Show me'
  }];
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    tabIndex: -1,
    style: {
      padding: '10px 12px',
      borderBottom: '1px solid var(--mos-state-blocked-border)',
      background: 'var(--mos-state-blocked-bg)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(MB.Icon, {
    name: "circle-alert",
    size: 16,
    style: {
      color: 'var(--mos-state-blocked-fg)'
    }
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      font: 'var(--mos-type-ui-strong)',
      color: 'var(--mos-text-strong)'
    }
  }, "3 things to fix before this page can be saved"), /*#__PURE__*/React.createElement("span", {
    className: "mos-help",
    style: {
      marginLeft: 'auto'
    }
  }, vp === 'mobile' ? '' : 'Your changes are kept.')), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i.t,
    style: {
      font: 'var(--mos-type-ui)',
      color: 'var(--mos-text-default)'
    }
  }, /*#__PURE__*/React.createElement("span", null, i.t), " ", /*#__PURE__*/React.createElement("button", {
    className: "mos-btn mos-btn--link",
    style: {
      fontSize: 12,
      marginLeft: 6
    },
    onClick: () => onJump && onJump(i)
  }, i.a)))));
}
function KeyboardBar({
  vp
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      position: 'sticky',
      top: -24,
      zIndex: 25,
      margin: '-24px 0 16px',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-live": "assertive",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '7px 8px 7px 12px',
      borderRadius: 8,
      background: 'var(--mos-surface-inverse)',
      color: 'var(--mos-text-inverse)',
      boxShadow: 'var(--mos-shadow-lg)',
      font: 'var(--mos-type-ui)',
      flexWrap: 'wrap',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MB.Icon, {
    name: "move",
    size: 14
  }), /*#__PURE__*/React.createElement("b", null, "Moving Card"), " \xB7 before \u201CWork-zone safety\u201D, position 1 of 3 in Card row"), vp !== 'mobile' && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 10,
      opacity: .85,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u2191\u2193 move"), /*#__PURE__*/React.createElement("span", null, "\u2192 into Footer"), /*#__PURE__*/React.createElement("span", null, "\u2190 out of Card row"), /*#__PURE__*/React.createElement("span", null, "Enter drop"), /*#__PURE__*/React.createElement("span", null, "Esc cancel")), vp === 'mobile' && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, ['arrow-up', 'arrow-down', 'arrow-right', 'arrow-left'].map(i => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "mos-seltool__btn",
    style: {
      width: 44,
      height: 44
    },
    "aria-label": i.replace('arrow-', 'Move ')
  }, /*#__PURE__*/React.createElement(MB.Icon, {
    name: i,
    size: 16
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "mos-toast__action"
  }, "Drop"), /*#__PURE__*/React.createElement("button", {
    className: "mos-toast__action",
    style: {
      color: 'inherit',
      opacity: .8
    }
  }, "Cancel"))));
}
Object.assign(window, {
  Builder,
  ErrorSummary,
  KeyboardBar,
  useWidth
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/Builder.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/Canvas.jsx
try { (() => {
// Canvas content renders in the SITE's front-end theme (serif, navy) — only the chrome around it is Mosaic.
const M = window.MosaicDesignSystem_9c1bff;
const site = {
  ink: '#1b2a4a',
  body: '#2f3a4f',
  muted: '#5b6477',
  link: '#1a5fb4',
  line: '#d8dde6',
  bg: '#ffffff',
  tint: '#f2f5f9',
  h: '600 {s}px/1.15 Lora,Georgia,serif',
  p: '400 15px/1.6 "Source Sans 3","Segoe UI",sans-serif'
};
const hf = s => site.h.replace('{s}', s);
function ExampleCorner({
  label = 'EXAMPLE'
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mosaic",
    style: {
      position: 'absolute',
      top: 6,
      right: 6,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-badge mos-badge--example mos-badge--sm",
    style: {
      background: 'var(--mos-surface-raised)'
    }
  }, label));
}
function Sel({
  on,
  label,
  index,
  mode,
  toolbar,
  children,
  compact
}) {
  if (!on) return children;
  const f = () => {};
  const tb = toolbar === false ? null : toolbar || /*#__PURE__*/React.createElement(M.SelectionToolbar, {
    compact: compact,
    onParent: f,
    onMoveUp: f,
    onMoveDown: f,
    onKeyboardMove: f,
    onWrap: f,
    onDuplicate: f,
    onRemove: f
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      font: 'inherit',
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(M.SelectionFrame, {
    label: label,
    index: index,
    mode: mode,
    toolbar: tb
  }, children));
}
function SiteHeading({
  children,
  size = 30,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: hf(size),
      color: site.ink,
      letterSpacing: '-.01em'
    }
  }, children), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      font: site.p,
      color: site.body,
      margin: '10px 0 0',
      maxWidth: 620
    }
  }, sub));
}
function SiteCard({
  title,
  body,
  img = true,
  example,
  selected,
  narrow,
  footer,
  imgEmpty,
  missingAlt
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: site.bg,
      border: '1px solid ' + site.line,
      borderRadius: 4,
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, example && /*#__PURE__*/React.createElement(ExampleCorner, null), img && /*#__PURE__*/React.createElement("div", {
    style: {
      height: narrow ? 90 : 110,
      background: imgEmpty ? 'repeating-linear-gradient(135deg,#eef1f5 0 8px,#e4e8ee 8px 9px)' : 'linear-gradient(160deg,#c9d6e6,#8fa6c2)',
      borderRadius: '4px 4px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#5b6477',
      font: '12px "Source Sans 3",sans-serif',
      outline: missingAlt ? '2px solid var(--mos-state-blocked-fg)' : 'none',
      outlineOffset: -2
    }
  }, imgEmpty ? 'No image' : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: hf(narrow ? 16 : 18),
      color: site.ink
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: site.p,
      fontSize: 14,
      color: example ? site.muted : site.body,
      fontStyle: example ? 'italic' : 'normal'
    }
  }, body), footer, /*#__PURE__*/React.createElement("a", {
    style: {
      font: site.p,
      fontSize: 14,
      color: site.link,
      marginTop: 'auto'
    }
  }, "Read more")));
}
function CardRow({
  cols,
  children,
  gap = 16
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + cols + ',minmax(0,1fr))',
      gap
    }
  }, children);
}
function Page({
  children,
  width
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: site.bg,
      maxWidth: width,
      margin: '0 auto',
      padding: width && width < 500 ? '20px 16px 40px' : '32px 36px 56px',
      boxShadow: '0 1px 3px rgba(0,0,0,.08)',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      minHeight: '100%',
      color: site.body
    }
  }, children);
}
function cols(pw, n) {
  return pw < 500 ? 1 : pw < 700 ? Math.min(2, n) : n;
}

// Screen 1 / 10 / 11: card row with a Civic UI card selected
function CanvasCardRow({
  pw,
  mode = 'selected',
  errors,
  compact
}) {
  const c = cols(pw, 3);
  const f = () => {};
  const tb = mode === 'keyboard' ? false : undefined;
  return /*#__PURE__*/React.createElement(Page, {
    width: pw
  }, /*#__PURE__*/React.createElement(SiteHeading, {
    size: pw < 500 ? 24 : 30,
    sub: "The National Highway Traffic Safety Administration publishes annual safety data for all 50 states, at county level from fiscal year 2024."
  }, "Federal Highway Safety Standards 2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, mode === 'keyboard' && /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-drop-line"
  })), /*#__PURE__*/React.createElement(CardRow, {
    cols: c
  }, /*#__PURE__*/React.createElement(SiteCard, {
    title: "Work-zone safety",
    body: "Updated temporary traffic control guidance for 2026.",
    narrow: pw < 700
  }), /*#__PURE__*/React.createElement(Sel, {
    on: true,
    label: "Card \xB7 Civic UI",
    index: "04",
    mode: mode === 'keyboard' ? 'keyboard' : undefined,
    toolbar: tb,
    compact: compact
  }, /*#__PURE__*/React.createElement(SiteCard, {
    title: "Road Safety Initiative 2026",
    body: "A federal\u2013state partnership to reduce highway fatalities 15% by 2028.",
    example: !errors,
    imgEmpty: errors,
    missingAlt: errors,
    narrow: pw < 700,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "mosaic",
      style: {
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement(M.Zone, {
      label: "Footer",
      index: "A",
      empty: true,
      addLabel: "Add Button",
      onAdd: f,
      emptyText: pw < 500 ? null : undefined
    }))
  })), c > 2 && /*#__PURE__*/React.createElement(SiteCard, {
    title: "RAISE grants",
    body: "Funding for local and regional transportation projects.",
    narrow: pw < 700
  }))), errors && /*#__PURE__*/React.createElement("div", {
    className: "mosaic"
  }, /*#__PURE__*/React.createElement(M.Zone, {
    label: "Teaser (Olivero) \xB7 Content",
    index: "B",
    required: true,
    empty: true,
    emptyText: "Needs at least 1 item \u2014 this is why Save stopped.",
    addLabel: "Add Text",
    onAdd: f
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: hf(22),
      color: site.ink,
      marginBottom: 8
    }
  }, "Data and reports"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: site.p,
      margin: 0
    }
  }, "County-level fatality data, crash reports and research summaries.")));
}

// Screen 3: accordion (Mosaic Starter) selected
function CanvasAccordion({
  pw,
  items,
  activeId
}) {
  const f = () => {};
  return /*#__PURE__*/React.createElement(Page, {
    width: pw
  }, /*#__PURE__*/React.createElement(SiteHeading, {
    size: pw < 500 ? 24 : 28
  }, "Safety grant FAQ"), /*#__PURE__*/React.createElement(Sel, {
    on: true,
    label: "Accordion \xB7 Mosaic Starter",
    index: "02"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid ' + site.line,
      borderRadius: 4
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      borderTop: i ? '1px solid ' + site.line : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      font: hf(17),
      color: site.ink,
      background: it.id === activeId ? site.tint : 'none'
    }
  }, it.summary, /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: '20px sans-serif',
      color: site.muted
    }
  }, it.id === activeId ? '–' : '+')), it.id === activeId && /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      padding: '0 16px 16px'
    }
  }, /*#__PURE__*/React.createElement(M.Zone, {
    label: "Panel content",
    index: "A",
    required: true,
    empty: true,
    emptyText: "Requires at least 1 item \u2014 0/1",
    addLabel: "Add Text",
    onAdd: f
  })))), items.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement(M.Zone, {
    label: "Items",
    index: "A",
    required: true,
    empty: true,
    emptyText: "Requires at least 1 item \u2014 0/1",
    addLabel: "Add item",
    onAdd: f
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: site.p,
      margin: 0
    }
  }, "Still have questions? Contact your FHWA division office."));
}

// Screen 4: columns zone bound to a View
function CanvasBound({
  pw,
  ds
}) {
  const n = cols(pw, 3);
  const rows = ds === 'one' ? MOS_DATA.news.slice(0, 1) : MOS_DATA.news;
  const f = () => {};
  let inner;
  if (ds === 'empty') inner = /*#__PURE__*/React.createElement("div", {
    className: "mos-zone__empty",
    style: {
      minHeight: 150
    }
  }, /*#__PURE__*/React.createElement(M.Icon, {
    name: "circle-dashed",
    size: 20
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--mos-text-strong)',
      font: 'var(--mos-type-ui-strong)'
    }
  }, "No results for Topic = Road safety"), /*#__PURE__*/React.createElement("span", null, "Visitors see the View's empty text: \"No news yet.\"", /*#__PURE__*/React.createElement("br", null), "Rows appear here as soon as matching content is published."));else if (ds === 'fail') inner = /*#__PURE__*/React.createElement("div", {
    className: "mos-zone__empty",
    style: {
      minHeight: 150,
      background: 'var(--mos-state-blocked-bg)'
    }
  }, /*#__PURE__*/React.createElement(M.Icon, {
    name: "circle-alert",
    size: 20,
    style: {
      color: 'var(--mos-state-blocked-fg)'
    }
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--mos-state-blocked-fg)',
      font: 'var(--mos-type-ui-strong)'
    }
  }, "Latest news couldn't load"), /*#__PURE__*/React.createElement("span", null, "The View returned an error. Visitors see nothing in this area; the rest of the page is unaffected."), /*#__PURE__*/React.createElement("button", {
    className: "mos-zone__cta"
  }, /*#__PURE__*/React.createElement(M.Icon, {
    name: "refresh-cw",
    size: 14
  }), "Retry preview"));else inner = /*#__PURE__*/React.createElement("div", {
    className: "mos-fresh",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + n + ',minmax(0,1fr))',
      gap: 12,
      fontFamily: 'initial'
    }
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.t,
    style: {
      background: '#fff',
      border: '1px solid ' + site.line,
      borderRadius: 4,
      padding: 12,
      color: site.body
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 60,
      background: 'linear-gradient(160deg,#d6dfeb,#a6b8cf)',
      borderRadius: 2,
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: hf(15),
      color: site.ink
    }
  }, r.t), /*#__PURE__*/React.createElement("div", {
    style: {
      font: site.p,
      fontSize: 13,
      color: site.muted,
      marginTop: 4
    }
  }, r.d))));
  const rl = ds === 'fail' ? /*#__PURE__*/React.createElement(M.ResultLine, {
    state: "failing",
    view: "Latest news",
    error: "View returned an error"
  }) : ds === 'empty' ? /*#__PURE__*/React.createElement(M.ResultLine, {
    state: "empty",
    view: "Latest news",
    display: "Block"
  }) : /*#__PURE__*/React.createElement(M.ResultLine, {
    shown: rows.length,
    total: 128,
    view: "Latest news",
    display: "Block"
  });
  return /*#__PURE__*/React.createElement(Page, {
    width: pw
  }, /*#__PURE__*/React.createElement(SiteHeading, {
    size: pw < 500 ? 24 : 28,
    sub: "The latest on road safety from across the department."
  }, "Road safety news"), /*#__PURE__*/React.createElement(Sel, {
    on: true,
    label: "Columns \xB7 Mosaic Starter",
    index: "02",
    compact: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "mosaic"
  }, /*#__PURE__*/React.createElement(M.Zone, {
    label: "Columns \xB7 each row \u2192 Card",
    index: "A",
    state: ds === 'fail' ? 'failing' : 'bound',
    rule: "VIEW",
    count: /*#__PURE__*/React.createElement(M.Badge, {
      tone: "data",
      size: "sm"
    }, "DATA"),
    footer: rl
  }, inner))));
}

// Screen 6: canvas states composite
function CanvasStates({
  pw,
  picker,
  setPicker,
  toast,
  setToast
}) {
  const f = () => {};
  const narrow = pw < 500;
  return /*#__PURE__*/React.createElement(Page, {
    width: pw
  }, /*#__PURE__*/React.createElement(SiteHeading, {
    size: narrow ? 24 : 28
  }, "Grant programs"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    className: "mosaic"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mos-type-help)',
      color: 'var(--mos-text-faint)',
      marginBottom: 6,
      fontFamily: 'var(--mos-font-mono)'
    }
  }, "SECTION \xB7 MOSAIC STARTER"), /*#__PURE__*/React.createElement(M.Zone, {
    label: "Section \xB7 Content",
    index: "A",
    empty: true,
    emptyText: narrow ? null : 'Drag from the palette, or add here.',
    addLabel: "Add",
    onAdd: () => setPicker(!picker),
    state: picker ? 'highlight' : undefined
  }), picker && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: narrow ? 108 : 118,
      left: narrow ? 0 : '50%',
      transform: narrow ? 'none' : 'translateX(-50%)',
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement(M.Picker, {
    title: "Add to Section \xB7 Content",
    groups: MOS_DATA.pickerGroups,
    onClose: () => setPicker(false),
    onSelect: () => {
      setPicker(false);
      setToast(true);
    }
  }))), /*#__PURE__*/React.createElement(CardRow, {
    cols: cols(pw, 2)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SiteCard, {
    title: "Safe Streets for All",
    body: "Example summary \u2014 replace with real content.",
    example: true,
    narrow: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SiteCard, {
    title: "Bridge investment",
    body: "Competitive grants for bridge replacement and repair.",
    narrow: true,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "mosaic",
      style: {
        marginTop: 6,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(M.Zone, {
      label: "Footer",
      index: "A",
      state: "refused",
      empty: true,
      emptyText: " "
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 30,
        left: 10,
        right: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        background: 'var(--mos-surface-raised)',
        border: '1px solid var(--mos-border-default)',
        borderRadius: 4,
        boxShadow: 'var(--mos-lift-shadow)',
        transform: 'rotate(-1.5deg)',
        font: 'var(--mos-type-ui-strong)',
        color: 'var(--mos-text-strong)',
        opacity: .95
      }
    }, /*#__PURE__*/React.createElement(M.Icon, {
      name: "panel-top",
      size: 14
    }), "Hero"), /*#__PURE__*/React.createElement("span", {
      className: "mos-refused-tip"
    }, /*#__PURE__*/React.createElement(M.Icon, {
      name: "ban",
      size: 12
    }), "Hero can't go in Footer \u2014 allowed: Button, Link list")))
  }))), toast && /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      position: 'sticky',
      bottom: 12,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement(M.Toast, {
    icon: "wrap-text",
    action: "Undo",
    onAction: () => setToast(false),
    onClose: () => setToast(false)
  }, "Placed inside a new ", /*#__PURE__*/React.createElement("strong", null, "Section"))));
}

// Screen 9 (builder view): library missing
function CanvasMissing({
  pw
}) {
  return /*#__PURE__*/React.createElement(Page, {
    width: pw
  }, /*#__PURE__*/React.createElement(SiteHeading, {
    size: pw < 500 ? 24 : 30
  }, "Federal Highway Safety Standards 2026"), /*#__PURE__*/React.createElement(Sel, {
    on: true,
    label: "Card \xB7 Civic UI (missing)",
    index: "04",
    toolbar: /*#__PURE__*/React.createElement(M.SelectionToolbar, {
      onParent: () => {},
      onRemove: () => {}
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "mosaic"
  }, /*#__PURE__*/React.createElement(M.MissingCard, {
    library: "Civic UI",
    component: "Card",
    values: [{
      label: 'Heading',
      value: 'Road Safety Initiative 2026'
    }, {
      label: 'Summary',
      value: 'A federal–state partnership to reduce…'
    }, {
      label: 'Media',
      value: 'road-safety-hero.jpg · alt set'
    }],
    binding: "Latest news \xB7 Block"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: site.p,
      margin: 0
    }
  }, "County-level fatality data, crash reports and research summaries."));
}
function CanvasEmpty({
  pw
}) {
  return /*#__PURE__*/React.createElement(Page, {
    width: pw
  }, /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      textAlign: 'center',
      minHeight: 320,
      border: '1px dashed var(--mos-border-strong)',
      borderRadius: 6,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(M.Icon, {
    name: "layout-template",
    size: 24,
    style: {
      color: 'var(--mos-text-faint)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mos-type-title)',
      color: 'var(--mos-text-strong)'
    }
  }, "This layout is empty"), /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      maxWidth: 320
    }
  }, "Drag a component from the palette, start from a pattern, or add one here. Nothing is published until you save."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(M.Button, {
    variant: "primary",
    icon: "plus"
  }, "Add component"), /*#__PURE__*/React.createElement(M.Button, {
    icon: "layout-grid"
  }, "Use a pattern"))));
}
Object.assign(window, {
  site,
  hf,
  Sel,
  SiteHeading,
  SiteCard,
  CardRow,
  Page,
  CanvasCardRow,
  CanvasAccordion,
  CanvasBound,
  CanvasStates,
  CanvasMissing,
  CanvasEmpty,
  ExampleCorner
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/Canvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/Chrome.jsx
try { (() => {
// Drupal admin chrome — the SITE's theme, deliberately not Mosaic. Three themes prove Mosaic doesn't read them.
const ADMIN_THEMES = {
  claro: {
    font: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    bg: '#fff',
    head: '#f3f4f9',
    ink: '#232429',
    muted: '#545560',
    primary: '#003ecc',
    border: '#8e929c',
    line: '#dedfe4',
    title: '700 32px/1.25',
    radius: 2,
    input: '1px solid #8e929c'
  },
  gin: {
    font: 'Inter,system-ui,-apple-system,"Segoe UI",sans-serif',
    bg: '#f6f7f9',
    head: '#f6f7f9',
    ink: '#222330',
    muted: '#5b5d6b',
    primary: '#0550e6',
    border: '#c3c5cf',
    line: '#e3e4ea',
    title: '600 28px/1.2',
    radius: 8,
    input: '1px solid #c3c5cf'
  },
  custom: {
    font: 'Verdana,Geneva,sans-serif',
    bg: '#fbfaf6',
    head: '#12263f',
    ink: '#1d1d1b',
    muted: '#5a5a55',
    primary: '#9a6b00',
    border: '#8a8577',
    line: '#e2ded2',
    title: '400 30px/1.2 Georgia,serif',
    radius: 0,
    input: '2px solid #8a8577'
  }
};
function AdminBtn({
  t,
  kind = 'primary',
  children,
  onClick
}) {
  const s = kind === 'primary' ? {
    background: t.primary,
    color: '#fff',
    border: '1px solid ' + t.primary
  } : kind === 'danger' ? {
    background: 'none',
    color: '#d72222',
    border: '1px solid transparent'
  } : {
    background: t.line,
    color: t.ink,
    border: '1px solid ' + t.line
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...s,
      font: '600 15px/1 ' + t.font,
      padding: '12px 20px',
      borderRadius: t.radius,
      cursor: 'pointer'
    }
  }, children);
}
function AdminTop({
  admin,
  t,
  vp
}) {
  const mob = vp === 'mobile';
  if (admin === 'gin') return null;
  if (admin === 'custom') return /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.head,
      color: '#fff',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '0 20px',
      borderBottom: '3px solid #c9a227',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 16px Georgia,serif',
      letterSpacing: '.02em'
    }
  }, "Transport Agency CMS"), !mob && ['Content', 'Structure', 'People', 'Reports'].map(x => /*#__PURE__*/React.createElement("span", {
    key: x,
    style: {
      font: '13px ' + t.font,
      opacity: .85
    }
  }, x)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: '13px ' + t.font,
      opacity: .85
    }
  }, "j.harlow"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f0f0f',
      color: '#fff',
      height: 38,
      display: 'flex',
      alignItems: 'center',
      font: '600 13px ' + t.font
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#fff',
      color: '#0f0f0f',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px'
    }
  }, "\u2630 Manage"), !mob && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0 14px'
    }
  }, "\u2605 Shortcuts"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0 14px'
    }
  }, "admin"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      padding: '0 14px'
    }
  }, "Edit")), !mob && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 38,
      borderBottom: '1px solid #d3d4d9',
      display: 'flex',
      alignItems: 'center',
      font: '13px ' + t.font,
      color: '#333',
      boxShadow: '0 1px 2px rgba(0,0,0,.08)'
    }
  }, ['Content', 'Structure', 'Appearance', 'Extend', 'Configuration', 'People', 'Reports', 'Help'].map(x => /*#__PURE__*/React.createElement("span", {
    key: x,
    style: {
      padding: '0 14px',
      borderRight: '1px solid #e6e6e6'
    }
  }, x))));
}
function GinSide({
  t
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      flex: 'none',
      background: '#fff',
      borderRight: '1px solid ' + t.line,
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      font: '500 14px ' + t.font,
      color: t.muted
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 16px ' + t.font,
      color: t.ink,
      padding: '4px 10px 16px'
    }
  }, "Drupal"), ['Content', 'Structure', 'Appearance', 'Extend', 'Configuration', 'People', 'Reports'].map((x, i) => /*#__PURE__*/React.createElement("div", {
    key: x,
    style: {
      padding: '9px 10px',
      borderRadius: 8,
      background: i === 0 ? '#e8efff' : 'none',
      color: i === 0 ? t.primary : t.muted
    }
  }, x)));
}
function DrupalShell({
  admin = 'claro',
  vp,
  pageTitle,
  crumbs = ['Home', 'Content'],
  tabs,
  sidebar,
  children,
  footer,
  sticky
}) {
  const t = ADMIN_THEMES[admin];
  const mob = vp === 'mobile',
    tab = vp === 'tablet';
  const pad = mob ? 16 : tab ? 24 : 48;
  const stacked = mob || tab;
  const gin = admin === 'gin';
  const header = /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.head,
      padding: (mob ? 16 : 24) + 'px ' + pad + 'px 0',
      color: admin === 'custom' ? t.ink : t.ink,
      borderBottom: '1px solid ' + t.line,
      ...(admin === 'custom' ? {
        background: '#f1eee4'
      } : {}),
      ...(gin ? {
        position: 'sticky',
        top: 0,
        zIndex: 5,
        background: 'rgba(246,247,249,.96)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 16,
        paddingBottom: 12
      } : {})
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 12px ' + t.font,
      color: t.muted,
      marginBottom: 8
    }
  }, crumbs.join('  ›  ')), /*#__PURE__*/React.createElement("div", {
    style: {
      font: t.title + (admin === 'custom' ? '' : ' ' + t.font),
      fontSize: mob ? 22 : undefined,
      color: t.ink,
      marginBottom: tabs ? 12 : 20
    }
  }, pageTitle), tabs && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, tabs.map((x, i) => /*#__PURE__*/React.createElement("span", {
    key: x,
    style: {
      font: '600 14px ' + t.font,
      padding: '10px 14px',
      color: i === 1 ? t.primary : t.muted,
      borderBottom: i === 1 ? '3px solid ' + t.primary : '3px solid transparent'
    }
  }, x)))), gin && sticky && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      paddingBottom: 8
    }
  }, sticky));
  const body = /*#__PURE__*/React.createElement("div", {
    style: {
      padding: (mob ? 16 : 28) + 'px ' + pad + 'px 40px',
      display: 'flex',
      flexDirection: stacked ? 'column' : 'row',
      gap: stacked ? 20 : 32,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      width: stacked ? '100%' : undefined
    }
  }, children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 28,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, footer(t))), sidebar && /*#__PURE__*/React.createElement("div", {
    style: {
      width: stacked ? '100%' : 300,
      flex: 'none',
      background: gin ? '#fff' : t.bg,
      border: '1px solid ' + t.line,
      borderRadius: gin ? 8 : 0,
      padding: 20,
      font: '14px/1.5 ' + t.font,
      color: t.ink
    }
  }, sidebar(t)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      font: '14px/1.5 ' + t.font,
      color: t.ink,
      background: t.bg,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(AdminTop, {
    admin: admin,
    t: t,
    vp: vp
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      minHeight: 0
    }
  }, gin && !stacked && /*#__PURE__*/React.createElement(GinSide, {
    t: t
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, header, body)));
}
function NodeSidebar(t) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px ' + t.font,
      marginBottom: 8
    }
  }, "Published"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Last saved:"), " 27 Sep 2026 \u2013 16:42"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("b", null, "Author:"), " j.harlow"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: true
  }), " Create new revision"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px ' + t.font,
      marginBottom: 4
    }
  }, "Revision log message"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      border: t.input,
      borderRadius: t.radius,
      background: '#fff'
    }
  }), ['Menu settings', 'URL alias', 'Authoring information'].map(x => /*#__PURE__*/React.createElement("div", {
    key: x,
    style: {
      borderTop: '1px solid ' + t.line,
      marginTop: 14,
      paddingTop: 12,
      font: '600 14px ' + t.font
    }
  }, "\u203A ", x)));
}
function NodeForm({
  admin,
  vp,
  children,
  onSave,
  title = 'Federal Highway Safety Standards 2026'
}) {
  const t = ADMIN_THEMES[admin];
  const actions = t2 => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AdminBtn, {
    t: t2,
    onClick: onSave
  }, "Save"), /*#__PURE__*/React.createElement(AdminBtn, {
    t: t2,
    kind: "secondary"
  }, "Preview"), /*#__PURE__*/React.createElement(AdminBtn, {
    t: t2,
    kind: "danger"
  }, "Delete"));
  return /*#__PURE__*/React.createElement(DrupalShell, {
    admin: admin,
    vp: vp,
    pageTitle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      style: {
        fontWeight: 400
      }
    }, "Edit Basic page"), " ", title),
    crumbs: ['Home', title],
    tabs: ['View', 'Edit', 'Delete', 'Revisions'],
    sidebar: NodeSidebar,
    footer: admin === 'gin' ? null : actions,
    sticky: actions(t)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20,
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px ' + t.font,
      marginBottom: 6
    }
  }, "Title ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#d72222'
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: t.input,
      borderRadius: t.radius,
      padding: '10px 12px',
      background: '#fff'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px ' + t.font,
      marginBottom: 6
    }
  }, "Layout"), children, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px ' + t.font,
      marginBottom: 6
    }
  }, "Summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: t.input,
      borderRadius: t.radius,
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid ' + t.line,
      padding: '8px 10px',
      font: '600 13px ' + t.font,
      color: t.muted,
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("b", null, "B"), /*#__PURE__*/React.createElement("i", null, "I"), /*#__PURE__*/React.createElement("span", null, "Link"), /*#__PURE__*/React.createElement("span", null, "Paragraph \u25BE")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      color: t.muted,
      minHeight: 56
    }
  }, "Standards, guidance and funding for state DOTs."))));
}
Object.assign(window, {
  ADMIN_THEMES,
  DrupalShell,
  NodeForm,
  AdminBtn
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/Pages.jsx
try { (() => {
const MS = window.MosaicDesignSystem_9c1bff;
function SiteHeader({
  vp,
  editor
}) {
  const mob = vp === 'mobile';
  return /*#__PURE__*/React.createElement("div", null, editor && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f0f0f',
      color: '#fff',
      height: 34,
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px',
      gap: 14,
      font: '600 12px -apple-system,Segoe UI,sans-serif'
    }
  }, "\u2630 Manage", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, "\u270E Edit layout")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#1b2a4a',
      color: '#fff',
      padding: mob ? '14px 16px' : '18px 40px',
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 18px Lora,Georgia,serif'
    }
  }, "Department of Transportation"), !mob && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 22,
      font: '15px "Source Sans 3",sans-serif',
      opacity: .9
    }
  }, /*#__PURE__*/React.createElement("span", null, "Safety"), /*#__PURE__*/React.createElement("span", null, "Grants"), /*#__PURE__*/React.createElement("span", null, "Data"), /*#__PURE__*/React.createElement("span", null, "About")), mob && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: '20px sans-serif'
    }
  }, "\u2630")));
}
function LiveBody({
  vp,
  withCard = true,
  notice,
  selected
}) {
  const mob = vp === 'mobile';
  const n = mob ? 1 : vp === 'tablet' ? 2 : 3;
  const card = /*#__PURE__*/React.createElement(SiteCard, {
    title: "Road Safety Initiative 2026",
    body: "A federal\u2013state partnership to reduce highway fatalities 15% by 2028."
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      padding: mob ? '24px 16px 48px' : '40px 40px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, notice, /*#__PURE__*/React.createElement(SiteHeading, {
    size: mob ? 26 : 36,
    sub: "The National Highway Traffic Safety Administration publishes annual safety data for all 50 states, at county level from fiscal year 2024."
  }, "Federal Highway Safety Standards 2026"), /*#__PURE__*/React.createElement(CardRow, {
    cols: n
  }, /*#__PURE__*/React.createElement(SiteCard, {
    title: "Work-zone safety",
    body: "Updated temporary traffic control guidance for 2026."
  }), withCard && (selected ? /*#__PURE__*/React.createElement(Sel, {
    on: true,
    label: "Card \xB7 Civic UI",
    index: "04",
    toolbar: /*#__PURE__*/React.createElement(MS.SelectionToolbar, {
      onParent: () => {},
      onDuplicate: () => {},
      onRemove: () => {},
      compact: true
    })
  }, card) : card), n > 2 && /*#__PURE__*/React.createElement(SiteCard, {
    title: "RAISE grants",
    body: "Funding for local and regional transportation projects."
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: hf(24),
      color: site.ink,
      marginBottom: 8
    }
  }, "Data and reports"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: site.p,
      margin: 0,
      color: site.body
    }
  }, "County-level fatality data, crash reports and research summaries.")));
}
function FrontEndEdit({
  vp,
  theme,
  onOpenRich
}) {
  const mob = vp === 'mobile';
  const w = vp === 'desktop' ? 400 : 380;
  const [stale, setStale] = React.useState(false);
  const bump = () => {
    setStale(true);
    clearTimeout(window.__feT);
    window.__feT = setTimeout(() => setStale(false), 1400);
  };
  const panel = /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    "data-mosaic-theme": theme,
    onChangeCapture: bump,
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--mos-surface-chrome)',
      border: '1px solid var(--mos-border-default)',
      borderRadius: mob ? '12px 12px 0 0' : 8,
      boxShadow: 'var(--mos-shadow-dialog)',
      overflow: 'hidden'
    },
    role: "dialog",
    "aria-label": "Edit Card"
  }, mob && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '6px 0 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: 'var(--mos-border-strong)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(RailCard, {
    onOpenRich: onOpenRich
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 12px',
      borderTop: '1px solid var(--mos-border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(MS.SyncStatus, {
    state: stale ? 'stale' : 'unsaved',
    onRevert: () => {}
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(MS.Button, {
    size: "sm"
  }, "Cancel"), /*#__PURE__*/React.createElement(MS.Button, {
    size: "sm",
    variant: "primary"
  }, "Save")));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: '100%',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    vp: vp,
    editor: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingRight: mob ? 0 : w + 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: stale ? 'mosaic mos-stale' : ''
  }, /*#__PURE__*/React.createElement(LiveBody, {
    vp: mob ? 'mobile' : 'tablet',
    selected: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: mob ? {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '64%'
    } : {
      position: 'absolute',
      top: 96,
      right: 16,
      width: w,
      bottom: 16
    }
  }, panel));
}
function MissingPages({
  vp,
  theme,
  mode
}) {
  if (mode === 'visitor') return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    vp: vp
  }), /*#__PURE__*/React.createElement(LiveBody, {
    vp: vp,
    withCard: false
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    vp: vp,
    editor: true
  }), /*#__PURE__*/React.createElement(LiveBody, {
    vp: vp,
    withCard: false,
    notice: /*#__PURE__*/React.createElement("div", {
      className: "mosaic",
      "data-mosaic-theme": theme
    }, /*#__PURE__*/React.createElement(MS.Banner, {
      tone: "info",
      icon: "unplug",
      title: "1 component isn't showing: Card (Civic UI)",
      actions: /*#__PURE__*/React.createElement(MS.Button, {
        size: "sm",
        iconRight: "arrow-up-right"
      }, "Open in builder")
    }, "The Civic UI library is missing. Its values are kept. Only editors see this notice."))
  }));
}
function RichTextModal({
  onClose,
  theme,
  vp
}) {
  const mob = vp === 'mobile';
  return /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    "data-mosaic-theme": theme,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--mos-surface-overlay)',
      display: 'flex',
      alignItems: mob ? 'flex-end' : 'center',
      justifyContent: 'center',
      padding: mob ? 0 : 24,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement(MS.Dialog, {
    inline: true,
    width: mob ? '100%' : 640,
    title: "Summary",
    subtitle: "Card \xB7 Civic UI \xB7 formatted text",
    onClose: onClose,
    bodyPadding: 0,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "mos-help"
    }, "Text format: Basic HTML"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(MS.Button, {
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(MS.Button, {
      variant: "primary",
      onClick: onClose
    }, "Apply"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--mos-border-subtle)',
      display: 'flex',
      gap: 2,
      padding: 6,
      background: 'var(--mos-surface-sunken)',
      flexWrap: 'wrap'
    }
  }, ['bold', 'italic', 'link', 'list', 'list-ordered', 'quote'].map(i => /*#__PURE__*/React.createElement(MS.IconButton, {
    key: i,
    size: "sm",
    icon: i,
    label: i
  })), /*#__PURE__*/React.createElement("span", {
    className: "mos-seltool__sep",
    style: {
      background: 'var(--mos-border-default)',
      alignSelf: 'center'
    }
  }), /*#__PURE__*/React.createElement(MS.Button, {
    size: "sm",
    variant: "ghost",
    icon: "image-plus"
  }, "Insert media"), /*#__PURE__*/React.createElement(MS.Select, {
    size: "sm",
    options: ['Paragraph', 'Heading 3', 'Heading 4']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      minHeight: 180,
      font: site.p,
      color: '#222',
      background: '#fff'
    },
    contentEditable: true,
    suppressContentEditableWarning: true
  }, "A federal\u2013state partnership to reduce highway fatalities ", /*#__PURE__*/React.createElement("b", null, "15% by 2028"), ". RAISE Act grant funding is available to states and tribes."), /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      padding: '8px 20px',
      borderTop: '1px solid var(--mos-border-subtle)'
    }
  }, "Drupal's CKEditor 5 with this site's toolbar. Insert media opens the media library.")));
}
Object.assign(window, {
  SiteHeader,
  LiveBody,
  FrontEndEdit,
  MissingPages,
  RichTextModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/Pages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/Palette.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MP = window.MosaicDesignSystem_9c1bff;
function Palette({
  onClose,
  query: q0 = ''
}) {
  const [q, setQ] = React.useState(q0);
  const [closed, setClosed] = React.useState({});
  const ql = q.trim().toLowerCase();
  const libs = MOS_DATA.palette.map(l => ({
    ...l,
    cats: l.cats.map(c => ({
      ...c,
      items: c.items.filter(i => !ql || (i.name + i.blurb).toLowerCase().includes(ql))
    })).filter(c => c.items.length),
    patterns: l.patterns.filter(i => !ql || (i.name + i.blurb).toLowerCase().includes(ql))
  })).filter(l => l.cats.length || l.patterns.length);
  return /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--mos-surface-chrome)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 10px 8px',
      borderBottom: '1px solid var(--mos-border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-caps",
    style: {
      color: 'var(--mos-text-default)',
      paddingLeft: 4
    }
  }, "Components"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, onClose && /*#__PURE__*/React.createElement(MP.IconButton, {
    size: "sm",
    icon: "x",
    label: "Close palette",
    onClick: onClose
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mos-control mos-control--sm"
  }, /*#__PURE__*/React.createElement(MP.Icon, {
    name: "search",
    size: 14,
    style: {
      color: 'var(--mos-text-faint)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search 3 libraries",
    "aria-label": "Search components"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'auto',
      flex: 1,
      padding: '4px 6px 16px'
    }
  }, libs.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 16px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(MP.Icon, {
    name: "search-x",
    size: 20,
    style: {
      color: 'var(--mos-text-faint)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mos-label"
  }, "No components match \u201C", q, "\u201D"), /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "Components hidden for this content type don't appear here. A site builder can enable them in Content type \u203A Layout."), /*#__PURE__*/React.createElement(MP.Button, {
    size: "sm",
    onClick: () => setQ('')
  }, "Clear search")), libs.map((l, li) => /*#__PURE__*/React.createElement("div", {
    key: l.lib,
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "mos-rs__head",
    style: {
      height: 34,
      padding: '0 6px'
    },
    "aria-expanded": !closed[l.lib],
    onClick: () => setClosed({
      ...closed,
      [l.lib]: !closed[l.lib]
    })
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-index"
  }, String(li + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mos-type-ui-strong)',
      color: 'var(--mos-text-strong)'
    }
  }, l.lib), /*#__PURE__*/React.createElement("span", {
    className: "mos-help",
    style: {
      marginLeft: 4,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, l.note), /*#__PURE__*/React.createElement(MP.Icon, {
    name: "chevron-down",
    size: 14,
    className: "mos-rs__chev",
    style: {
      marginLeft: 'auto',
      transform: closed[l.lib] ? 'rotate(-90deg)' : 'none'
    }
  })), !closed[l.lib] && /*#__PURE__*/React.createElement(React.Fragment, null, l.cats.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.cat
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-picker__group",
    style: {
      padding: '8px 8px 2px'
    }
  }, c.cat), c.items.map(i => /*#__PURE__*/React.createElement(MP.PaletteItem, _extends({
    key: i.name
  }, i))))), l.patterns.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mos-picker__group",
    style: {
      padding: '8px 8px 2px'
    }
  }, "Patterns"), l.patterns.map(i => /*#__PURE__*/React.createElement(MP.PaletteItem, _extends({
    key: i.name,
    pattern: true
  }, i)))))))));
}
Object.assign(window, {
  Palette
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/Palette.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/Rail.jsx
try { (() => {
const MR = window.MosaicDesignSystem_9c1bff;
function RailHead({
  crumbs,
  name,
  lib,
  grade = 'ready',
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px 12px 16px',
      borderBottom: '1px solid var(--mos-border-subtle)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-index",
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, crumbs.join('  ›  ')), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(MR.IconButton, {
    size: "sm",
    icon: "arrow-up-left",
    label: "Select parent"
  }), /*#__PURE__*/React.createElement(MR.IconButton, {
    size: "sm",
    icon: "x",
    label: "Close",
    onClick: onClose
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mos-type-title)',
      fontSize: 16,
      color: 'var(--mos-text-strong)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "mos-help"
  }, lib), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(MR.Badge, {
    tone: grade,
    size: "sm"
  }, grade === 'ready' ? 'Ready' : grade === 'attention' ? 'Attention' : 'Blocked'))));
}
function Rail({
  children,
  head
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mosaic",
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--mos-surface-chrome)',
      minHeight: 0
    }
  }, head, /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'auto',
      flex: 1,
      minHeight: 0
    }
  }, children));
}
function RichRow({
  label,
  text,
  example,
  onOpen,
  machine
}) {
  return /*#__PURE__*/React.createElement(MR.FieldRow, {
    label: label,
    example: example,
    machineName: machine,
    badge: example ? /*#__PURE__*/React.createElement(MR.Badge, {
      tone: "example",
      size: "sm"
    }, "EXAMPLE") : null
  }, /*#__PURE__*/React.createElement("div", {
    className: 'mos-rich' + (example ? ' mos-rich--example' : ''),
    role: "button",
    tabIndex: 0,
    onClick: onOpen
  }, text, /*#__PURE__*/React.createElement("span", {
    className: "mos-rich__open"
  }, /*#__PURE__*/React.createElement(MR.Icon, {
    name: "square-pen",
    size: 12
  }), "Edit")));
}
function BindRow({
  label,
  bound,
  legacy,
  onBind
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-label"
  }, label), bound && /*#__PURE__*/React.createElement("div", {
    className: "mos-result",
    style: {
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(MR.Icon, {
    name: "link-2",
    size: 12
  }), bound), legacy && /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      color: 'var(--mos-state-attention-fg)',
      display: 'flex',
      gap: 4,
      alignItems: 'center',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(MR.Icon, {
    name: "history",
    size: 12
  }), "Legacy binding \u2014 remove to edit"), !bound && !legacy && /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "Not bound")), legacy ? /*#__PURE__*/React.createElement(MR.Button, {
    size: "sm",
    variant: "danger"
  }, "Remove") : bound ? /*#__PURE__*/React.createElement(MR.Button, {
    size: "sm",
    variant: "ghost"
  }, "Unbind") : /*#__PURE__*/React.createElement(MR.Button, {
    size: "sm",
    icon: "database",
    onClick: onBind
  }, "Bind"));
}
function RailCard({
  errors,
  onOpenRich,
  altRef,
  onClose,
  changes
}) {
  const [filled, setFilled] = React.useState(!!errors);
  return /*#__PURE__*/React.createElement(Rail, {
    head: /*#__PURE__*/React.createElement(RailHead, {
      crumbs: ['Page', 'Card row', 'Card'],
      name: "Card",
      lib: "Civic UI",
      onClose: onClose
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 4px'
    }
  }, /*#__PURE__*/React.createElement(MR.Banner, {
    tone: "owned",
    compact: true
  }, "Styling is owned by Civic UI Card")), changes && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 0'
    }
  }, /*#__PURE__*/React.createElement(MR.Banner, {
    tone: "attention",
    compact: true,
    icon: "flag",
    title: "Type changed in Civic UI 3.2"
  }, "Summary is now rich text. Your text was kept.")), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "01",
    title: "Content",
    aside: !errors && /*#__PURE__*/React.createElement(MR.Badge, {
      tone: "example",
      size: "sm",
      icon: false
    }, "1 EXAMPLE")
  }, /*#__PURE__*/React.createElement(MR.Input, {
    label: "Heading",
    required: true,
    defaultValue: "Road Safety Initiative 2026",
    help: "Card title. Keep under 90 characters."
  }), /*#__PURE__*/React.createElement(RichRow, {
    label: "Summary",
    text: errors ? 'A federal–state partnership to reduce highway fatalities 15% by 2028.' : 'A federal–state partnership to reduce highway fatalities 15% by 2028.',
    example: !errors,
    onOpen: onOpenRich,
    machine: "summary \xB7 string (html)"
  }), /*#__PURE__*/React.createElement(MR.FieldRow, {
    label: "Media",
    help: "Image or plain content shown above the heading."
  }, filled ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-filled"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-filled__thumb"
  }, /*#__PURE__*/React.createElement(MR.Icon, {
    name: "image",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-label",
    style: {
      fontSize: 12
    }
  }, "Filled by Image"), /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "road-safety-hero.jpg")), /*#__PURE__*/React.createElement(MR.Button, {
    size: "sm",
    variant: "link"
  }, "Edit"), /*#__PURE__*/React.createElement("span", {
    className: "mos-sync__sep"
  }, "\xB7"), /*#__PURE__*/React.createElement(MR.Button, {
    size: "sm",
    variant: "link",
    onClick: () => setFilled(false)
  }, "Remove")), /*#__PURE__*/React.createElement(MR.Input, {
    label: "Alt text",
    required: true,
    inputRef: altRef,
    placeholder: "Describe the image",
    error: errors ? 'Add alt text so people using screen readers know what the image shows.' : undefined,
    help: "Required before saving."
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(MR.Button, {
    variant: "add",
    size: "sm",
    icon: "image-plus",
    onClick: () => setFilled(true)
  }, "Add image"), /*#__PURE__*/React.createElement(MR.Button, {
    variant: "add",
    size: "sm",
    icon: "text"
  }, "Add plain content"))), /*#__PURE__*/React.createElement(MR.Select, {
    label: "Variant",
    options: ['Default', 'Featured', 'Compact']
  }), /*#__PURE__*/React.createElement(MR.Input, {
    label: "Link",
    defaultValue: "/road-safety",
    prefix: "URL",
    help: "Where \u201CRead more\u201D goes."
  })), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "02",
    title: "Slots",
    aside: /*#__PURE__*/React.createElement("span", {
      className: "mos-index"
    }, "1")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      border: '1px dashed var(--mos-slot-line)',
      borderRadius: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-index",
    style: {
      color: 'var(--mos-state-data-fg)'
    }
  }, "A"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-label"
  }, "Footer"), /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "Empty \xB7 0\u20132 \xB7 Button, Link list")), /*#__PURE__*/React.createElement(MR.Button, {
    size: "sm",
    variant: "add",
    icon: "plus"
  }, "Add Button"))), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "03",
    title: "Data",
    aside: /*#__PURE__*/React.createElement(MR.Badge, {
      tone: "data",
      size: "sm"
    }, "1"),
    note: "Binding shows live values from Drupal; it never copies them."
  }, /*#__PURE__*/React.createElement(BindRow, {
    label: "Heading"
  }), /*#__PURE__*/React.createElement(BindRow, {
    label: "Link",
    bound: "This page \u203A URL alias"
  }), /*#__PURE__*/React.createElement(BindRow, {
    label: "Summary",
    legacy: true
  })), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "04",
    title: "Accessibility",
    aside: /*#__PURE__*/React.createElement(MR.Badge, {
      tone: errors ? 'blocked' : 'ready',
      size: "sm"
    }, errors ? '1 issue' : 'AA')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(MR.Icon, {
    name: "heading-3",
    size: 16,
    style: {
      color: 'var(--mos-text-muted)',
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mos-label"
  }, "Heading renders as H3"), /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "Page outline: H1 \u203A H2 \u201CFederal Highway\u2026\u201D \u203A ", /*#__PURE__*/React.createElement("b", null, "H3"), ". In order."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(MR.Icon, {
    name: errors ? 'circle-alert' : 'check',
    size: 16,
    style: {
      color: errors ? 'var(--mos-state-blocked-fg)' : 'var(--mos-state-ready-fg)',
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mos-label"
  }, "Image alt text"), /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, errors ? 'Missing — required at save.' : 'No image set.')))));
}
function RailAccordion({
  items,
  setItems,
  activeId,
  setActive,
  onClose
}) {
  const [grab, setGrab] = React.useState(null);
  const [live, setLive] = React.useState('');
  const move = (id, d) => {
    const i = items.findIndex(x => x.id === id);
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = items.slice();
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
    setLive(n[j].summary + ' moved to position ' + (j + 1) + ' of ' + n.length);
  };
  const [bp, setBp] = React.useState('d');
  const onKey = e => {
    if (!grab) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(grab, -1);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(grab, 1);
    }
    if (e.key === 'Enter' || e.key === 'Escape') setGrab(null);
  };
  return /*#__PURE__*/React.createElement(Rail, {
    head: /*#__PURE__*/React.createElement(RailHead, {
      crumbs: ['Page', 'Accordion'],
      name: "Accordion",
      lib: "Mosaic Starter",
      onClose: onClose
    })
  }, /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "01",
    title: "Content"
  }, /*#__PURE__*/React.createElement(MR.Select, {
    label: "Item title level",
    options: ['H3 (recommended)', 'H2', 'H4'],
    help: "Follows \u201CSafety grant FAQ\u201D (H2)."
  }), /*#__PURE__*/React.createElement(MR.Toggle, {
    label: "Allow several open at once",
    description: "Off: opening one closes the others."
  })), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "02",
    title: "Items",
    aside: /*#__PURE__*/React.createElement("span", {
      className: "mos-index"
    }, items.length, "/12")
  }, /*#__PURE__*/React.createElement("div", {
    onKeyDown: onKey
  }, /*#__PURE__*/React.createElement(MR.Repeater, {
    items: items,
    min: 1,
    max: 12,
    activeId: activeId,
    grabbedId: grab,
    onSelect: setActive,
    onMove: move,
    onRemove: id => {
      setItems(items.filter(x => x.id !== id));
      setLive('Item removed');
    },
    onAdd: () => {
      const id = 'n' + Date.now();
      setItems([...items, {
        id,
        summary: 'New item',
        meta: 'Accordion item · empty'
      }]);
      setLive('Item added');
    }
  })), items.length < 1 && /*#__PURE__*/React.createElement(MR.Banner, {
    tone: "attention",
    compact: true,
    title: "Requires at least 1 item \u2014 0/1"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(MR.Button, {
    size: "sm",
    icon: "move-vertical",
    onClick: () => setGrab(grab ? null : activeId),
    disabled: !items.length
  }, grab ? 'Drop here' : 'Reorder with keyboard'), grab && /*#__PURE__*/React.createElement("span", {
    className: "mos-help"
  }, "\u2191 \u2193 move \xB7 Enter drops")), /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    "aria-live": "assertive",
    style: {
      minHeight: 16,
      fontFamily: 'var(--mos-font-mono)',
      fontSize: 11
    }
  }, live), items.find(i => i.id === activeId) && /*#__PURE__*/React.createElement(MR.Banner, {
    tone: "attention",
    compact: true,
    title: '“' + items.find(i => i.id === activeId).summary + '” · Panel content'
  }, "Requires at least 1 item \u2014 0/1")), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "03",
    title: "Style"
  }, /*#__PURE__*/React.createElement(MR.Select, {
    label: "Surface",
    options: ['Plain', 'Tinted', 'Outlined']
  }), /*#__PURE__*/React.createElement(MR.Select, {
    label: "Spacing",
    options: ['Comfortable', 'Compact']
  })), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "04",
    title: "Responsive",
    aside: /*#__PURE__*/React.createElement("span", {
      className: "mos-index"
    }, "1 override")
  }, /*#__PURE__*/React.createElement(MR.Segmented, {
    label: "Breakpoint",
    size: "sm",
    value: bp,
    onChange: setBp,
    options: [{
      id: 'd',
      label: 'Desktop'
    }, {
      id: 't',
      label: 'Tablet'
    }, {
      id: 'm',
      label: 'Mobile'
    }]
  }), /*#__PURE__*/React.createElement(MR.Select, {
    label: "Spacing",
    options: bp === 'm' ? ['Compact (override)', 'Inherit from Tablet'] : ['Inherit', 'Compact'],
    help: bp === 'm' ? 'Overrides Desktop “Comfortable”.' : 'Only fields that can vary by breakpoint appear here.'
  })), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "05",
    title: "Accessibility",
    aside: /*#__PURE__*/React.createElement(MR.Badge, {
      tone: "ready",
      size: "sm"
    }, "AA")
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "Items render as buttons with aria-expanded; titles as H3 in order.")));
}
function RailColumns({
  ds,
  onClose
}) {
  const [n, setN] = React.useState('3');
  const [ctx, setCtx] = React.useState('Page field: Topic');
  return /*#__PURE__*/React.createElement(Rail, {
    head: /*#__PURE__*/React.createElement(RailHead, {
      crumbs: ['Page', 'Columns'],
      name: "Columns",
      lib: "Mosaic Starter",
      onClose: onClose
    })
  }, /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "01",
    title: "Content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-label"
  }, "Columns"), /*#__PURE__*/React.createElement(MR.Segmented, {
    label: "Columns",
    value: n,
    onChange: setN,
    options: [{
      id: '2',
      label: '2'
    }, {
      id: '3',
      label: '3'
    }, {
      id: '4',
      label: '4'
    }]
  }))), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "02",
    title: "Data",
    aside: /*#__PURE__*/React.createElement(MR.Badge, {
      tone: "data",
      size: "sm"
    }, "VIEW")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(MR.Icon, {
    name: "database",
    size: 16,
    style: {
      color: 'var(--mos-state-data-fg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-label"
  }, "Columns area is bound to a View"), /*#__PURE__*/React.createElement("div", {
    className: "mos-help"
  }, "Each row becomes one child. Nothing is copied.")), /*#__PURE__*/React.createElement(MR.Button, {
    size: "sm",
    variant: "ghost"
  }, "Unbind")), /*#__PURE__*/React.createElement(MR.Select, {
    label: "View",
    options: ['Latest news', 'Events', 'Grant programs']
  }), /*#__PURE__*/React.createElement(MR.Select, {
    label: "Display",
    options: ['Block', 'Page', 'Feed']
  }), /*#__PURE__*/React.createElement(MR.Select, {
    label: "Contextual filter \xB7 Topic",
    value: ctx,
    onChange: e => setCtx(e.target.value),
    options: ['Page field: Topic', 'URL: 2nd path segment', 'Reference: Program › Topic', 'Taxonomy: current term', 'User: current user', 'Fixed value'],
    help: "Fills the View's Topic argument from this page."
  }), /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", null, "Exposed filters: none on this display"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Pager: 3 items")), /*#__PURE__*/React.createElement(MR.Select, {
    label: "Each row becomes",
    options: ['Card · Civic UI', 'Teaser · Olivero']
  }), /*#__PURE__*/React.createElement("div", {
    className: "mos-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-label"
  }, "Field map"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--mos-border-subtle)',
      borderRadius: 4,
      overflow: 'hidden'
    }
  }, MOS_DATA.fieldMap.map(([a, b], i) => /*#__PURE__*/React.createElement("div", {
    key: a,
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 14px minmax(0,1fr)',
      alignItems: 'center',
      gap: 6,
      padding: '6px 8px',
      borderTop: i ? '1px solid var(--mos-border-subtle)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mos-mono",
    style: {
      color: 'var(--mos-state-data-fg)',
      fontSize: 11.5
    }
  }, a), /*#__PURE__*/React.createElement(MR.Icon, {
    name: "arrow-right",
    size: 12,
    style: {
      color: 'var(--mos-text-faint)'
    }
  }), /*#__PURE__*/React.createElement(MR.Select, {
    size: "sm",
    options: [b, 'Heading', 'Summary', 'Media', 'Link', '— none —']
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 10px',
      borderRadius: 4,
      background: 'var(--mos-surface-sunken)'
    }
  }, ds === 'fail' ? /*#__PURE__*/React.createElement(MR.ResultLine, {
    state: "failing",
    view: "Latest news",
    error: "View returned an error"
  }) : ds === 'empty' ? /*#__PURE__*/React.createElement(MR.ResultLine, {
    state: "empty",
    view: "Latest news",
    display: "Block"
  }) : /*#__PURE__*/React.createElement(MR.ResultLine, {
    shown: ds === 'one' ? 1 : 3,
    total: 128,
    view: "Latest news",
    display: "Block"
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", {
    className: "mos-help",
    style: {
      cursor: 'pointer'
    }
  }, "Developer details"), /*#__PURE__*/React.createElement("div", {
    className: "mos-fieldrow__machine",
    style: {
      marginTop: 6,
      lineHeight: 1.6
    }
  }, "view: latest_news \xB7 display: block_1", /*#__PURE__*/React.createElement("br", null), "arg[0]: node.field_topic", /*#__PURE__*/React.createElement("br", null), "child: civic_ui:card"))), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "03",
    title: "Style",
    defaultCollapsed: true
  }), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "04",
    title: "Responsive",
    defaultCollapsed: true,
    aside: /*#__PURE__*/React.createElement("span", {
      className: "mos-index"
    }, "3 \xB7 2 \xB7 1")
  }), /*#__PURE__*/React.createElement(MR.RailSection, {
    index: "05",
    title: "Accessibility",
    defaultCollapsed: true,
    aside: /*#__PURE__*/React.createElement(MR.Badge, {
      tone: "ready",
      size: "sm"
    }, "AA")
  }));
}
Object.assign(window, {
  Rail,
  RailHead,
  RailCard,
  RailAccordion,
  RailColumns
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/Rail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/builder/data.js
try { (() => {
window.MOS_DATA = {
  pickerGroups: [{
    label: 'Plain content',
    items: [{
      id: 'text',
      name: 'Text',
      icon: 'type',
      blurb: 'Formatted text in the area'
    }, {
      id: 'image',
      name: 'Image',
      icon: 'image',
      blurb: 'From the media library'
    }]
  }, {
    label: 'Civic UI',
    items: [{
      id: 'button',
      name: 'Button',
      icon: 'rectangle-horizontal',
      blurb: 'Link styled as an action',
      preferred: true
    }, {
      id: 'link',
      name: 'Link list',
      icon: 'list',
      blurb: 'Up to 5 related links'
    }, {
      id: 'hero',
      name: 'Hero',
      icon: 'panel-top',
      reason: 'Only allowed at page level',
      disabled: true
    }]
  }, {
    label: 'Mosaic Starter',
    items: [{
      id: 'heading',
      name: 'Heading',
      icon: 'heading',
      blurb: 'H2–H4 with guidance'
    }, {
      id: 'spacer',
      name: 'Spacer',
      icon: 'separator-horizontal',
      blurb: 'Vertical rhythm'
    }]
  }],
  palette: [{
    lib: 'Mosaic Starter',
    note: 'Mosaic',
    cats: [{
      cat: 'Text',
      items: [{
        name: 'Heading',
        icon: 'heading',
        blurb: 'H2–H4 with outline guidance',
        data: true
      }, {
        name: 'Text',
        icon: 'pilcrow',
        blurb: 'Formatted text via CKEditor 5'
      }]
    }, {
      cat: 'Layout',
      items: [{
        name: 'Section',
        icon: 'square-dashed',
        blurb: 'Full-width band with one area'
      }, {
        name: 'Columns',
        icon: 'columns-3',
        blurb: '2–4 equal areas; bindable to a View',
        data: true
      }, {
        name: 'Accordion',
        icon: 'list-collapse',
        blurb: 'Expandable items, 1–12'
      }]
    }],
    patterns: [{
      name: 'Intro + columns',
      icon: 'layout-template',
      blurb: 'Heading, text, 3 columns'
    }]
  }, {
    lib: 'Civic UI',
    note: 'Installed · shadow DOM',
    cats: [{
      cat: 'Cards',
      items: [{
        name: 'Card',
        icon: 'rectangle-horizontal',
        blurb: 'Image, title, summary, footer',
        data: true,
        needs: 'Card row'
      }, {
        name: 'Card row',
        icon: 'gallery-horizontal',
        blurb: 'Holds 2–4 cards'
      }]
    }, {
      cat: 'Heroes',
      items: [{
        name: 'Hero',
        icon: 'panel-top',
        blurb: 'Full-width lead with image',
        attention: 'Background image has no alt field in its schema'
      }]
    }],
    patterns: [{
      name: 'Card row',
      icon: 'layout-grid',
      blurb: 'Card row with 3 cards, one click'
    }]
  }, {
    lib: 'Olivero',
    note: 'Theme · ships global styles',
    cats: [{
      cat: 'Content',
      items: [{
        name: 'Teaser',
        icon: 'newspaper',
        blurb: 'Title, date and content area',
        needs: 'Section'
      }, {
        name: 'Callout',
        icon: 'message-square-quote',
        blurb: 'Highlighted note',
        restricted: true
      }]
    }],
    patterns: []
  }],
  libraries: [{
    id: 'starter',
    name: 'Mosaic Starter',
    version: '1.0.0',
    on: true,
    own: true,
    note: 'Mosaic tokens · no global styles',
    count: 14,
    ready: 14,
    attention: 0,
    blocked: 0
  }, {
    id: 'civic',
    name: 'Civic UI',
    version: '3.2.1',
    on: true,
    note: 'Styles in JavaScript (shadow DOM)',
    count: 12,
    ready: 9,
    attention: 2,
    blocked: 1
  }, {
    id: 'olivero',
    name: 'Olivero',
    version: '11.1',
    on: true,
    note: 'Theme-bound · ships global styles',
    theme: true,
    count: 6,
    ready: 5,
    attention: 1,
    blocked: 0
  }, {
    id: 'ds',
    name: 'Agency Patterns',
    version: '0.9.0',
    on: false,
    note: 'Ships global styles (resets)',
    count: 22,
    ready: 18,
    attention: 3,
    blocked: 1
  }],
  civicComponents: [{
    name: 'Card',
    on: true,
    restricted: false,
    grade: 'ready',
    fields: 5,
    slots: 1
  }, {
    name: 'Card row',
    on: true,
    restricted: false,
    grade: 'ready',
    fields: 1,
    slots: 1
  }, {
    name: 'Hero',
    on: true,
    restricted: false,
    grade: 'attention',
    reason: 'Background image — schema has no alt text field',
    fields: 4,
    slots: 0
  }, {
    name: 'Accordion',
    on: true,
    restricted: false,
    grade: 'ready',
    fields: 2,
    slots: 1
  }, {
    name: 'Alert',
    on: true,
    restricted: true,
    grade: 'ready',
    fields: 3,
    slots: 0
  }, {
    name: 'Map embed',
    on: false,
    restricted: false,
    grade: 'blocked',
    reason: 'Requires a script library that isn\u2019t installed',
    fields: 2,
    slots: 0
  }, {
    name: 'Stat',
    on: true,
    restricted: false,
    grade: 'attention',
    reason: 'Value — type "number|string" has no default widget',
    fields: 3,
    slots: 0
  }],
  cardDocs: {
    fields: [['Heading', 'heading', 'string', 'Plain text', 'Required · max 90'], ['Summary', 'summary', 'string (html)', 'Rich text', '—'], ['Media', 'media', 'html', 'Image fill', 'Alt required'], ['Variant', 'variant', 'enum', 'Dropdown', 'default · featured · compact'], ['Link', 'url', 'string (uri)', 'Plain text', '—']],
    slots: [['Footer', 'footer', 'Button, Link list', '0–2', 'Button']]
  },
  fieldMap: [['Title', 'Heading'], ['Body (summary)', 'Summary'], ['Image', 'Media'], ['Path', 'Link']],
  news: [{
    t: 'New rumble-strip standard for rural two-lane roads',
    d: '12 Sep 2026'
  }, {
    t: 'States report 4% drop in work-zone crashes',
    d: '4 Sep 2026'
  }, {
    t: 'Guidance on e-scooter lanes published',
    d: '28 Aug 2026'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/builder/data.js", error: String((e && e.message) || e) }); }

__ds_ns.MissingCard = __ds_scope.MissingCard;

__ds_ns.PaletteItem = __ds_scope.PaletteItem;

__ds_ns.Picker = __ds_scope.Picker;

__ds_ns.Repeater = __ds_scope.Repeater;

__ds_ns.SelectionFrame = __ds_scope.SelectionFrame;

__ds_ns.Zone = __ds_scope.Zone;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.ResultLine = __ds_scope.ResultLine;

__ds_ns.SyncStatus = __ds_scope.SyncStatus;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Segmented = __ds_scope.Segmented;

__ds_ns.SelectionToolbar = __ds_scope.SelectionToolbar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.FieldRow = __ds_scope.FieldRow;

__ds_ns.RailSection = __ds_scope.RailSection;

})();
