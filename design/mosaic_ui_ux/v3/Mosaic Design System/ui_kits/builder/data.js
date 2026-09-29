window.MOS_DATA = {
  pickerGroups: [
    { label: 'Plain content', items: [
      { id: 'text', name: 'Text', icon: 'type', blurb: 'Formatted text in the area' },
      { id: 'image', name: 'Image', icon: 'image', blurb: 'From the media library' }
    ]},
    { label: 'Civic UI', items: [
      { id: 'button', name: 'Button', icon: 'rectangle-horizontal', blurb: 'Link styled as an action', preferred: true },
      { id: 'link', name: 'Link list', icon: 'list', blurb: 'Up to 5 related links' },
      { id: 'hero', name: 'Hero', icon: 'panel-top', reason: 'Only allowed at page level', disabled: true }
    ]},
    { label: 'Mosaic Starter', items: [
      { id: 'heading', name: 'Heading', icon: 'heading', blurb: 'H2–H4 with guidance' },
      { id: 'spacer', name: 'Spacer', icon: 'separator-horizontal', blurb: 'Vertical rhythm' }
    ]}
  ],
  palette: [
    { lib: 'Mosaic Starter', note: 'Mosaic', cats: [
      { cat: 'Text', items: [
        { name: 'Heading', icon: 'heading', blurb: 'H2–H4 with outline guidance', data: true },
        { name: 'Text', icon: 'pilcrow', blurb: 'Formatted text via CKEditor 5' }
      ]},
      { cat: 'Layout', items: [
        { name: 'Section', icon: 'square-dashed', blurb: 'Full-width band with one area' },
        { name: 'Columns', icon: 'columns-3', blurb: '2–4 equal areas; bindable to a View', data: true },
        { name: 'Accordion', icon: 'list-collapse', blurb: 'Expandable items, 1–12' }
      ]}
    ], patterns: [{ name: 'Intro + columns', icon: 'layout-template', blurb: 'Heading, text, 3 columns', inserts: 5 }]},
    { lib: 'Civic UI', note: 'Installed · shadow DOM', cats: [
      { cat: 'Cards', items: [
        { name: 'Card', icon: 'rectangle-horizontal', blurb: 'Image, title, summary, footer', data: true, needs: 'Card row' },
        { name: 'Card row', icon: 'gallery-horizontal', blurb: 'Holds 2–4 cards' }
      ]},
      { cat: 'Heroes', items: [
        { name: 'Hero', icon: 'panel-top', blurb: 'Full-width lead with image', attention: 'Background image has no alt field in its schema' }
      ]}
    ], patterns: [{ name: 'Card row', icon: 'layout-grid', blurb: 'Card row with 3 cards, one click', inserts: 4 }, { name: 'Card + button', icon: 'layout-panel-top', blurb: 'One card with a footer button', inserts: 2 }]},
    { lib: 'Olivero', note: 'Theme · ships global styles', cats: [
      { cat: 'Content', items: [
        { name: 'Teaser', icon: 'newspaper', blurb: 'Title, date and content area', needs: 'Section' },
        { name: 'Callout', icon: 'message-square-quote', blurb: 'Highlighted note', restricted: true }
      ]}
    ], patterns: []}
  ],
  libraries: [
    { id: 'starter', name: 'Mosaic Starter', version: '1.0.0', on: true, own: true, note: 'Mosaic tokens · no global styles', count: 14, ready: 14, attention: 0, blocked: 0 },
    { id: 'civic', name: 'Civic UI', version: '3.2.1', on: true, note: 'Styles in JavaScript (shadow DOM)', count: 12, ready: 9, attention: 2, blocked: 1 },
    { id: 'olivero', name: 'Olivero', version: '11.1', on: true, note: 'Theme-bound · ships global styles', theme: true, count: 6, ready: 5, attention: 1, blocked: 0 },
    { id: 'ds', name: 'Agency Patterns', version: '0.9.0', on: false, note: 'Ships global styles (resets)', count: 22, ready: 18, attention: 3, blocked: 1 }
  ],
  civicComponents: [
    { name: 'Card', on: true, restricted: false, grade: 'ready', fields: 5, slots: 1 },
    { name: 'Card row', on: true, restricted: false, grade: 'ready', fields: 1, slots: 1 },
    { name: 'Hero', on: true, restricted: false, grade: 'attention', reason: 'Background image — schema has no alt text field', fields: 4, slots: 0 },
    { name: 'Accordion', on: true, restricted: false, grade: 'ready', fields: 2, slots: 1 },
    { name: 'Alert', on: true, restricted: true, grade: 'ready', fields: 3, slots: 0 },
    { name: 'Map embed', on: false, restricted: false, grade: 'blocked', reason: 'Requires a script library that isn\u2019t installed', fields: 2, slots: 0 },
    { name: 'Stat', on: true, restricted: false, grade: 'attention', reason: 'Value — type "number|string" has no default widget', fields: 3, slots: 0 }
  ],
  cardDocs: {
    fields: [
      ['Heading', 'heading', 'string', 'Plain text', 'Required · max 90'],
      ['Summary', 'summary', 'string (html)', 'Rich text', '—'],
      ['Media', 'media', 'html', 'Image fill', 'Alt required'],
      ['Variant', 'variant', 'enum', 'Dropdown', 'default · featured · compact'],
      ['Link', 'url', 'string (uri)', 'Plain text', '—']
    ],
    slots: [['Footer', 'footer', 'Button, Link list', '0–2', 'Button']]
  },
  fieldMap: [
    ['Title', 'Heading'], ['Body (summary)', 'Summary'], ['Image', 'Media'], ['Path', 'Link']
  ],
  news: [
    { t: 'New rumble-strip standard for rural two-lane roads', d: '12 Sep 2026' },
    { t: 'States report 4% drop in work-zone crashes', d: '4 Sep 2026' },
    { t: 'Guidance on e-scooter lanes published', d: '28 Aug 2026' }
  ]
};
