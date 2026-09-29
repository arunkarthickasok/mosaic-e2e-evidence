# Mosaic v3 — pixel-review renders

Deterministic full-page PNG captures of the v3 builder UI kit
(`ui_kits/builder/index.html`), taken with **headed Chromium** (Playwright, a
real browser — PROOF-CONDITIONS class), served from a local static server with
**self-hosted fonts and no network dependency for the kit's own assets**.
Device-scale factor 2 (retina), `prefers-reduced-motion` **off**.

- **Screen renders:** 200 PNGs — file name `screen__state__width__theme__density.png`.
- **Motion frames:** 15 PNGs — file name `motion-<name>__f<n>__<t>ms.png`.
- **Total: 215 PNGs.**

## Coverage

Every screen/state reachable from the kit navigation is captured at the base
axis (**1440 · light · comfortable**), then each state is also captured across
**834**, **390**, **dark** (1440 · comfortable) and **compact** (1440 · light) —
i.e. every axis at full breadth (5 variants per state), rather than the full
12-way cartesian product. `admin` theme = Claro throughout (the `keyboard`
"Claro · Gin · Custom" 3-up already shows all three admin themes in one frame).

## Screen renders

| # | PNG | Screen / state | Width | Theme | Density |
|---|-----|----------------|-------|-------|---------|
| 1 | `builder__default__1440__dark__comfortable.png` | Builder in the node form — default view | 1440 | dark | comfortable |
| 2 | `builder__default__1440__light__comfortable.png` | Builder in the node form — default view | 1440 | light | comfortable |
| 3 | `builder__default__1440__light__compact.png` | Builder in the node form — default view | 1440 | light | compact |
| 4 | `builder__default__834__light__comfortable.png` | Builder in the node form — default view | 834 | light | comfortable |
| 5 | `builder__default__390__light__comfortable.png` | Builder in the node form — default view | 390 | light | comfortable |
| 6 | `fe__default__1440__dark__comfortable.png` | Front-end edit dialog — default view | 1440 | dark | comfortable |
| 7 | `fe__default__1440__light__comfortable.png` | Front-end edit dialog — default view | 1440 | light | comfortable |
| 8 | `fe__default__1440__light__compact.png` | Front-end edit dialog — default view | 1440 | light | compact |
| 9 | `fe__default__834__light__comfortable.png` | Front-end edit dialog — default view | 834 | light | comfortable |
| 10 | `fe__default__390__light__comfortable.png` | Front-end edit dialog — default view | 390 | light | comfortable |
| 11 | `accordion__default__1440__dark__comfortable.png` | Accordion · repeater — default view | 1440 | dark | comfortable |
| 12 | `accordion__default__1440__light__comfortable.png` | Accordion · repeater — default view | 1440 | light | comfortable |
| 13 | `accordion__default__1440__light__compact.png` | Accordion · repeater — default view | 1440 | light | compact |
| 14 | `accordion__default__834__light__comfortable.png` | Accordion · repeater — default view | 834 | light | comfortable |
| 15 | `accordion__default__390__light__comfortable.png` | Accordion · repeater — default view | 390 | light | comfortable |
| 16 | `bound__empty__1440__dark__comfortable.png` | Columns bound to a View — Empty (data-state) | 1440 | dark | comfortable |
| 17 | `bound__empty__1440__light__comfortable.png` | Columns bound to a View — Empty (data-state) | 1440 | light | comfortable |
| 18 | `bound__empty__1440__light__compact.png` | Columns bound to a View — Empty (data-state) | 1440 | light | compact |
| 19 | `bound__empty__834__light__comfortable.png` | Columns bound to a View — Empty (data-state) | 834 | light | comfortable |
| 20 | `bound__empty__390__light__comfortable.png` | Columns bound to a View — Empty (data-state) | 390 | light | comfortable |
| 21 | `bound__fail__1440__dark__comfortable.png` | Columns bound to a View — Failing (data-state) | 1440 | dark | comfortable |
| 22 | `bound__fail__1440__light__comfortable.png` | Columns bound to a View — Failing (data-state) | 1440 | light | comfortable |
| 23 | `bound__fail__1440__light__compact.png` | Columns bound to a View — Failing (data-state) | 1440 | light | compact |
| 24 | `bound__fail__834__light__comfortable.png` | Columns bound to a View — Failing (data-state) | 834 | light | comfortable |
| 25 | `bound__fail__390__light__comfortable.png` | Columns bound to a View — Failing (data-state) | 390 | light | comfortable |
| 26 | `bound__pop__1440__dark__comfortable.png` | Columns bound to a View — Populated | 1440 | dark | comfortable |
| 27 | `bound__pop__1440__light__comfortable.png` | Columns bound to a View — Populated | 1440 | light | comfortable |
| 28 | `bound__pop__1440__light__compact.png` | Columns bound to a View — Populated | 1440 | light | compact |
| 29 | `bound__pop__834__light__comfortable.png` | Columns bound to a View — Populated | 834 | light | comfortable |
| 30 | `bound__pop__390__light__comfortable.png` | Columns bound to a View — Populated | 390 | light | comfortable |
| 31 | `palette__empty__1440__dark__comfortable.png` | Palette — No results | 1440 | dark | comfortable |
| 32 | `palette__empty__1440__light__comfortable.png` | Palette — No results | 1440 | light | comfortable |
| 33 | `palette__empty__1440__light__compact.png` | Palette — No results | 1440 | light | compact |
| 34 | `palette__empty__834__light__comfortable.png` | Palette — No results | 834 | light | comfortable |
| 35 | `palette__empty__390__light__comfortable.png` | Palette — No results | 390 | light | comfortable |
| 36 | `palette__full__1440__dark__comfortable.png` | Palette — All libraries | 1440 | dark | comfortable |
| 37 | `palette__full__1440__light__comfortable.png` | Palette — All libraries | 1440 | light | comfortable |
| 38 | `palette__full__1440__light__compact.png` | Palette — All libraries | 1440 | light | compact |
| 39 | `palette__full__834__light__comfortable.png` | Palette — All libraries | 834 | light | comfortable |
| 40 | `palette__full__390__light__comfortable.png` | Palette — All libraries | 390 | light | comfortable |
| 41 | `canvas__all__1440__dark__comfortable.png` | Canvas states — Zone · picker open · refused drop · toast | 1440 | dark | comfortable |
| 42 | `canvas__all__1440__light__comfortable.png` | Canvas states — Zone · picker open · refused drop · toast | 1440 | light | comfortable |
| 43 | `canvas__all__1440__light__compact.png` | Canvas states — Zone · picker open · refused drop · toast | 1440 | light | compact |
| 44 | `canvas__all__834__light__comfortable.png` | Canvas states — Zone · picker open · refused drop · toast | 834 | light | comfortable |
| 45 | `canvas__all__390__light__comfortable.png` | Canvas states — Zone · picker open · refused drop · toast | 390 | light | comfortable |
| 46 | `canvas__empty__1440__dark__comfortable.png` | Canvas states — Empty canvas · first-run cue | 1440 | dark | comfortable |
| 47 | `canvas__empty__1440__light__comfortable.png` | Canvas states — Empty canvas · first-run cue | 1440 | light | comfortable |
| 48 | `canvas__empty__1440__light__compact.png` | Canvas states — Empty canvas · first-run cue | 1440 | light | compact |
| 49 | `canvas__empty__834__light__comfortable.png` | Canvas states — Empty canvas · first-run cue | 834 | light | comfortable |
| 50 | `canvas__empty__390__light__comfortable.png` | Canvas states — Empty canvas · first-run cue | 390 | light | comfortable |
| 51 | `missing__builder__1440__dark__comfortable.png` | Library missing — Builder — values kept read-only | 1440 | dark | comfortable |
| 52 | `missing__builder__1440__light__comfortable.png` | Library missing — Builder — values kept read-only | 1440 | light | comfortable |
| 53 | `missing__builder__1440__light__compact.png` | Library missing — Builder — values kept read-only | 1440 | light | compact |
| 54 | `missing__builder__834__light__comfortable.png` | Library missing — Builder — values kept read-only | 834 | light | comfortable |
| 55 | `missing__builder__390__light__comfortable.png` | Library missing — Builder — values kept read-only | 390 | light | comfortable |
| 56 | `missing__editor__1440__dark__comfortable.png` | Library missing — Editor notice | 1440 | dark | comfortable |
| 57 | `missing__editor__1440__light__comfortable.png` | Library missing — Editor notice | 1440 | light | comfortable |
| 58 | `missing__editor__1440__light__compact.png` | Library missing — Editor notice | 1440 | light | compact |
| 59 | `missing__editor__834__light__comfortable.png` | Library missing — Editor notice | 834 | light | comfortable |
| 60 | `missing__editor__390__light__comfortable.png` | Library missing — Editor notice | 390 | light | comfortable |
| 61 | `missing__visitor__1440__dark__comfortable.png` | Library missing — Visitor view | 1440 | dark | comfortable |
| 62 | `missing__visitor__1440__light__comfortable.png` | Library missing — Visitor view | 1440 | light | comfortable |
| 63 | `missing__visitor__1440__light__compact.png` | Library missing — Visitor view | 1440 | light | compact |
| 64 | `missing__visitor__834__light__comfortable.png` | Library missing — Visitor view | 834 | light | comfortable |
| 65 | `missing__visitor__390__light__comfortable.png` | Library missing — Visitor view | 390 | light | comfortable |
| 66 | `errors__errors__1440__dark__comfortable.png` | Save errors · sync — Save error | 1440 | dark | comfortable |
| 67 | `errors__errors__1440__light__comfortable.png` | Save errors · sync — Save error | 1440 | light | comfortable |
| 68 | `errors__errors__1440__light__compact.png` | Save errors · sync — Save error | 1440 | light | compact |
| 69 | `errors__errors__834__light__comfortable.png` | Save errors · sync — Save error | 834 | light | comfortable |
| 70 | `errors__errors__390__light__comfortable.png` | Save errors · sync — Save error | 390 | light | comfortable |
| 71 | `errors__revert__1440__dark__comfortable.png` | Save errors · sync — Revert prompt | 1440 | dark | comfortable |
| 72 | `errors__revert__1440__light__comfortable.png` | Save errors · sync — Revert prompt | 1440 | light | comfortable |
| 73 | `errors__revert__1440__light__compact.png` | Save errors · sync — Revert prompt | 1440 | light | compact |
| 74 | `errors__revert__834__light__comfortable.png` | Save errors · sync — Revert prompt | 834 | light | comfortable |
| 75 | `errors__revert__390__light__comfortable.png` | Save errors · sync — Revert prompt | 390 | light | comfortable |
| 76 | `errors__synced__1440__dark__comfortable.png` | Save errors · sync — In sync | 1440 | dark | comfortable |
| 77 | `errors__synced__1440__light__comfortable.png` | Save errors · sync — In sync | 1440 | light | comfortable |
| 78 | `errors__synced__1440__light__compact.png` | Save errors · sync — In sync | 1440 | light | compact |
| 79 | `errors__synced__834__light__comfortable.png` | Save errors · sync — In sync | 834 | light | comfortable |
| 80 | `errors__synced__390__light__comfortable.png` | Save errors · sync — In sync | 390 | light | comfortable |
| 81 | `errors__unsaved__1440__dark__comfortable.png` | Save errors · sync — Unsaved | 1440 | dark | comfortable |
| 82 | `errors__unsaved__1440__light__comfortable.png` | Save errors · sync — Unsaved | 1440 | light | comfortable |
| 83 | `errors__unsaved__1440__light__compact.png` | Save errors · sync — Unsaved | 1440 | light | compact |
| 84 | `errors__unsaved__834__light__comfortable.png` | Save errors · sync — Unsaved | 834 | light | comfortable |
| 85 | `errors__unsaved__390__light__comfortable.png` | Save errors · sync — Unsaved | 390 | light | comfortable |
| 86 | `keyboard__keyboard__1440__dark__comfortable.png` | Keyboard move · admin themes — Keyboard move | 1440 | dark | comfortable |
| 87 | `keyboard__keyboard__1440__light__comfortable.png` | Keyboard move · admin themes — Keyboard move | 1440 | light | comfortable |
| 88 | `keyboard__keyboard__1440__light__compact.png` | Keyboard move · admin themes — Keyboard move | 1440 | light | compact |
| 89 | `keyboard__keyboard__834__light__comfortable.png` | Keyboard move · admin themes — Keyboard move | 834 | light | comfortable |
| 90 | `keyboard__keyboard__390__light__comfortable.png` | Keyboard move · admin themes — Keyboard move | 390 | light | comfortable |
| 91 | `keyboard__themes__1440__dark__comfortable.png` | Keyboard move · admin themes — Claro · Gin · Custom (3-up) | 1440 | dark | comfortable |
| 92 | `keyboard__themes__1440__light__comfortable.png` | Keyboard move · admin themes — Claro · Gin · Custom (3-up) | 1440 | light | comfortable |
| 93 | `keyboard__themes__1440__light__compact.png` | Keyboard move · admin themes — Claro · Gin · Custom (3-up) | 1440 | light | compact |
| 94 | `keyboard__themes__834__light__comfortable.png` | Keyboard move · admin themes — Claro · Gin · Custom (3-up) | 834 | light | comfortable |
| 95 | `keyboard__themes__390__light__comfortable.png` | Keyboard move · admin themes — Claro · Gin · Custom (3-up) | 390 | light | comfortable |
| 96 | `libraries__docs__1440__dark__comfortable.png` | Component libraries — Living docs open | 1440 | dark | comfortable |
| 97 | `libraries__docs__1440__light__comfortable.png` | Component libraries — Living docs open | 1440 | light | comfortable |
| 98 | `libraries__docs__1440__light__compact.png` | Component libraries — Living docs open | 1440 | light | compact |
| 99 | `libraries__docs__834__light__comfortable.png` | Component libraries — Living docs open | 834 | light | comfortable |
| 100 | `libraries__docs__390__light__comfortable.png` | Component libraries — Living docs open | 390 | light | comfortable |
| 101 | `libraries__empty__1440__dark__comfortable.png` | Component libraries — No libraries | 1440 | dark | comfortable |
| 102 | `libraries__empty__1440__light__comfortable.png` | Component libraries — No libraries | 1440 | light | comfortable |
| 103 | `libraries__empty__1440__light__compact.png` | Component libraries — No libraries | 1440 | light | compact |
| 104 | `libraries__empty__834__light__comfortable.png` | Component libraries — No libraries | 834 | light | comfortable |
| 105 | `libraries__empty__390__light__comfortable.png` | Component libraries — No libraries | 390 | light | comfortable |
| 106 | `libraries__full__1440__dark__comfortable.png` | Component libraries — Libraries list + detail | 1440 | dark | comfortable |
| 107 | `libraries__full__1440__light__comfortable.png` | Component libraries — Libraries list + detail | 1440 | light | comfortable |
| 108 | `libraries__full__1440__light__compact.png` | Component libraries — Libraries list + detail | 1440 | light | compact |
| 109 | `libraries__full__834__light__comfortable.png` | Component libraries — Libraries list + detail | 834 | light | comfortable |
| 110 | `libraries__full__390__light__comfortable.png` | Component libraries — Libraries list + detail | 390 | light | comfortable |
| 111 | `authoring__clean__1440__dark__comfortable.png` | Manage authoring — With overrides | 1440 | dark | comfortable |
| 112 | `authoring__clean__1440__light__comfortable.png` | Manage authoring — With overrides | 1440 | light | comfortable |
| 113 | `authoring__clean__1440__light__compact.png` | Manage authoring — With overrides | 1440 | light | compact |
| 114 | `authoring__clean__834__light__comfortable.png` | Manage authoring — With overrides | 834 | light | comfortable |
| 115 | `authoring__clean__390__light__comfortable.png` | Manage authoring — With overrides | 390 | light | comfortable |
| 116 | `authoring__error__1440__dark__comfortable.png` | Manage authoring — Schema error | 1440 | dark | comfortable |
| 117 | `authoring__error__1440__light__comfortable.png` | Manage authoring — Schema error | 1440 | light | comfortable |
| 118 | `authoring__error__1440__light__compact.png` | Manage authoring — Schema error | 1440 | light | compact |
| 119 | `authoring__error__834__light__comfortable.png` | Manage authoring — Schema error | 834 | light | comfortable |
| 120 | `authoring__error__390__light__comfortable.png` | Manage authoring — Schema error | 390 | light | comfortable |
| 121 | `fieldtypes__default__1440__dark__comfortable.png` | Field types — default view | 1440 | dark | comfortable |
| 122 | `fieldtypes__default__1440__light__comfortable.png` | Field types — default view | 1440 | light | comfortable |
| 123 | `fieldtypes__default__1440__light__compact.png` | Field types — default view | 1440 | light | compact |
| 124 | `fieldtypes__default__834__light__comfortable.png` | Field types — default view | 834 | light | comfortable |
| 125 | `fieldtypes__default__390__light__comfortable.png` | Field types — default view | 390 | light | comfortable |
| 126 | `changes__empty__1440__dark__comfortable.png` | Library changes — No changes | 1440 | dark | comfortable |
| 127 | `changes__empty__1440__light__comfortable.png` | Library changes — No changes | 1440 | light | comfortable |
| 128 | `changes__empty__1440__light__compact.png` | Library changes — No changes | 1440 | light | compact |
| 129 | `changes__empty__834__light__comfortable.png` | Library changes — No changes | 834 | light | comfortable |
| 130 | `changes__empty__390__light__comfortable.png` | Library changes — No changes | 390 | light | comfortable |
| 131 | `changes__report__1440__dark__comfortable.png` | Library changes — Change report | 1440 | dark | comfortable |
| 132 | `changes__report__1440__light__comfortable.png` | Library changes — Change report | 1440 | light | comfortable |
| 133 | `changes__report__1440__light__compact.png` | Library changes — Change report | 1440 | light | compact |
| 134 | `changes__report__834__light__comfortable.png` | Library changes — Change report | 834 | light | comfortable |
| 135 | `changes__report__390__light__comfortable.png` | Library changes — Change report | 390 | light | comfortable |
| 136 | `usage__gov__1440__dark__comfortable.png` | Usage · settings · governance — Governance · content type | 1440 | dark | comfortable |
| 137 | `usage__gov__1440__light__comfortable.png` | Usage · settings · governance — Governance · content type | 1440 | light | comfortable |
| 138 | `usage__gov__1440__light__compact.png` | Usage · settings · governance — Governance · content type | 1440 | light | compact |
| 139 | `usage__gov__834__light__comfortable.png` | Usage · settings · governance — Governance · content type | 834 | light | comfortable |
| 140 | `usage__gov__390__light__comfortable.png` | Usage · settings · governance — Governance · content type | 390 | light | comfortable |
| 141 | `usage__settings__1440__dark__comfortable.png` | Usage · settings · governance — Settings form | 1440 | dark | comfortable |
| 142 | `usage__settings__1440__light__comfortable.png` | Usage · settings · governance — Settings form | 1440 | light | comfortable |
| 143 | `usage__settings__1440__light__compact.png` | Usage · settings · governance — Settings form | 1440 | light | compact |
| 144 | `usage__settings__834__light__comfortable.png` | Usage · settings · governance — Settings form | 834 | light | comfortable |
| 145 | `usage__settings__390__light__comfortable.png` | Usage · settings · governance — Settings form | 390 | light | comfortable |
| 146 | `usage__usage__1440__dark__comfortable.png` | Usage · settings · governance — Layout usage | 1440 | dark | comfortable |
| 147 | `usage__usage__1440__light__comfortable.png` | Usage · settings · governance — Layout usage | 1440 | light | comfortable |
| 148 | `usage__usage__1440__light__compact.png` | Usage · settings · governance — Layout usage | 1440 | light | compact |
| 149 | `usage__usage__834__light__comfortable.png` | Usage · settings · governance — Layout usage | 834 | light | comfortable |
| 150 | `usage__usage__390__light__comfortable.png` | Usage · settings · governance — Layout usage | 390 | light | comfortable |
| 151 | `rail__f-confirm__1440__dark__comfortable.png` | Rail states — F · Replace? confirm | 1440 | dark | comfortable |
| 152 | `rail__f-confirm__1440__light__comfortable.png` | Rail states — F · Replace? confirm | 1440 | light | comfortable |
| 153 | `rail__f-confirm__1440__light__compact.png` | Rail states — F · Replace? confirm | 1440 | light | compact |
| 154 | `rail__f-confirm__834__light__comfortable.png` | Rail states — F · Replace? confirm | 834 | light | comfortable |
| 155 | `rail__f-confirm__390__light__comfortable.png` | Rail states — F · Replace? confirm | 390 | light | comfortable |
| 156 | `rail__f-empty__1440__dark__comfortable.png` | Rail states — F · HTML empty | 1440 | dark | comfortable |
| 157 | `rail__f-empty__1440__light__comfortable.png` | Rail states — F · HTML empty | 1440 | light | comfortable |
| 158 | `rail__f-empty__1440__light__compact.png` | Rail states — F · HTML empty | 1440 | light | compact |
| 159 | `rail__f-empty__834__light__comfortable.png` | Rail states — F · HTML empty | 834 | light | comfortable |
| 160 | `rail__f-empty__390__light__comfortable.png` | Rail states — F · HTML empty | 390 | light | comfortable |
| 161 | `rail__f-filled__1440__dark__comfortable.png` | Rail states — F · Filled by Image | 1440 | dark | comfortable |
| 162 | `rail__f-filled__1440__light__comfortable.png` | Rail states — F · Filled by Image | 1440 | light | comfortable |
| 163 | `rail__f-filled__1440__light__compact.png` | Rail states — F · Filled by Image | 1440 | light | compact |
| 164 | `rail__f-filled__834__light__comfortable.png` | Rail states — F · Filled by Image | 834 | light | comfortable |
| 165 | `rail__f-filled__390__light__comfortable.png` | Rail states — F · Filled by Image | 390 | light | comfortable |
| 166 | `rail__g-empty__1440__dark__comfortable.png` | Rail states — G · 0/1 | 1440 | dark | comfortable |
| 167 | `rail__g-empty__1440__light__comfortable.png` | Rail states — G · 0/1 | 1440 | light | comfortable |
| 168 | `rail__g-empty__1440__light__compact.png` | Rail states — G · 0/1 | 1440 | light | compact |
| 169 | `rail__g-empty__834__light__comfortable.png` | Rail states — G · 0/1 | 834 | light | comfortable |
| 170 | `rail__g-empty__390__light__comfortable.png` | Rail states — G · 0/1 | 390 | light | comfortable |
| 171 | `rail__g-floor__1440__dark__comfortable.png` | Rail states — G · At floor (Remove disabled) | 1440 | dark | comfortable |
| 172 | `rail__g-floor__1440__light__comfortable.png` | Rail states — G · At floor (Remove disabled) | 1440 | light | comfortable |
| 173 | `rail__g-floor__1440__light__compact.png` | Rail states — G · At floor (Remove disabled) | 1440 | light | compact |
| 174 | `rail__g-floor__834__light__comfortable.png` | Rail states — G · At floor (Remove disabled) | 834 | light | comfortable |
| 175 | `rail__g-floor__390__light__comfortable.png` | Rail states — G · At floor (Remove disabled) | 390 | light | comfortable |
| 176 | `rail__g-max__1440__dark__comfortable.png` | Rail states — G · Max reached | 1440 | dark | comfortable |
| 177 | `rail__g-max__1440__light__comfortable.png` | Rail states — G · Max reached | 1440 | light | comfortable |
| 178 | `rail__g-max__1440__light__compact.png` | Rail states — G · Max reached | 1440 | light | compact |
| 179 | `rail__g-max__834__light__comfortable.png` | Rail states — G · Max reached | 834 | light | comfortable |
| 180 | `rail__g-max__390__light__comfortable.png` | Rail states — G · Max reached | 390 | light | comfortable |
| 181 | `rail__h__1440__dark__comfortable.png` | Rail states — H · Notices | 1440 | dark | comfortable |
| 182 | `rail__h__1440__light__comfortable.png` | Rail states — H · Notices | 1440 | light | comfortable |
| 183 | `rail__h__1440__light__compact.png` | Rail states — H · Notices | 1440 | light | compact |
| 184 | `rail__h__834__light__comfortable.png` | Rail states — H · Notices | 834 | light | comfortable |
| 185 | `rail__h__390__light__comfortable.png` | Rail states — H · Notices | 390 | light | comfortable |
| 186 | `rail__i__1440__dark__comfortable.png` | Rail states — I · Style · Visibility | 1440 | dark | comfortable |
| 187 | `rail__i__1440__light__comfortable.png` | Rail states — I · Style · Visibility | 1440 | light | comfortable |
| 188 | `rail__i__1440__light__compact.png` | Rail states — I · Style · Visibility | 1440 | light | compact |
| 189 | `rail__i__834__light__comfortable.png` | Rail states — I · Style · Visibility | 834 | light | comfortable |
| 190 | `rail__i__390__light__comfortable.png` | Rail states — I · Style · Visibility | 390 | light | comfortable |
| 191 | `rail__j__1440__dark__comfortable.png` | Rail states — J · Palette cards | 1440 | dark | comfortable |
| 192 | `rail__j__1440__light__comfortable.png` | Rail states — J · Palette cards | 1440 | light | comfortable |
| 193 | `rail__j__1440__light__compact.png` | Rail states — J · Palette cards | 1440 | light | compact |
| 194 | `rail__j__834__light__comfortable.png` | Rail states — J · Palette cards | 834 | light | comfortable |
| 195 | `rail__j__390__light__comfortable.png` | Rail states — J · Palette cards | 390 | light | comfortable |
| 196 | `rail__k__1440__dark__comfortable.png` | Rail states — K · Save errors | 1440 | dark | comfortable |
| 197 | `rail__k__1440__light__comfortable.png` | Rail states — K · Save errors | 1440 | light | comfortable |
| 198 | `rail__k__1440__light__compact.png` | Rail states — K · Save errors | 1440 | light | compact |
| 199 | `rail__k__834__light__comfortable.png` | Rail states — K · Save errors | 834 | light | comfortable |
| 200 | `rail__k__390__light__comfortable.png` | Rail states — K · Save errors | 390 | light | comfortable |

## Motion key frames (`motion.html`)

Frozen via the Web Animations API and seeked to fixed times, so each frame is deterministic.

| # | PNG | Motion | Frame |
|---|-----|--------|-------|
| 1 | `motion-lift__f1__300ms.png` | Drag lift (scale 1.02 + lift-shadow) | f1 @ 300ms (rest, pre-lift) |
| 2 | `motion-lift__f2__900ms.png` | Drag lift (scale 1.02 + lift-shadow) | f2 @ 900ms (peak lift) |
| 3 | `motion-lift__f3__2100ms.png` | Drag lift (scale 1.02 + lift-shadow) | f3 @ 2100ms (settled back to rest) |
| 4 | `motion-refuse-snapback__f1__400ms.png` | Refused drop — red zone + reason, snap-back to origin | f1 @ 400ms (at origin) |
| 5 | `motion-refuse-snapback__f2__1100ms.png` | Refused drop — red zone + reason, snap-back to origin | f2 @ 1100ms (pushed into red Footer + tip) |
| 6 | `motion-refuse-snapback__f3__2000ms.png` | Refused drop — red zone + reason, snap-back to origin | f3 @ 2000ms (snapped back to origin) |
| 7 | `motion-insert__f1__300ms.png` | Insert — height opens, item fades in | f1 @ 300ms (collapsed) |
| 8 | `motion-insert__f2__700ms.png` | Insert — height opens, item fades in | f2 @ 700ms (opening) |
| 9 | `motion-insert__f3__1400ms.png` | Insert — height opens, item fades in | f3 @ 1400ms (inserted) |
| 10 | `motion-shimmer__f1__200ms.png` | Stale shimmer — teal sweep while server renders | f1 @ 200ms (sweep left) |
| 11 | `motion-shimmer__f2__700ms.png` | Stale shimmer — teal sweep while server renders | f2 @ 700ms (sweep centre) |
| 12 | `motion-shimmer__f3__1200ms.png` | Stale shimmer — teal sweep while server renders | f3 @ 1200ms (sweep right) |
| 13 | `motion-crossfade__f1__500ms.png` | Refresh crossfade — opacity .55 → 1 | f1 @ 500ms (dim .55) |
| 14 | `motion-crossfade__f2__1100ms.png` | Refresh crossfade — opacity .55 → 1 | f2 @ 1100ms (mid) |
| 15 | `motion-crossfade__f3__1600ms.png` | Refresh crossfade — opacity .55 → 1 | f3 @ 1600ms (full render) |

> Note: for `lift` and `refuse-snapback`, frame 1 and frame 3 show the same rest/origin state — that is the choreography (lift then settle back; push into the refused zone then snap back), not a duplicate capture.
