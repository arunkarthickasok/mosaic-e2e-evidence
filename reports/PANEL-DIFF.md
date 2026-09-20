# CP-ADOPT-5 P1d-B — Owned Panel Capability Diff (PANEL-DIFF)

The FIRST visible change to owned panels. Rule (identical to adopted, the
`!isAdopted` escape hatch retired): **Data** section only when the component has
a bindable-kind prop (P0 table: text/formatted_text/link/number/media/entity_ref);
**Breakpoint** only when a breakpointable-kind prop (text/select/toggle/number);
**Style/Spacing/Visibility** always kept (component-level, top context). Page render
unchanged (panel-only) — both byte-identical shasums hold. Legacy bindings
grandfathered (R10): they persist + render regardless, and show read-only in the
Data section of any component that still has a bindable prop.

## CHANGED (3 components)

| component | before | after | removed | reason |
|---|---|---|---|---|
| `mosaic_spacer` [Spacer] | Data + Breakpoint + Style + Spacing + Visibility | Breakpoint + Style + Spacing + Visibility | **Data** | no bindable prop → no Data (props: size (select)) |
| `mosaic_tabs` [Tabs] | Data + Breakpoint + Style + Spacing + Visibility | Style + Spacing + Visibility | **Data, Breakpoint** | no bindable prop → no Data ; no breakpointable prop → no Breakpoint (props: sets (repeatable)) |
| `mosaic_view` [View] | Data + Breakpoint + Style + Spacing + Visibility | Breakpoint + Style + Spacing + Visibility | **Data** | no bindable prop → no Data (props: view_display (raw); arguments (repeatable); argument_sources (repeatable); hide_when_empty (toggle)) |

## UNCHANGED (12 components — keep Data + Breakpoint)

Each has ≥1 bindable + ≥1 breakpointable prop, so both sections stay. Per-PROP
binding is still gated: a non-bindable prop (e.g. `mosaic_card.variant` = select)
is NOT offered a binding inside the Data section (nonBindableProps), even though the
component keeps the Data section for its bindable props.

| component | props (kind · bindable · breakpointable) |
|---|---|
| `mosaic_button` [Button] | label=text·bY·bpY; url=text·bY·bpY; variant=text·bY·bpY; size=text·bY·bpY; target=text·bY·bpY |
| `mosaic_card` [Card] | title=text·bY·bpY; description=text·bY·bpY; image_url=text·bY·bpY; image_alt=text·bY·bpY; link_url=text·bY·bpY; link_text=text·bY·bpY; variant=select·bn·bpY |
| `mosaic_carousel` [Carousel] | auto_advance=toggle·bn·bpY; interval=number·bY·bpY; loop=toggle·bn·bpY; aspect_ratio=select·bn·bpY; image_style=text·bY·bpY; slides=repeatable·bn·bpn |
| `mosaic_columns` [Columns] | columns=number·bY·bpY; gap=select·bn·bpY |
| `mosaic_divider` [Divider] | style=text·bY·bpY; spacing=text·bY·bpY |
| `mosaic_heading` [Heading] | text=text·bY·bpY; level=select·bn·bpY; alignment=select·bn·bpY |
| `mosaic_html` [HTML] | content=text·bY·bpY |
| `mosaic_image` [Image] | src=text·bY·bpY; alt=text·bY·bpY; width=text·bY·bpY; height=text·bY·bpY; loading=text·bY·bpY; caption=text·bY·bpY |
| `mosaic_live_search` [Live Search] | endpoint=text·bY·bpY; placeholder=text·bY·bpY; min_chars=number·bY·bpY |
| `mosaic_plain_content` [Plain content] | body=text·bY·bpY; text_format=select·bn·bpY |
| `mosaic_text` [Text] | body=text·bY·bpY; text_format=text·bY·bpY; alignment=text·bY·bpY |
| `webform_embed` [Webform] | webform_id=text·bY·bpY; title=text·bY·bpY; open=toggle·bn·bpY |

## Note on classification
Several enum-like props (e.g. `mosaic_button.variant/size/target`,
`mosaic_divider.style/spacing`) are classified `text` (bindable) because their
component.yml does not declare `enum` — a data-modelling gap in those components, not
a gating decision. This diff applies the capability rules to the kinds AS CLASSIFIED;
tightening those schemas is a separate rider.
