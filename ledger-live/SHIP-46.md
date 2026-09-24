# SHIP #46 — CP-ADOPT-6: pages survive library changes and removals

**Commit:** `a36f028` (Arun committed after his walk PASSED) · **files:** 63 (33 M + 30 new)
· **libs:** 1.0.63 · **tally:** 94 · **branch tree clean == origin.**

## What shipped (the CP-ADOPT-6 arc + all riders, P1–P7)
The whole "adopt any SDC with graceful degradation" arc, landed across passes and committed as
one ship:

- **Pillar H — graceful degradation.** When a library goes away, its pages don't break: a bounded
  fallback renders the component's slots in **template render order** (static + View-bound slots),
  with a **permission-gated editor notice** (visible to editors, visually-hidden to anonymous). The
  builder shows a **"Library missing" card** that keeps the stored values AND bindings
  ("{Slot} — bound to {View}"); a no-change save never strips the binding. An
  **affected-pages report** lists every page using the unavailable component.
- **Pillar G — library updates + drift.** A behaviour-keys **schema signature** per component; four
  **drift classes** (removed / type-changed / now-required / added) surfaced as author notices +
  a **Schema-changes report**.
- **R5/R9/R10 — SSR attachments.** `renderSingleComponent` harvests real BubbleableMetadata; the
  canvas loads each library once and runs `Drupal.attachBehaviors` (attach-once, no tag accretion).
- **SO-7 — global-styles flag.** A heuristic scanner flags adopted CSS whose unlayered element
  selectors would restyle the whole page.
- **SO-2 — per-zone picker.** Real mouse + full keyboard; Plain content first then every authorable
  component; the list is portaled + anchored, **fits any window** (flip + 60vh scroll), closes on
  Esc / outside-click, insert lands via the shared setData path, canvas geometry stays stable. **One
  slot-only placement rule** shared by the picker catalog and the server validator (lone-root pages
  included); the dormant `slot_only` sidecar was fixed.
- **Cache-tag unification.** One library cache tag everywhere (latent list-tag bug fixed) — toggling
  a library clears page + manifest + report together.

## Walk-catches closed on the road to ship (WC#83–#93)
WC#83 missing-card bindings · WC#84 picker "+" click · WC#85 fallback order · WC#86 real-click
(document-capture) · WC#87 picker catalog · WC#88 insert lands · WC#89 template slot order ·
WC#90 list above overlay · WC#91 no canvas shift · WC#92 slot-only save (lone-root cause; one
shared rule; author-grade message) · WC#93 picker list fits any window + Esc. All fixed + proven
(headed films + Kernel/Vitest cells) before the ship.

## Gates at ship
Kernel+Unit **3057 / 0** · Vitest **647 / 1** (B-101 boolean→checkbox, pre-existing) · tsc + phpcs
+ phpstan clean · oracles **REGION 14e6cb9c…3954** + **STYLE b7756795…ca982 4354 10** byte-identical
· dist **1.0.63**, served==built.

## Debt carried past the ship
- **WC#86** — the picker click fix is a document-capture-listener workaround → 1.1 Puck-extension review.
- **B-101** — Vitest boolean→checkbox drift (one cell). **B-102** — module-wide phpstan-drift.

**Ship #46 is the CP-ADOPT-6 milestone. Next: WC#94 (post-ship walk-catch) + the CP-ADOPT-7 arc
(the external library readiness probe).**
