/* @ds-bundle: {"format":4,"namespace":"MosaicDesignSystem_9c1bff","components":[{"name":"MissingCard","sourcePath":"components/builder/MissingCard.jsx"},{"name":"PaletteItem","sourcePath":"components/builder/PaletteItem.jsx"},{"name":"Picker","sourcePath":"components/builder/Picker.jsx"},{"name":"Repeater","sourcePath":"components/builder/Repeater.jsx"},{"name":"SelectionFrame","sourcePath":"components/builder/SelectionFrame.jsx"},{"name":"Zone","sourcePath":"components/builder/Zone.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"Toggle","sourcePath":"components/core/Toggle.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"Notice","sourcePath":"components/feedback/Notice.jsx"},{"name":"ResultLine","sourcePath":"components/feedback/ResultLine.jsx"},{"name":"SyncStatus","sourcePath":"components/feedback/SyncStatus.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Segmented","sourcePath":"components/navigation/Segmented.jsx"},{"name":"SelectionToolbar","sourcePath":"components/navigation/SelectionToolbar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Dialog","sourcePath":"components/surfaces/Dialog.jsx"},{"name":"FieldRow","sourcePath":"components/surfaces/FieldRow.jsx"},{"name":"RailSection","sourcePath":"components/surfaces/RailSection.jsx"}],"sourceHashes":{"assets/icons/lucide-subset.js":"9fa29fd1c8ba","components/builder/MissingCard.jsx":"063a7958d4b7","components/builder/PaletteItem.jsx":"870f5595c3a1","components/builder/Picker.jsx":"85e7aa0ca9c1","components/builder/Repeater.jsx":"acbd2bf2d072","components/builder/SelectionFrame.jsx":"e80ce144223c","components/builder/Zone.jsx":"30ae13c6458c","components/core/Badge.jsx":"bced415f5bb5","components/core/Button.jsx":"42680e4f29c1","components/core/Checkbox.jsx":"d231705fa61e","components/core/Icon.jsx":"1f8ae6e21539","components/core/IconButton.jsx":"90a15f10b2ab","components/core/Input.jsx":"6efbcf4da8d3","components/core/Select.jsx":"2cfc0eae98d7","components/core/Toggle.jsx":"b5ecfdc92255","components/feedback/Banner.jsx":"2ba34de65932","components/feedback/Notice.jsx":"5d533721a4b7","components/feedback/ResultLine.jsx":"9353a10ea009","components/feedback/SyncStatus.jsx":"2463852edcc7","components/feedback/Toast.jsx":"2ab52707fae2","components/navigation/Segmented.jsx":"cbb856fa0c91","components/navigation/SelectionToolbar.jsx":"8cecd0984b46","components/navigation/Tabs.jsx":"0ae40e5fd98f","components/surfaces/Card.jsx":"b00bbbf0146d","components/surfaces/Dialog.jsx":"2ddd73d5450d","components/surfaces/FieldRow.jsx":"5e9ad5924486","components/surfaces/RailSection.jsx":"6e1ba376f70b","ui_kits/builder/data.js":"c00dd2c6b432"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MosaicDesignSystem_9c1bff = window.MosaicDesignSystem_9c1bff || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/icons/lucide-subset.js
try { (() => {
/* Lucide (ISC) icon subset used by Mosaic, as data URIs for offline use. Generated from lucide-static@0.460.0. */
window.MOS_ICONS = {
  "x": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-x%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M18%206%206%2018%22%20%2F%3E%3Cpath%20d%3D%22m6%206%2012%2012%22%20%2F%3E%3C%2Fsvg%3E",
  "accessibility": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-accessibility%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%224%22%20r%3D%221%22%20%2F%3E%3Cpath%20d%3D%22m18%2019%201-7-6%201%22%20%2F%3E%3Cpath%20d%3D%22m5%208%203-3%205.5%203-2.36%203.5%22%20%2F%3E%3Cpath%20d%3D%22M4.24%2014.5a5%205%200%200%200%206.88%206%22%20%2F%3E%3Cpath%20d%3D%22M13.76%2017.5a5%205%200%200%200-6.88-6%22%20%2F%3E%3C%2Fsvg%3E",
  "arrow-down": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-arrow-down%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%205v14%22%20%2F%3E%3Cpath%20d%3D%22m19%2012-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E",
  "arrow-left": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-arrow-left%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m12%2019-7-7%207-7%22%20%2F%3E%3Cpath%20d%3D%22M19%2012H5%22%20%2F%3E%3C%2Fsvg%3E",
  "arrow-right": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-arrow-right%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%2012h14%22%20%2F%3E%3Cpath%20d%3D%22m12%205%207%207-7%207%22%20%2F%3E%3C%2Fsvg%3E",
  "arrow-up": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-arrow-up%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m5%2012%207-7%207%207%22%20%2F%3E%3Cpath%20d%3D%22M12%2019V5%22%20%2F%3E%3C%2Fsvg%3E",
  "arrow-up-left": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-arrow-up-left%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M7%2017V7h10%22%20%2F%3E%3Cpath%20d%3D%22M17%2017%207%207%22%20%2F%3E%3C%2Fsvg%3E",
  "arrow-up-right": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-arrow-up-right%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M7%207h10v10%22%20%2F%3E%3Cpath%20d%3D%22M7%2017%2017%207%22%20%2F%3E%3C%2Fsvg%3E",
  "asterisk": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-asterisk%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%206v12%22%20%2F%3E%3Cpath%20d%3D%22M17.196%209%206.804%2015%22%20%2F%3E%3Cpath%20d%3D%22m6.804%209%2010.392%206%22%20%2F%3E%3C%2Fsvg%3E",
  "ban": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-ban%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpath%20d%3D%22m4.9%204.9%2014.2%2014.2%22%20%2F%3E%3C%2Fsvg%3E",
  "baseline": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-baseline%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4%2020h16%22%20%2F%3E%3Cpath%20d%3D%22m6%2016%206-12%206%2012%22%20%2F%3E%3Cpath%20d%3D%22M8%2012h8%22%20%2F%3E%3C%2Fsvg%3E",
  "blocks": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-blocks%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%2214%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Cpath%20d%3D%22M10%2021V8a1%201%200%200%200-1-1H4a1%201%200%200%200-1%201v12a1%201%200%200%200%201%201h12a1%201%200%200%200%201-1v-5a1%201%200%200%200-1-1H3%22%20%2F%3E%3C%2Fsvg%3E",
  "bold": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-bold%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M6%2012h9a4%204%200%200%201%200%208H7a1%201%200%200%201-1-1V5a1%201%200%200%201%201-1h7a4%204%200%200%201%200%208%22%20%2F%3E%3C%2Fsvg%3E",
  "book-open": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-book-open%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%207v14%22%20%2F%3E%3Cpath%20d%3D%22M3%2018a1%201%200%200%201-1-1V4a1%201%200%200%201%201-1h5a4%204%200%200%201%204%204%204%204%200%200%201%204-4h5a1%201%200%200%201%201%201v13a1%201%200%200%201-1%201h-6a3%203%200%200%200-3%203%203%203%200%200%200-3-3z%22%20%2F%3E%3C%2Fsvg%3E",
  "box": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-box%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%208a2%202%200%200%200-1-1.73l-7-4a2%202%200%200%200-2%200l-7%204A2%202%200%200%200%203%208v8a2%202%200%200%200%201%201.73l7%204a2%202%200%200%200%202%200l7-4A2%202%200%200%200%2021%2016Z%22%20%2F%3E%3Cpath%20d%3D%22m3.3%207%208.7%205%208.7-5%22%20%2F%3E%3Cpath%20d%3D%22M12%2022V12%22%20%2F%3E%3C%2Fsvg%3E",
  "check": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-check%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%206%209%2017l-5-5%22%20%2F%3E%3C%2Fsvg%3E",
  "chevron-down": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-chevron-down%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%20%2F%3E%3C%2Fsvg%3E",
  "chevron-right": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-chevron-right%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m9%2018%206-6-6-6%22%20%2F%3E%3C%2Fsvg%3E",
  "chevrons-up-down": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-chevrons-up-down%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m7%2015%205%205%205-5%22%20%2F%3E%3Cpath%20d%3D%22m7%209%205-5%205%205%22%20%2F%3E%3C%2Fsvg%3E",
  "circle-alert": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-circle-alert%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%228%22%20y2%3D%2212%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212.01%22%20y1%3D%2216%22%20y2%3D%2216%22%20%2F%3E%3C%2Fsvg%3E",
  "circle-check": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-circle-check%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpath%20d%3D%22m9%2012%202%202%204-4%22%20%2F%3E%3C%2Fsvg%3E",
  "circle-dashed": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-circle-dashed%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10.1%202.182a10%2010%200%200%201%203.8%200%22%20%2F%3E%3Cpath%20d%3D%22M13.9%2021.818a10%2010%200%200%201-3.8%200%22%20%2F%3E%3Cpath%20d%3D%22M17.609%203.721a10%2010%200%200%201%202.69%202.7%22%20%2F%3E%3Cpath%20d%3D%22M2.182%2013.9a10%2010%200%200%201%200-3.8%22%20%2F%3E%3Cpath%20d%3D%22M20.279%2017.609a10%2010%200%200%201-2.7%202.69%22%20%2F%3E%3Cpath%20d%3D%22M21.818%2010.1a10%2010%200%200%201%200%203.8%22%20%2F%3E%3Cpath%20d%3D%22M3.721%206.391a10%2010%200%200%201%202.7-2.69%22%20%2F%3E%3Cpath%20d%3D%22M6.391%2020.279a10%2010%200%200%201-2.69-2.7%22%20%2F%3E%3C%2Fsvg%3E",
  "circle-slash": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-circle-slash%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cline%20x1%3D%229%22%20x2%3D%2215%22%20y1%3D%2215%22%20y2%3D%229%22%20%2F%3E%3C%2Fsvg%3E",
  "columns-3": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-columns-3%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M9%203v18%22%20%2F%3E%3Cpath%20d%3D%22M15%203v18%22%20%2F%3E%3C%2Fsvg%3E",
  "copy": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-copy%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2214%22%20height%3D%2214%22%20x%3D%228%22%20y%3D%228%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M4%2016c-1.1%200-2-.9-2-2V4c0-1.1.9-2%202-2h10c1.1%200%202%20.9%202%202%22%20%2F%3E%3C%2Fsvg%3E",
  "corner-down-right": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-corner-down-right%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpolyline%20points%3D%2215%2010%2020%2015%2015%2020%22%20%2F%3E%3Cpath%20d%3D%22M4%204v7a4%204%200%200%200%204%204h12%22%20%2F%3E%3C%2Fsvg%3E",
  "database": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-database%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cellipse%20cx%3D%2212%22%20cy%3D%225%22%20rx%3D%229%22%20ry%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M3%205V19A9%203%200%200%200%2021%2019V5%22%20%2F%3E%3Cpath%20d%3D%22M3%2012A9%203%200%200%200%2021%2012%22%20%2F%3E%3C%2Fsvg%3E",
  "ellipsis": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-ellipsis%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2219%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%225%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3C%2Fsvg%3E",
  "eye": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-eye%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M2.062%2012.348a1%201%200%200%201%200-.696%2010.75%2010.75%200%200%201%2019.876%200%201%201%200%200%201%200%20.696%2010.75%2010.75%200%200%201-19.876%200%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%20%2F%3E%3C%2Fsvg%3E",
  "eye-off": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-eye-off%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10.733%205.076a10.744%2010.744%200%200%201%2011.205%206.575%201%201%200%200%201%200%20.696%2010.747%2010.747%200%200%201-1.444%202.49%22%20%2F%3E%3Cpath%20d%3D%22M14.084%2014.158a3%203%200%200%201-4.242-4.242%22%20%2F%3E%3Cpath%20d%3D%22M17.479%2017.499a10.75%2010.75%200%200%201-15.417-5.151%201%201%200%200%201%200-.696%2010.75%2010.75%200%200%201%204.446-5.143%22%20%2F%3E%3Cpath%20d%3D%22m2%202%2020%2020%22%20%2F%3E%3C%2Fsvg%3E",
  "flag": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-flag%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4%2015s1-1%204-1%205%202%208%202%204-1%204-1V3s-1%201-4%201-5-2-8-2-4%201-4%201z%22%20%2F%3E%3Cline%20x1%3D%224%22%20x2%3D%224%22%20y1%3D%2222%22%20y2%3D%2215%22%20%2F%3E%3C%2Fsvg%3E",
  "gallery-horizontal": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-gallery-horizontal%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M2%203v18%22%20%2F%3E%3Crect%20width%3D%2212%22%20height%3D%2218%22%20x%3D%226%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M22%203v18%22%20%2F%3E%3C%2Fsvg%3E",
  "ghost": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-ghost%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9%2010h.01%22%20%2F%3E%3Cpath%20d%3D%22M15%2010h.01%22%20%2F%3E%3Cpath%20d%3D%22M12%202a8%208%200%200%200-8%208v12l3-3%202.5%202.5L12%2019l2.5%202.5L17%2019l3%203V10a8%208%200%200%200-8-8z%22%20%2F%3E%3C%2Fsvg%3E",
  "grab": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-grab%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M18%2011.5V9a2%202%200%200%200-2-2a2%202%200%200%200-2%202v1.4%22%20%2F%3E%3Cpath%20d%3D%22M14%2010V8a2%202%200%200%200-2-2a2%202%200%200%200-2%202v2%22%20%2F%3E%3Cpath%20d%3D%22M10%209.9V9a2%202%200%200%200-2-2a2%202%200%200%200-2%202v5%22%20%2F%3E%3Cpath%20d%3D%22M6%2014a2%202%200%200%200-2-2a2%202%200%200%200-2%202%22%20%2F%3E%3Cpath%20d%3D%22M18%2011a2%202%200%201%201%204%200v3a8%208%200%200%201-8%208h-4a8%208%200%200%201-8-8%202%202%200%201%201%204%200%22%20%2F%3E%3C%2Fsvg%3E",
  "grip-vertical": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-grip-vertical%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%229%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%225%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%2219%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%225%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2219%22%20r%3D%221%22%20%2F%3E%3C%2Fsvg%3E",
  "group": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-group%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%207V5c0-1.1.9-2%202-2h2%22%20%2F%3E%3Cpath%20d%3D%22M17%203h2c1.1%200%202%20.9%202%202v2%22%20%2F%3E%3Cpath%20d%3D%22M21%2017v2c0%201.1-.9%202-2%202h-2%22%20%2F%3E%3Cpath%20d%3D%22M7%2021H5c-1.1%200-2-.9-2-2v-2%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%225%22%20x%3D%227%22%20y%3D%227%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%225%22%20x%3D%2210%22%20y%3D%2212%22%20rx%3D%221%22%20%2F%3E%3C%2Fsvg%3E",
  "heading": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-heading%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M6%2012h12%22%20%2F%3E%3Cpath%20d%3D%22M6%2020V4%22%20%2F%3E%3Cpath%20d%3D%22M18%2020V4%22%20%2F%3E%3C%2Fsvg%3E",
  "heading-3": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-heading-3%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4%2012h8%22%20%2F%3E%3Cpath%20d%3D%22M4%2018V6%22%20%2F%3E%3Cpath%20d%3D%22M12%2018V6%22%20%2F%3E%3Cpath%20d%3D%22M17.5%2010.5c1.7-1%203.5%200%203.5%201.5a2%202%200%200%201-2%202%22%20%2F%3E%3Cpath%20d%3D%22M17%2017.5c2%201.5%204%20.3%204-1.5a2%202%200%200%200-2-2%22%20%2F%3E%3C%2Fsvg%3E",
  "history": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-history%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%201%200%209-9%209.75%209.75%200%200%200-6.74%202.74L3%208%22%20%2F%3E%3Cpath%20d%3D%22M3%203v5h5%22%20%2F%3E%3Cpath%20d%3D%22M12%207v5l4%202%22%20%2F%3E%3C%2Fsvg%3E",
  "image": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-image%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%229%22%20r%3D%222%22%20%2F%3E%3Cpath%20d%3D%22m21%2015-3.086-3.086a2%202%200%200%200-2.828%200L6%2021%22%20%2F%3E%3C%2Fsvg%3E",
  "image-plus": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-image-plus%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M16%205h6%22%20%2F%3E%3Cpath%20d%3D%22M19%202v6%22%20%2F%3E%3Cpath%20d%3D%22M21%2011.5V19a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h7.5%22%20%2F%3E%3Cpath%20d%3D%22m21%2015-3.086-3.086a2%202%200%200%200-2.828%200L6%2021%22%20%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%229%22%20r%3D%222%22%20%2F%3E%3C%2Fsvg%3E",
  "info": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-info%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpath%20d%3D%22M12%2016v-4%22%20%2F%3E%3Cpath%20d%3D%22M12%208h.01%22%20%2F%3E%3C%2Fsvg%3E",
  "italic": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-italic%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cline%20x1%3D%2219%22%20x2%3D%2210%22%20y1%3D%224%22%20y2%3D%224%22%20%2F%3E%3Cline%20x1%3D%2214%22%20x2%3D%225%22%20y1%3D%2220%22%20y2%3D%2220%22%20%2F%3E%3Cline%20x1%3D%2215%22%20x2%3D%229%22%20y1%3D%224%22%20y2%3D%2220%22%20%2F%3E%3C%2Fsvg%3E",
  "keyboard": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-keyboard%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10%208h.01%22%20%2F%3E%3Cpath%20d%3D%22M12%2012h.01%22%20%2F%3E%3Cpath%20d%3D%22M14%208h.01%22%20%2F%3E%3Cpath%20d%3D%22M16%2012h.01%22%20%2F%3E%3Cpath%20d%3D%22M18%208h.01%22%20%2F%3E%3Cpath%20d%3D%22M6%208h.01%22%20%2F%3E%3Cpath%20d%3D%22M7%2016h10%22%20%2F%3E%3Cpath%20d%3D%22M8%2012h.01%22%20%2F%3E%3Crect%20width%3D%2220%22%20height%3D%2216%22%20x%3D%222%22%20y%3D%224%22%20rx%3D%222%22%20%2F%3E%3C%2Fsvg%3E",
  "layers": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-layers%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m12.83%202.18a2%202%200%200%200-1.66%200L2.6%206.08a1%201%200%200%200%200%201.83l8.58%203.91a2%202%200%200%200%201.66%200l8.58-3.9a1%201%200%200%200%200-1.83Z%22%20%2F%3E%3Cpath%20d%3D%22m22%2017.65-9.17%204.16a2%202%200%200%201-1.66%200L2%2017.65%22%20%2F%3E%3Cpath%20d%3D%22m22%2012.65-9.17%204.16a2%202%200%200%201-1.66%200L2%2012.65%22%20%2F%3E%3C%2Fsvg%3E",
  "layout-grid": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-layout-grid%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%2214%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%2214%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%223%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3C%2Fsvg%3E",
  "layout-panel-top": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-layout-panel-top%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%227%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%223%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%2214%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3C%2Fsvg%3E",
  "layout-template": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-layout-template%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%227%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%229%22%20height%3D%227%22%20x%3D%223%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%225%22%20height%3D%227%22%20x%3D%2216%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3C%2Fsvg%3E",
  "library": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-library%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m16%206%204%2014%22%20%2F%3E%3Cpath%20d%3D%22M12%206v14%22%20%2F%3E%3Cpath%20d%3D%22M8%208v12%22%20%2F%3E%3Cpath%20d%3D%22M4%204v16%22%20%2F%3E%3C%2Fsvg%3E",
  "link": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-link%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10%2013a5%205%200%200%200%207.54.54l3-3a5%205%200%200%200-7.07-7.07l-1.72%201.71%22%20%2F%3E%3Cpath%20d%3D%22M14%2011a5%205%200%200%200-7.54-.54l-3%203a5%205%200%200%200%207.07%207.07l1.71-1.71%22%20%2F%3E%3C%2Fsvg%3E",
  "link-2": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-link-2%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9%2017H7A5%205%200%200%201%207%207h2%22%20%2F%3E%3Cpath%20d%3D%22M15%207h2a5%205%200%201%201%200%2010h-2%22%20%2F%3E%3Cline%20x1%3D%228%22%20x2%3D%2216%22%20y1%3D%2212%22%20y2%3D%2212%22%20%2F%3E%3C%2Fsvg%3E",
  "list": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-list%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012h.01%22%20%2F%3E%3Cpath%20d%3D%22M3%2018h.01%22%20%2F%3E%3Cpath%20d%3D%22M3%206h.01%22%20%2F%3E%3Cpath%20d%3D%22M8%2012h13%22%20%2F%3E%3Cpath%20d%3D%22M8%2018h13%22%20%2F%3E%3Cpath%20d%3D%22M8%206h13%22%20%2F%3E%3C%2Fsvg%3E",
  "list-collapse": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-list-collapse%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m3%2010%202.5-2.5L3%205%22%20%2F%3E%3Cpath%20d%3D%22m3%2019%202.5-2.5L3%2014%22%20%2F%3E%3Cpath%20d%3D%22M10%206h11%22%20%2F%3E%3Cpath%20d%3D%22M10%2012h11%22%20%2F%3E%3Cpath%20d%3D%22M10%2018h11%22%20%2F%3E%3C%2Fsvg%3E",
  "list-ordered": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-list-ordered%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10%2012h11%22%20%2F%3E%3Cpath%20d%3D%22M10%2018h11%22%20%2F%3E%3Cpath%20d%3D%22M10%206h11%22%20%2F%3E%3Cpath%20d%3D%22M4%2010h2%22%20%2F%3E%3Cpath%20d%3D%22M4%206h1v4%22%20%2F%3E%3Cpath%20d%3D%22M6%2018H4c0-1%202-2%202-3s-1-1.5-2-1%22%20%2F%3E%3C%2Fsvg%3E",
  "list-tree": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-list-tree%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2012h-8%22%20%2F%3E%3Cpath%20d%3D%22M21%206H8%22%20%2F%3E%3Cpath%20d%3D%22M21%2018h-8%22%20%2F%3E%3Cpath%20d%3D%22M3%206v4c0%201.1.9%202%202%202h3%22%20%2F%3E%3Cpath%20d%3D%22M3%2010v6c0%201.1.9%202%202%202h3%22%20%2F%3E%3C%2Fsvg%3E",
  "lock": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-lock%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2211%22%20x%3D%223%22%20y%3D%2211%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M7%2011V7a5%205%200%200%201%2010%200v4%22%20%2F%3E%3C%2Fsvg%3E",
  "maximize-2": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-maximize-2%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpolyline%20points%3D%2215%203%2021%203%2021%209%22%20%2F%3E%3Cpolyline%20points%3D%229%2021%203%2021%203%2015%22%20%2F%3E%3Cline%20x1%3D%2221%22%20x2%3D%2214%22%20y1%3D%223%22%20y2%3D%2210%22%20%2F%3E%3Cline%20x1%3D%223%22%20x2%3D%2210%22%20y1%3D%2221%22%20y2%3D%2214%22%20%2F%3E%3C%2Fsvg%3E",
  "menu": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-menu%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cline%20x1%3D%224%22%20x2%3D%2220%22%20y1%3D%2212%22%20y2%3D%2212%22%20%2F%3E%3Cline%20x1%3D%224%22%20x2%3D%2220%22%20y1%3D%226%22%20y2%3D%226%22%20%2F%3E%3Cline%20x1%3D%224%22%20x2%3D%2220%22%20y1%3D%2218%22%20y2%3D%2218%22%20%2F%3E%3C%2Fsvg%3E",
  "message-square-quote": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-message-square-quote%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2015a2%202%200%200%201-2%202H7l-4%204V5a2%202%200%200%201%202-2h14a2%202%200%200%201%202%202z%22%20%2F%3E%3Cpath%20d%3D%22M8%2012a2%202%200%200%200%202-2V8H8%22%20%2F%3E%3Cpath%20d%3D%22M14%2012a2%202%200%200%200%202-2V8h-2%22%20%2F%3E%3C%2Fsvg%3E",
  "minimize-2": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-minimize-2%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpolyline%20points%3D%224%2014%2010%2014%2010%2020%22%20%2F%3E%3Cpolyline%20points%3D%2220%2010%2014%2010%2014%204%22%20%2F%3E%3Cline%20x1%3D%2214%22%20x2%3D%2221%22%20y1%3D%2210%22%20y2%3D%223%22%20%2F%3E%3Cline%20x1%3D%223%22%20x2%3D%2210%22%20y1%3D%2221%22%20y2%3D%2214%22%20%2F%3E%3C%2Fsvg%3E",
  "minus": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-minus%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%2012h14%22%20%2F%3E%3C%2Fsvg%3E",
  "monitor": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-monitor%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2220%22%20height%3D%2214%22%20x%3D%222%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cline%20x1%3D%228%22%20x2%3D%2216%22%20y1%3D%2221%22%20y2%3D%2221%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%2217%22%20y2%3D%2221%22%20%2F%3E%3C%2Fsvg%3E",
  "moon": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-moon%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%203a6%206%200%200%200%209%209%209%209%200%201%201-9-9Z%22%20%2F%3E%3C%2Fsvg%3E",
  "move": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-move%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%202v20%22%20%2F%3E%3Cpath%20d%3D%22m15%2019-3%203-3-3%22%20%2F%3E%3Cpath%20d%3D%22m19%209%203%203-3%203%22%20%2F%3E%3Cpath%20d%3D%22M2%2012h20%22%20%2F%3E%3Cpath%20d%3D%22m5%209-3%203%203%203%22%20%2F%3E%3Cpath%20d%3D%22m9%205%203-3%203%203%22%20%2F%3E%3C%2Fsvg%3E",
  "move-vertical": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-move-vertical%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%202v20%22%20%2F%3E%3Cpath%20d%3D%22m8%2018%204%204%204-4%22%20%2F%3E%3Cpath%20d%3D%22m8%206%204-4%204%204%22%20%2F%3E%3C%2Fsvg%3E",
  "newspaper": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-newspaper%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4%2022h16a2%202%200%200%200%202-2V4a2%202%200%200%200-2-2H8a2%202%200%200%200-2%202v16a2%202%200%200%201-2%202Zm0%200a2%202%200%200%201-2-2v-9c0-1.1.9-2%202-2h2%22%20%2F%3E%3Cpath%20d%3D%22M18%2014h-8%22%20%2F%3E%3Cpath%20d%3D%22M15%2018h-5%22%20%2F%3E%3Cpath%20d%3D%22M10%206h8v4h-8V6Z%22%20%2F%3E%3C%2Fsvg%3E",
  "option": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-option%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%203h6l6%2018h6%22%20%2F%3E%3Cpath%20d%3D%22M14%203h7%22%20%2F%3E%3C%2Fsvg%3E",
  "palette": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-palette%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2213.5%22%20cy%3D%226.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%2217.5%22%20cy%3D%2210.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%228.5%22%20cy%3D%227.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%226.5%22%20cy%3D%2212.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Cpath%20d%3D%22M12%202C6.5%202%202%206.5%202%2012s4.5%2010%2010%2010c.926%200%201.648-.746%201.648-1.688%200-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64%201.64%200%200%201%201.668-1.668h1.996c3.051%200%205.555-2.503%205.555-5.554C21.965%206.012%2017.461%202%2012%202z%22%20%2F%3E%3C%2Fsvg%3E",
  "panel-top": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-panel-top%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M3%209h18%22%20%2F%3E%3C%2Fsvg%3E",
  "pilcrow": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-pilcrow%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M13%204v16%22%20%2F%3E%3Cpath%20d%3D%22M17%204v16%22%20%2F%3E%3Cpath%20d%3D%22M19%204H9.5a4.5%204.5%200%200%200%200%209H13%22%20%2F%3E%3C%2Fsvg%3E",
  "plus": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-plus%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%2012h14%22%20%2F%3E%3Cpath%20d%3D%22M12%205v14%22%20%2F%3E%3C%2Fsvg%3E",
  "pointer": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-pointer%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M22%2014a8%208%200%200%201-8%208%22%20%2F%3E%3Cpath%20d%3D%22M18%2011v-1a2%202%200%200%200-2-2a2%202%200%200%200-2%202%22%20%2F%3E%3Cpath%20d%3D%22M14%2010V9a2%202%200%200%200-2-2a2%202%200%200%200-2%202v1%22%20%2F%3E%3Cpath%20d%3D%22M10%209.5V4a2%202%200%200%200-2-2a2%202%200%200%200-2%202v10%22%20%2F%3E%3Cpath%20d%3D%22M18%2011a2%202%200%201%201%204%200v3a8%208%200%200%201-8%208h-2c-2.8%200-4.5-.86-5.99-2.34l-3.6-3.6a2%202%200%200%201%202.83-2.82L7%2015%22%20%2F%3E%3C%2Fsvg%3E",
  "power": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-power%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%202v10%22%20%2F%3E%3Cpath%20d%3D%22M18.4%206.6a9%209%200%201%201-12.77.04%22%20%2F%3E%3C%2Fsvg%3E",
  "power-off": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-power-off%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M18.36%206.64A9%209%200%200%201%2020.77%2015%22%20%2F%3E%3Cpath%20d%3D%22M6.16%206.16a9%209%200%201%200%2012.68%2012.68%22%20%2F%3E%3Cpath%20d%3D%22M12%202v4%22%20%2F%3E%3Cpath%20d%3D%22m2%202%2020%2020%22%20%2F%3E%3C%2Fsvg%3E",
  "quote": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-quote%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M16%203a2%202%200%200%200-2%202v6a2%202%200%200%200%202%202%201%201%200%200%201%201%201v1a2%202%200%200%201-2%202%201%201%200%200%200-1%201v2a1%201%200%200%200%201%201%206%206%200%200%200%206-6V5a2%202%200%200%200-2-2z%22%20%2F%3E%3Cpath%20d%3D%22M5%203a2%202%200%200%200-2%202v6a2%202%200%200%200%202%202%201%201%200%200%201%201%201v1a2%202%200%200%201-2%202%201%201%200%200%200-1%201v2a1%201%200%200%200%201%201%206%206%200%200%200%206-6V5a2%202%200%200%200-2-2z%22%20%2F%3E%3C%2Fsvg%3E",
  "radio": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-radio%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4.9%2019.1C1%2015.2%201%208.8%204.9%204.9%22%20%2F%3E%3Cpath%20d%3D%22M7.8%2016.2c-2.3-2.3-2.3-6.1%200-8.5%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M16.2%207.8c2.3%202.3%202.3%206.1%200%208.5%22%20%2F%3E%3Cpath%20d%3D%22M19.1%204.9C23%208.8%2023%2015.1%2019.1%2019%22%20%2F%3E%3C%2Fsvg%3E",
  "rectangle-horizontal": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-rectangle-horizontal%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2220%22%20height%3D%2212%22%20x%3D%222%22%20y%3D%226%22%20rx%3D%222%22%20%2F%3E%3C%2Fsvg%3E",
  "redo-2": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-redo-2%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m15%2014%205-5-5-5%22%20%2F%3E%3Cpath%20d%3D%22M20%209H9.5A5.5%205.5%200%200%200%204%2014.5A5.5%205.5%200%200%200%209.5%2020H13%22%20%2F%3E%3C%2Fsvg%3E",
  "refresh-cw": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-refresh-cw%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%200%201%209-9%209.75%209.75%200%200%201%206.74%202.74L21%208%22%20%2F%3E%3Cpath%20d%3D%22M21%203v5h-5%22%20%2F%3E%3Cpath%20d%3D%22M21%2012a9%209%200%200%201-9%209%209.75%209.75%200%200%201-6.74-2.74L3%2016%22%20%2F%3E%3Cpath%20d%3D%22M8%2016H3v5%22%20%2F%3E%3C%2Fsvg%3E",
  "rotate-ccw": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-rotate-ccw%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%201%200%209-9%209.75%209.75%200%200%200-6.74%202.74L3%208%22%20%2F%3E%3Cpath%20d%3D%22M3%203v5h5%22%20%2F%3E%3C%2Fsvg%3E",
  "search": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-search%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2211%22%20cy%3D%2211%22%20r%3D%228%22%20%2F%3E%3Cpath%20d%3D%22m21%2021-4.3-4.3%22%20%2F%3E%3C%2Fsvg%3E",
  "search-x": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-search-x%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m13.5%208.5-5%205%22%20%2F%3E%3Cpath%20d%3D%22m8.5%208.5%205%205%22%20%2F%3E%3Ccircle%20cx%3D%2211%22%20cy%3D%2211%22%20r%3D%228%22%20%2F%3E%3Cpath%20d%3D%22m21%2021-4.3-4.3%22%20%2F%3E%3C%2Fsvg%3E",
  "separator-horizontal": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-separator-horizontal%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cline%20x1%3D%223%22%20x2%3D%2221%22%20y1%3D%2212%22%20y2%3D%2212%22%20%2F%3E%3Cpolyline%20points%3D%228%208%2012%204%2016%208%22%20%2F%3E%3Cpolyline%20points%3D%2216%2016%2012%2020%208%2016%22%20%2F%3E%3C%2Fsvg%3E",
  "settings": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-settings%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.22%202h-.44a2%202%200%200%200-2%202v.18a2%202%200%200%201-1%201.73l-.43.25a2%202%200%200%201-2%200l-.15-.08a2%202%200%200%200-2.73.73l-.22.38a2%202%200%200%200%20.73%202.73l.15.1a2%202%200%200%201%201%201.72v.51a2%202%200%200%201-1%201.74l-.15.09a2%202%200%200%200-.73%202.73l.22.38a2%202%200%200%200%202.73.73l.15-.08a2%202%200%200%201%202%200l.43.25a2%202%200%200%201%201%201.73V20a2%202%200%200%200%202%202h.44a2%202%200%200%200%202-2v-.18a2%202%200%200%201%201-1.73l.43-.25a2%202%200%200%201%202%200l.15.08a2%202%200%200%200%202.73-.73l.22-.39a2%202%200%200%200-.73-2.73l-.15-.08a2%202%200%200%201-1-1.74v-.5a2%202%200%200%201%201-1.74l.15-.09a2%202%200%200%200%20.73-2.73l-.22-.38a2%202%200%200%200-2.73-.73l-.15.08a2%202%200%200%201-2%200l-.43-.25a2%202%200%200%201-1-1.73V4a2%202%200%200%200-2-2z%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%20%2F%3E%3C%2Fsvg%3E",
  "sheet": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-sheet%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cline%20x1%3D%223%22%20x2%3D%2221%22%20y1%3D%229%22%20y2%3D%229%22%20%2F%3E%3Cline%20x1%3D%223%22%20x2%3D%2221%22%20y1%3D%2215%22%20y2%3D%2215%22%20%2F%3E%3Cline%20x1%3D%229%22%20x2%3D%229%22%20y1%3D%229%22%20y2%3D%2221%22%20%2F%3E%3Cline%20x1%3D%2215%22%20x2%3D%2215%22%20y1%3D%229%22%20y2%3D%2221%22%20%2F%3E%3C%2Fsvg%3E",
  "smartphone": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-smartphone%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2214%22%20height%3D%2220%22%20x%3D%225%22%20y%3D%222%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M12%2018h.01%22%20%2F%3E%3C%2Fsvg%3E",
  "square": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-square%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3C%2Fsvg%3E",
  "square-dashed": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-square-dashed%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%203a2%202%200%200%200-2%202%22%20%2F%3E%3Cpath%20d%3D%22M19%203a2%202%200%200%201%202%202%22%20%2F%3E%3Cpath%20d%3D%22M21%2019a2%202%200%200%201-2%202%22%20%2F%3E%3Cpath%20d%3D%22M5%2021a2%202%200%200%201-2-2%22%20%2F%3E%3Cpath%20d%3D%22M9%203h1%22%20%2F%3E%3Cpath%20d%3D%22M9%2021h1%22%20%2F%3E%3Cpath%20d%3D%22M14%203h1%22%20%2F%3E%3Cpath%20d%3D%22M14%2021h1%22%20%2F%3E%3Cpath%20d%3D%22M3%209v1%22%20%2F%3E%3Cpath%20d%3D%22M21%209v1%22%20%2F%3E%3Cpath%20d%3D%22M3%2014v1%22%20%2F%3E%3Cpath%20d%3D%22M21%2014v1%22%20%2F%3E%3C%2Fsvg%3E",
  "square-dashed-bottom": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-square-dashed-bottom%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%2021a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h14a2%202%200%200%201%202%202v14a2%202%200%200%201-2%202%22%20%2F%3E%3Cpath%20d%3D%22M9%2021h1%22%20%2F%3E%3Cpath%20d%3D%22M14%2021h1%22%20%2F%3E%3C%2Fsvg%3E",
  "square-pen": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-square-pen%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%203H5a2%202%200%200%200-2%202v14a2%202%200%200%200%202%202h14a2%202%200%200%200%202-2v-7%22%20%2F%3E%3Cpath%20d%3D%22M18.375%202.625a1%201%200%200%201%203%203l-9.013%209.014a2%202%200%200%201-.853.505l-2.873.84a.5.5%200%200%201-.62-.62l.84-2.873a2%202%200%200%201%20.506-.852z%22%20%2F%3E%3C%2Fsvg%3E",
  "sun": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-sun%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%224%22%20%2F%3E%3Cpath%20d%3D%22M12%202v2%22%20%2F%3E%3Cpath%20d%3D%22M12%2020v2%22%20%2F%3E%3Cpath%20d%3D%22m4.93%204.93%201.41%201.41%22%20%2F%3E%3Cpath%20d%3D%22m17.66%2017.66%201.41%201.41%22%20%2F%3E%3Cpath%20d%3D%22M2%2012h2%22%20%2F%3E%3Cpath%20d%3D%22M20%2012h2%22%20%2F%3E%3Cpath%20d%3D%22m6.34%2017.66-1.41%201.41%22%20%2F%3E%3Cpath%20d%3D%22m19.07%204.93-1.41%201.41%22%20%2F%3E%3C%2Fsvg%3E",
  "sun-moon": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-sun-moon%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%208a2.83%202.83%200%200%200%204%204%204%204%200%201%201-4-4%22%20%2F%3E%3Cpath%20d%3D%22M12%202v2%22%20%2F%3E%3Cpath%20d%3D%22M12%2020v2%22%20%2F%3E%3Cpath%20d%3D%22m4.9%204.9%201.4%201.4%22%20%2F%3E%3Cpath%20d%3D%22m17.7%2017.7%201.4%201.4%22%20%2F%3E%3Cpath%20d%3D%22M2%2012h2%22%20%2F%3E%3Cpath%20d%3D%22M20%2012h2%22%20%2F%3E%3Cpath%20d%3D%22m6.3%2017.7-1.4%201.4%22%20%2F%3E%3Cpath%20d%3D%22m19.1%204.9-1.4%201.4%22%20%2F%3E%3C%2Fsvg%3E",
  "tablet": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-tablet%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2216%22%20height%3D%2220%22%20x%3D%224%22%20y%3D%222%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212.01%22%20y1%3D%2218%22%20y2%3D%2218%22%20%2F%3E%3C%2Fsvg%3E",
  "text": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-text%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M17%206.1H3%22%20%2F%3E%3Cpath%20d%3D%22M21%2012.1H3%22%20%2F%3E%3Cpath%20d%3D%22M15.1%2018H3%22%20%2F%3E%3C%2Fsvg%3E",
  "trash-2": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-trash-2%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%206h18%22%20%2F%3E%3Cpath%20d%3D%22M19%206v14c0%201-1%202-2%202H7c-1%200-2-1-2-2V6%22%20%2F%3E%3Cpath%20d%3D%22M8%206V4c0-1%201-2%202-2h4c1%200%202%201%202%202v2%22%20%2F%3E%3Cline%20x1%3D%2210%22%20x2%3D%2210%22%20y1%3D%2211%22%20y2%3D%2217%22%20%2F%3E%3Cline%20x1%3D%2214%22%20x2%3D%2214%22%20y1%3D%2211%22%20y2%3D%2217%22%20%2F%3E%3C%2Fsvg%3E",
  "triangle-alert": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-triangle-alert%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m21.73%2018-8-14a2%202%200%200%200-3.48%200l-8%2014A2%202%200%200%200%204%2021h16a2%202%200%200%200%201.73-3%22%20%2F%3E%3Cpath%20d%3D%22M12%209v4%22%20%2F%3E%3Cpath%20d%3D%22M12%2017h.01%22%20%2F%3E%3C%2Fsvg%3E",
  "type": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-type%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpolyline%20points%3D%224%207%204%204%2020%204%2020%207%22%20%2F%3E%3Cline%20x1%3D%229%22%20x2%3D%2215%22%20y1%3D%2220%22%20y2%3D%2220%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%224%22%20y2%3D%2220%22%20%2F%3E%3C%2Fsvg%3E",
  "undo-2": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-undo-2%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9%2014%204%209l5-5%22%20%2F%3E%3Cpath%20d%3D%22M4%209h10.5a5.5%205.5%200%200%201%205.5%205.5a5.5%205.5%200%200%201-5.5%205.5H11%22%20%2F%3E%3C%2Fsvg%3E",
  "unplug": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-unplug%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m19%205%203-3%22%20%2F%3E%3Cpath%20d%3D%22m2%2022%203-3%22%20%2F%3E%3Cpath%20d%3D%22M6.3%2020.3a2.4%202.4%200%200%200%203.4%200L12%2018l-6-6-2.3%202.3a2.4%202.4%200%200%200%200%203.4Z%22%20%2F%3E%3Cpath%20d%3D%22M7.5%2013.5%2010%2011%22%20%2F%3E%3Cpath%20d%3D%22M10.5%2016.5%2013%2014%22%20%2F%3E%3Cpath%20d%3D%22m12%206%206%206%202.3-2.3a2.4%202.4%200%200%200%200-3.4l-2.6-2.6a2.4%202.4%200%200%200-3.4%200Z%22%20%2F%3E%3C%2Fsvg%3E",
  "wrap-text": "data:image/svg+xml,%3Csvg%20class%3D%22lucide%20lucide-wrap-text%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%3Cline%20x1%3D%223%22%20x2%3D%2221%22%20y1%3D%226%22%20y2%3D%226%22%20%2F%3E%3Cpath%20d%3D%22M3%2012h15a3%203%200%201%201%200%206h-4%22%20%2F%3E%3Cpolyline%20points%3D%2216%2016%2014%2018%2016%2020%22%20%2F%3E%3Cline%20x1%3D%223%22%20x2%3D%2210%22%20y1%3D%2218%22%20y2%3D%2218%22%20%2F%3E%3C%2Fsvg%3E"
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/icons/lucide-subset.js", error: String((e && e.message) || e) }); }

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
  const local = typeof window !== 'undefined' && window.MOS_ICONS && window.MOS_ICONS[name];
  const url = 'url("' + (local || BASE + name + '.svg') + '")';
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
    className: "mos-count"
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
  inserts,
  image,
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
  }, image ? /*#__PURE__*/React.createElement("img", {
    className: "mos-pal__img",
    src: image,
    alt: "",
    width: "40",
    height: "28"
  }) : thumb || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
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
  }), "needs ", needs), inserts && /*#__PURE__*/React.createElement("span", {
    className: "mos-pal__needs"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "layers",
    size: 12
  }), "Inserts ", inserts, " components")));
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
  grabbedId,
  showRules = true
}) {
  const atFloor = min != null && items.length <= min;
  const atMax = max != null && items.length >= max;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mos-rep",
    role: "list"
  }, items.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mos-rep__empty"
  }, "No items yet."), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "mos-rep__row",
    role: "listitem",
    "aria-label": it.summary + ', ' + (i + 1) + ' of ' + items.length,
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
    label: atFloor ? 'Can’t remove — at least ' + min + ' required' : 'Remove ' + it.summary,
    disabled: atFloor,
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
    disabled: atMax
  }, addLabel), (min != null || max != null) && /*#__PURE__*/React.createElement("span", {
    className: "mos-rep__count"
  }, items.length, max != null ? '/' + max : '', min != null ? ' · min ' + min : ''))), showRules && min != null && items.length < min && /*#__PURE__*/React.createElement(__ds_scope.Banner, {
    tone: "attention",
    compact: true,
    title: 'Requires at least ' + min + ' item' + (min > 1 ? 's' : '') + ' — ' + items.length + '/' + min
  }), showRules && atFloor && items.length >= min && min > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mos-help",
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: 12
  }), "Remove is off: this area needs at least ", min, "."), showRules && atMax && /*#__PURE__*/React.createElement(__ds_scope.Banner, {
    tone: "info",
    compact: true,
    icon: "circle-slash",
    title: 'Maximum reached — ' + items.length + '/' + max
  }, "Remove an item to add another."));
}
Object.assign(__ds_scope, { Repeater });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/builder/Repeater.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Notice.jsx
try { (() => {
const KINDS = {
  removed: {
    tone: 'error',
    icon: 'triangle-alert',
    label: 'Removed'
  },
  type: {
    tone: 'attention',
    icon: 'flag',
    label: 'Type changed'
  },
  attention: {
    tone: 'attention',
    icon: 'circle-alert',
    label: 'Attention'
  },
  'legacy-binding': {
    tone: 'data',
    icon: 'history',
    label: 'Legacy binding — remove to edit'
  },
  'legacy-override': {
    tone: 'info',
    icon: 'history',
    label: 'Legacy override — remove to edit'
  }
};
function Notice({
  kind = 'attention',
  field,
  children,
  actionLabel = 'Remove',
  onAction
}) {
  const k = KINDS[kind] || KINDS.attention;
  return /*#__PURE__*/React.createElement(__ds_scope.Banner, {
    tone: k.tone,
    compact: true,
    icon: k.icon,
    title: /*#__PURE__*/React.createElement("span", null, k.label, field && /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 400,
        color: 'var(--mos-text-muted)'
      }
    }, " \xB7 ", field)),
    actions: onAction && /*#__PURE__*/React.createElement(__ds_scope.Button, {
      size: "sm",
      onClick: onAction
    }, actionLabel)
  }, children);
}
Object.assign(__ds_scope, { Notice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Notice.jsx", error: String((e && e.message) || e) }); }

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
    "aria-label": o.label ? undefined : o.title,
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
const ROOM = 46;
function SelectionFrame({
  label,
  index,
  mode = 'selected',
  toolbar,
  children,
  style,
  placement = 'auto'
}) {
  const ref = React.useRef(null);
  const [below, setBelow] = React.useState(placement === 'below');
  React.useLayoutEffect(() => {
    if (placement !== 'auto') {
      setBelow(placement === 'below');
      return;
    }
    const el = ref.current;
    if (!el) return;
    const root = el.closest('[data-mos-canvas]') || el.parentElement;
    const check = () => {
      const r = el.getBoundingClientRect(),
        R = root.getBoundingClientRect();
      const k = el.offsetWidth ? r.width / el.offsetWidth : 1;
      let flip = (r.top - R.top) / k < ROOM;
      const tb = {
        top: r.top - ROOM * k,
        bottom: r.top - 8 * k,
        left: r.right - 260 * k,
        right: r.right + 6 * k
      };
      root.querySelectorAll('.mos-marks__tab').forEach(t => {
        if (el.contains(t)) return;
        const q = t.getBoundingClientRect();
        if (q.left < tb.right && q.right > tb.left && q.top < tb.bottom && q.bottom > tb.top) flip = true;
      });
      setBelow(flip);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(root);
    return () => ro.disconnect();
  }, [placement]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: cx('mos-marks', below && 'mos-marks--flip', mode === 'keyboard' && 'mos-marks--keyboard', mode === 'lifted' && 'mos-marks--lifted'),
    style: style,
    "data-placement": below ? 'below' : 'above'
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
      blurb: 'Heading, text, 3 columns',
      inserts: 5
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
      blurb: 'Card row with 3 cards, one click',
      inserts: 4
    }, {
      name: 'Card + button',
      icon: 'layout-panel-top',
      blurb: 'One card with a footer button',
      inserts: 2
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

__ds_ns.Notice = __ds_scope.Notice;

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
