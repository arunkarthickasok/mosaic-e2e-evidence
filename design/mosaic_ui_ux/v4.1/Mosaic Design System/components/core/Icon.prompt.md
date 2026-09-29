Lucide outline glyph (CDN) that inherits currentColor; use at 16px in controls, 20px in headers.
```jsx
<Icon name="database" /> <Icon name="alert-triangle" size={20} label="Attention" />
```
Loads from the local subset `assets/icons/lucide-subset.js` (window.MOS_ICONS, data URIs) when present, so pages render offline; falls back to the Lucide CDN. Decorative by default (aria-hidden). Pass `label` when the icon is the only content.
