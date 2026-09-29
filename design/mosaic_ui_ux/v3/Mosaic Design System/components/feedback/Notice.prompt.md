Fixed-copy notice for library changes and legacy values, placed directly above the affected rail row.
```jsx
<Notice kind="removed" field="Eyebrow" onAction={remove}>Removed from Civic UI Card 3.2. The value “New for 2026” is kept but not shown.</Notice>
<Notice kind="legacy-binding" field="Summary" onAction={unbind} />
```
Glyphs: removed ⚠ triangle-alert · type ⚑ flag · attention ! circle-alert · legacy history. The label text is fixed so the same notice always reads the same everywhere.
