# CP-ADOPT-5 P1d-B — CKE5 Widget Sheet (report-only)

Every owned text-like prop, its current classification, and a widget
recommendation. **REPORT ONLY — no code change in ship #45.** Arun rules per
line; ratified changes ship in a LATER rider (schema `enum` declarations,
`field_types` richtext sidecars, CKE5 expand-modal wiring), NOT here.

Legend — recommendation: `formatted_text → CKE5` (rich body via the CKE5 expand
modal) · `text → single-line` (short scalar, plain input) · `select (enum)` (a
fixed value set currently mis-typed as free text — declaring `enum` also tightens
the P1d-B capability gate).

| component | prop | today's kind/widget | sidecar field_types | recommendation | reason |
|---|---|---|---|---|---|
| `mosaic_button` [Button] | `label` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_button` [Button] | `url` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_button` [Button] | `variant` | text / plain single-line | (none) | **select (enum)** | a fixed value set mis-typed as free text; declare enum → becomes a select (also fixes the Data/Breakpoint capability gate) |
| `mosaic_button` [Button] | `size` | text / plain single-line | (none) | **select (enum)** | a fixed value set mis-typed as free text; declare enum → becomes a select (also fixes the Data/Breakpoint capability gate) |
| `mosaic_button` [Button] | `target` | text / plain single-line | (none) | **select (enum)** | a fixed value set mis-typed as free text; declare enum → becomes a select (also fixes the Data/Breakpoint capability gate) |
| `mosaic_card` [Card] | `title` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_card` [Card] | `description` | text / plain single-line | (none) | **formatted_text → CKE5** | long-form copy; authors expect formatting (bold/links/lists) |
| `mosaic_card` [Card] | `image_url` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_card` [Card] | `image_alt` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_card` [Card] | `link_url` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_card` [Card] | `link_text` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_carousel` [Carousel] | `image_style` | text / plain single-line | (none) | **select (enum)** | a fixed value set mis-typed as free text; declare enum → becomes a select (also fixes the Data/Breakpoint capability gate) |
| `mosaic_divider` [Divider] | `style` | text / plain single-line | (none) | **select (enum)** | a fixed value set mis-typed as free text; declare enum → becomes a select (also fixes the Data/Breakpoint capability gate) |
| `mosaic_divider` [Divider] | `spacing` | text / plain single-line | (none) | **select (enum)** | a fixed value set mis-typed as free text; declare enum → becomes a select (also fixes the Data/Breakpoint capability gate) |
| `mosaic_heading` [Heading] | `text` | text / plain single-line | (none) | **formatted_text → CKE5** | long-form copy; authors expect formatting (bold/links/lists) |
| `mosaic_html` [HTML] | `content` | text / plain single-line | (none) | **formatted_text → CKE5** | long-form copy; authors expect formatting (bold/links/lists) |
| `mosaic_image` [Image] | `src` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_image` [Image] | `alt` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_image` [Image] | `width` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_image` [Image] | `height` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_image` [Image] | `loading` | text / plain single-line | (none) | **select (enum)** | a fixed value set mis-typed as free text; declare enum → becomes a select (also fixes the Data/Breakpoint capability gate) |
| `mosaic_image` [Image] | `caption` | text / plain single-line | (none) | **formatted_text → CKE5** | long-form copy; authors expect formatting (bold/links/lists) |
| `mosaic_live_search` [Live Search] | `endpoint` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_live_search` [Live Search] | `placeholder` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_plain_content` [Plain content] | `body` | text / plain single-line | (none) | **formatted_text → CKE5** | long-form copy; authors expect formatting (bold/links/lists) |
| `mosaic_text` [Text] | `body` | text / plain single-line | (none) | **formatted_text → CKE5** | long-form copy; authors expect formatting (bold/links/lists) |
| `mosaic_text` [Text] | `text_format` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `mosaic_text` [Text] | `alignment` | text / plain single-line | (none) | **select (enum)** | a fixed value set mis-typed as free text; declare enum → becomes a select (also fixes the Data/Breakpoint capability gate) |
| `webform_embed` [Webform] | `webform_id` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |
| `webform_embed` [Webform] | `title` | text / plain single-line | (none) | **text → single-line** | a short scalar (id/url/number-ish/label); a single-line input is correct |

Total text-like owned props reviewed: 30.
