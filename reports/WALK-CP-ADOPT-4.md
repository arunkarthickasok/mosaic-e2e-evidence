# WALK — CP-ADOPT-4 / 4R: the first outside component becomes usable end-to-end

**The story.** You want to place a component Mosaic never wrote — Olivero's `teaser`, a
theme-provided SDC — on a page, fill it with your own content, and publish it. This walk is
you doing exactly that, from an empty page, and seeing it work: the teaser renders with
Olivero's own markup, its slots accept your content by drag-and-drop, an empty required slot
is refused rather than shipped broken, and the saved page matches.

You create everything here yourself — there are no pre-seeded nodes. Each step is an action
you perform.

Prereq: admin on the dev site.

> **Drop-proof note.** Every "drop lands" step below is backed by a real-input (CDP)
> `Input.dispatchMouseEvent` drag that was filmed committing the child AND persisting it to
> the saved layout (`reports/REPORT-CP-ADOPT-4R-P2.md`, `ledger-live/e2e-evidence/cp-adopt-4r/
> WC69-CDP-PROOF.json`). Per the DROP-PROOF LAW these steps are **PROVEN**, not asserted.

---

### 1. Enable the Olivero library

Go to the Mosaic **Component Libraries** page. Olivero is theme-bound and OFF by default;
switch it ON. Its components appear in the palette — `Teaser` among them, graded *Attention*
(0 props, 5 slots). *(Adopted libraries default OFF; turning Olivero on opts its SDCs into
the palette.)*

### 2. Create a page and place the teaser

Create a new page. Open the Mosaic builder. From the palette, drag **Teaser** onto the
canvas. It renders with Olivero's OWN markup + CSS — an `article.teaser` — not a Mosaic
scaffold. Its five slots (Prefix, Meta, Image, Title, Content) show as labelled, outlined
drop zones, each bound to its own slot.

### 3. The panel tells you it is built from its slots

Select the teaser. Because it has no editable props (its only SDC prop, `attributes`, is
Mosaic-managed), the property panel shows an empty-state: **"No fields — this component is
built from its slots"**, then the slot list with **Content (required)** marked. You know to
fill the slots on the canvas. *(WC#68.)*

### 4. Fill a slot — the drop lands (PROVEN)

Drag a **Heading** from the palette into the teaser's **Content** zone. The heading lands
INSIDE the teaser's own content slot and the saved layout records it
(`nodes[teaser].slots.content = [your heading]`). Drag a **Divider** into the **Image** zone
— it lands there too. *(WC#69 — the whole point: an outside component's slots are authorable
by real drag. PROVEN via CDP: before/after DOM + saved slot filmed.)*

### 5. No false "unsaved" prompt

Open the teaser's page fresh and immediately click **View** without touching anything. There
is NO "Leave site?" prompt — a pristine adopted component is not falsely dirty. *(WC#66.)*

### 6. An empty required slot is refused, never shipped broken

Try to save the teaser with its required **Content** slot empty. The save is refused with a
message naming the component + slot: *"the 'olivero:teaser' component requires content in its
'content' slot."* And should such an instance ever reach the front end, it renders NOTHING
(logged) — never Olivero's empty styled shells + a broken image. *(WC#70 a + b — Arun's node
989 shape.)*

### 7. Publish — the page matches

Fill the content, save, and view the page. The teaser renders with Olivero's full markup +
CSS and your content in its slots. The owned components on the page render byte-identically
(node/780 region `14e6cb9c…`, unchanged).

---

**What proves it:** the drop steps are CDP-filmed (child committed + persisted); WC#66/#68 are
witnessed on the live builder; WC#70 is Kernel-proven (`RequiredSlotTest` 4/4) + the render
guard keeps the front end clean. Full gates green, byte-identical held. Ship #44 is ready for
your walk.
