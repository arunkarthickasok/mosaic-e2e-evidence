# Contrast audit — Mosaic v4

Re-run 2026-09-29 (v4: no colour tokens changed; strip-label tooltip and relocated index tab added) against `tokens/colors.css`, light and dark, after the 12px type floor. WCAG 2.2: 4.5:1 for all text (1.4.3). With the floor at 12px nothing qualifies as large text, so no pair uses the 3:1 text allowance. 3:1 for UI boundaries and focus indicators (1.4.11).

**156 pairs · 0 failures.**

Added since v2 (122 pairs): banner title and body text on every semantic background (notices), field error text on inputs, the override indicator, and the first-run cue ring.

| Mode | Foreground | Background | Ratio | Min | Use | Result |
|---|---|---|---|---|---|---|
| light | --mos-text-strong | --mos-surface-chrome | 17.30 | 4.5 | text (12px floor) | pass |
| light | --mos-text-strong | --mos-surface-canvas | 16.13 | 4.5 | text (12px floor) | pass |
| light | --mos-text-strong | --mos-surface-sunken | 15.14 | 4.5 | text (12px floor) | pass |
| light | --mos-text-strong | --mos-surface-raised | 17.30 | 4.5 | text (12px floor) | pass |
| light | --mos-text-strong | --mos-surface-hover | 16.13 | 4.5 | text (12px floor) | pass |
| light | --mos-text-strong | --mos-surface-selected | 15.76 | 4.5 | text (12px floor) | pass |
| light | --mos-text-default | --mos-surface-chrome | 13.32 | 4.5 | text (12px floor) | pass |
| light | --mos-text-default | --mos-surface-canvas | 12.42 | 4.5 | text (12px floor) | pass |
| light | --mos-text-default | --mos-surface-sunken | 11.66 | 4.5 | text (12px floor) | pass |
| light | --mos-text-default | --mos-surface-raised | 13.32 | 4.5 | text (12px floor) | pass |
| light | --mos-text-default | --mos-surface-hover | 12.42 | 4.5 | text (12px floor) | pass |
| light | --mos-text-default | --mos-surface-selected | 12.14 | 4.5 | text (12px floor) | pass |
| light | --mos-text-muted | --mos-surface-chrome | 6.00 | 4.5 | text (12px floor) | pass |
| light | --mos-text-muted | --mos-surface-canvas | 5.60 | 4.5 | text (12px floor) | pass |
| light | --mos-text-muted | --mos-surface-sunken | 5.25 | 4.5 | text (12px floor) | pass |
| light | --mos-text-muted | --mos-surface-raised | 6.00 | 4.5 | text (12px floor) | pass |
| light | --mos-text-muted | --mos-surface-hover | 5.60 | 4.5 | text (12px floor) | pass |
| light | --mos-text-muted | --mos-surface-selected | 5.47 | 4.5 | text (12px floor) | pass |
| light | --mos-text-faint | --mos-surface-chrome | 5.32 | 4.5 | text (12px floor) | pass |
| light | --mos-text-faint | --mos-surface-canvas | 4.96 | 4.5 | text (12px floor) | pass |
| light | --mos-text-faint | --mos-surface-sunken | 4.66 | 4.5 | text (12px floor) | pass |
| light | --mos-text-faint | --mos-surface-raised | 5.32 | 4.5 | text (12px floor) | pass |
| light | --mos-text-faint | --mos-surface-hover | 4.96 | 4.5 | text (12px floor) | pass |
| light | --mos-text-faint | --mos-surface-selected | 4.85 | 4.5 | text (12px floor) | pass |
| light | --mos-text-link | --mos-surface-chrome | 8.03 | 4.5 | text (12px floor) | pass |
| light | --mos-text-link | --mos-surface-canvas | 7.49 | 4.5 | text (12px floor) | pass |
| light | --mos-text-link | --mos-surface-sunken | 7.03 | 4.5 | text (12px floor) | pass |
| light | --mos-text-link | --mos-surface-raised | 8.03 | 4.5 | text (12px floor) | pass |
| light | --mos-text-link | --mos-surface-hover | 7.49 | 4.5 | text (12px floor) | pass |
| light | --mos-text-link | --mos-surface-selected | 7.32 | 4.5 | text (12px floor) | pass |
| light | --mos-accent | --mos-surface-chrome | 6.07 | 4.5 | text (12px floor) | pass |
| light | --mos-accent | --mos-surface-canvas | 5.66 | 4.5 | text (12px floor) | pass |
| light | --mos-accent | --mos-surface-sunken | 5.31 | 4.5 | text (12px floor) | pass |
| light | --mos-accent | --mos-surface-raised | 6.07 | 4.5 | text (12px floor) | pass |
| light | --mos-accent | --mos-surface-hover | 5.66 | 4.5 | text (12px floor) | pass |
| light | --mos-accent | --mos-surface-selected | 5.53 | 4.5 | text (12px floor) | pass |
| light | --mos-state-ready-fg | --mos-state-ready-bg | 8.72 | 4.5 | badge/banner text | pass |
| light | --mos-state-attention-fg | --mos-state-attention-bg | 8.00 | 4.5 | badge/banner text | pass |
| light | --mos-state-blocked-fg | --mos-state-blocked-bg | 9.77 | 4.5 | badge/banner text | pass |
| light | --mos-state-data-fg | --mos-state-data-bg | 9.98 | 4.5 | badge/banner text | pass |
| light | --mos-state-neutral-fg | --mos-state-neutral-bg | 8.08 | 4.5 | badge/banner text | pass |
| light | --mos-state-restricted-fg | --mos-state-restricted-bg | 8.61 | 4.5 | badge/banner text | pass |
| light | --mos-text-strong | --mos-state-ready-bg | 15.72 | 4.5 | banner title | pass |
| light | --mos-text-strong | --mos-state-attention-bg | 15.86 | 4.5 | banner title | pass |
| light | --mos-text-strong | --mos-state-blocked-bg | 15.57 | 4.5 | banner title | pass |
| light | --mos-text-strong | --mos-state-data-bg | 15.23 | 4.5 | banner title | pass |
| light | --mos-text-strong | --mos-state-neutral-bg | 15.14 | 4.5 | banner title | pass |
| light | --mos-text-strong | --mos-state-restricted-bg | 16.13 | 4.5 | banner title | pass |
| light | --mos-text-default | --mos-state-ready-bg | 12.11 | 4.5 | banner body / notice | pass |
| light | --mos-text-default | --mos-state-attention-bg | 12.22 | 4.5 | banner body / notice | pass |
| light | --mos-text-default | --mos-state-blocked-bg | 11.99 | 4.5 | banner body / notice | pass |
| light | --mos-text-default | --mos-state-data-bg | 11.73 | 4.5 | banner body / notice | pass |
| light | --mos-text-default | --mos-state-neutral-bg | 11.66 | 4.5 | banner body / notice | pass |
| light | --mos-text-default | --mos-state-restricted-bg | 12.42 | 4.5 | banner body / notice | pass |
| light | --mos-state-ready-fg | --mos-surface-chrome | 9.60 | 4.5 | inline status text | pass |
| light | --mos-state-attention-fg | --mos-surface-chrome | 8.73 | 4.5 | inline status text | pass |
| light | --mos-state-blocked-fg | --mos-surface-chrome | 10.86 | 4.5 | inline status text | pass |
| light | --mos-state-data-fg | --mos-surface-chrome | 11.33 | 4.5 | inline status text | pass |
| light | --mos-state-ready-fg | --mos-surface-canvas | 8.95 | 4.5 | result line / zone label | pass |
| light | --mos-state-attention-fg | --mos-surface-canvas | 8.14 | 4.5 | result line / zone label | pass |
| light | --mos-state-blocked-fg | --mos-surface-canvas | 10.12 | 4.5 | result line / zone label | pass |
| light | --mos-state-data-fg | --mos-surface-canvas | 10.57 | 4.5 | result line / zone label | pass |
| light | --mos-state-blocked-fg | --mos-surface-raised | 10.86 | 4.5 | field error text | pass |
| light | --mos-accent | --mos-surface-raised | 6.07 | 4.5 | override indicator | pass |
| light | --mos-text-on-accent | --mos-accent | 6.07 | 4.5 | primary button | pass |
| light | --mos-text-on-accent | --mos-accent-hover | 8.03 | 4.5 | primary hover | pass |
| light | --mos-text-on-accent | --mos-accent-press | 10.53 | 4.5 | primary press | pass |
| light | --mos-text-inverse | --mos-surface-inverse | 15.82 | 4.5 | toolbar / toast / cue label | pass |
| light | --mos-text-link-hover | --mos-surface-chrome | 10.53 | 4.5 | link hover | pass |
| light | --mos-border-focus | --mos-surface-canvas | 5.66 | 3 | focus ring (non-text) | pass |
| light | --mos-border-selected | --mos-surface-canvas | 5.66 | 3 | selection marks (non-text) | pass |
| light | --mos-slot-line | --mos-surface-canvas | 3.61 | 3 | zone outline (non-text) | pass |
| light | --mos-slot-required-line | --mos-surface-canvas | 4.44 | 3 | required zone (non-text) | pass |
| light | --mos-keyboard-line | --mos-surface-canvas | 6.29 | 3 | keyboard marks (non-text) | pass |
| light | --mos-border-strong | --mos-surface-raised | 3.60 | 3 | input boundary (non-text) | pass |
| light | --mos-accent | --mos-surface-chrome | 6.07 | 3 | first-run cue ring (non-text) | pass |
| dark | --mos-text-strong | --mos-surface-chrome | 15.47 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-strong | --mos-surface-canvas | 17.02 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-strong | --mos-surface-sunken | 17.56 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-strong | --mos-surface-raised | 13.91 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-strong | --mos-surface-hover | 13.19 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-strong | --mos-surface-selected | 12.92 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-default | --mos-surface-chrome | 12.48 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-default | --mos-surface-canvas | 13.73 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-default | --mos-surface-sunken | 14.17 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-default | --mos-surface-raised | 11.23 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-default | --mos-surface-hover | 10.64 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-default | --mos-surface-selected | 10.43 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-muted | --mos-surface-chrome | 7.11 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-muted | --mos-surface-canvas | 7.82 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-muted | --mos-surface-sunken | 8.07 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-muted | --mos-surface-raised | 6.39 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-muted | --mos-surface-hover | 6.06 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-muted | --mos-surface-selected | 5.94 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-faint | --mos-surface-chrome | 6.22 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-faint | --mos-surface-canvas | 6.85 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-faint | --mos-surface-sunken | 7.07 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-faint | --mos-surface-raised | 5.60 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-faint | --mos-surface-hover | 5.31 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-faint | --mos-surface-selected | 5.20 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-link | --mos-surface-chrome | 9.39 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-link | --mos-surface-canvas | 10.33 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-link | --mos-surface-sunken | 10.66 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-link | --mos-surface-raised | 8.45 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-link | --mos-surface-hover | 8.01 | 4.5 | text (12px floor) | pass |
| dark | --mos-text-link | --mos-surface-selected | 7.85 | 4.5 | text (12px floor) | pass |
| dark | --mos-accent | --mos-surface-chrome | 7.80 | 4.5 | text (12px floor) | pass |
| dark | --mos-accent | --mos-surface-canvas | 8.58 | 4.5 | text (12px floor) | pass |
| dark | --mos-accent | --mos-surface-sunken | 8.86 | 4.5 | text (12px floor) | pass |
| dark | --mos-accent | --mos-surface-raised | 7.02 | 4.5 | text (12px floor) | pass |
| dark | --mos-accent | --mos-surface-hover | 6.65 | 4.5 | text (12px floor) | pass |
| dark | --mos-accent | --mos-surface-selected | 6.52 | 4.5 | text (12px floor) | pass |
| dark | --mos-state-ready-fg | --mos-state-ready-bg | 9.00 | 4.5 | badge/banner text | pass |
| dark | --mos-state-attention-fg | --mos-state-attention-bg | 9.00 | 4.5 | badge/banner text | pass |
| dark | --mos-state-blocked-fg | --mos-state-blocked-bg | 8.16 | 4.5 | badge/banner text | pass |
| dark | --mos-state-data-fg | --mos-state-data-bg | 8.57 | 4.5 | badge/banner text | pass |
| dark | --mos-state-neutral-fg | --mos-state-neutral-bg | 8.91 | 4.5 | badge/banner text | pass |
| dark | --mos-state-restricted-fg | --mos-state-restricted-bg | 10.10 | 4.5 | badge/banner text | pass |
| dark | --mos-text-strong | --mos-state-ready-bg | 13.96 | 4.5 | banner title | pass |
| dark | --mos-text-strong | --mos-state-attention-bg | 14.45 | 4.5 | banner title | pass |
| dark | --mos-text-strong | --mos-state-blocked-bg | 15.43 | 4.5 | banner title | pass |
| dark | --mos-text-strong | --mos-state-data-bg | 15.28 | 4.5 | banner title | pass |
| dark | --mos-text-strong | --mos-state-neutral-bg | 13.19 | 4.5 | banner title | pass |
| dark | --mos-text-strong | --mos-state-restricted-bg | 14.95 | 4.5 | banner title | pass |
| dark | --mos-text-default | --mos-state-ready-bg | 11.27 | 4.5 | banner body / notice | pass |
| dark | --mos-text-default | --mos-state-attention-bg | 11.66 | 4.5 | banner body / notice | pass |
| dark | --mos-text-default | --mos-state-blocked-bg | 12.46 | 4.5 | banner body / notice | pass |
| dark | --mos-text-default | --mos-state-data-bg | 12.33 | 4.5 | banner body / notice | pass |
| dark | --mos-text-default | --mos-state-neutral-bg | 10.64 | 4.5 | banner body / notice | pass |
| dark | --mos-text-default | --mos-state-restricted-bg | 12.07 | 4.5 | banner body / notice | pass |
| dark | --mos-state-ready-fg | --mos-surface-chrome | 9.97 | 4.5 | inline status text | pass |
| dark | --mos-state-attention-fg | --mos-surface-chrome | 9.63 | 4.5 | inline status text | pass |
| dark | --mos-state-blocked-fg | --mos-surface-chrome | 8.18 | 4.5 | inline status text | pass |
| dark | --mos-state-data-fg | --mos-surface-chrome | 8.68 | 4.5 | inline status text | pass |
| dark | --mos-state-ready-fg | --mos-surface-canvas | 10.96 | 4.5 | result line / zone label | pass |
| dark | --mos-state-attention-fg | --mos-surface-canvas | 10.60 | 4.5 | result line / zone label | pass |
| dark | --mos-state-blocked-fg | --mos-surface-canvas | 9.00 | 4.5 | result line / zone label | pass |
| dark | --mos-state-data-fg | --mos-surface-canvas | 9.55 | 4.5 | result line / zone label | pass |
| dark | --mos-state-blocked-fg | --mos-surface-raised | 7.36 | 4.5 | field error text | pass |
| dark | --mos-accent | --mos-surface-raised | 7.02 | 4.5 | override indicator | pass |
| dark | --mos-text-on-accent | --mos-accent | 7.55 | 4.5 | primary button | pass |
| dark | --mos-text-on-accent | --mos-accent-hover | 8.80 | 4.5 | primary hover | pass |
| dark | --mos-text-on-accent | --mos-accent-press | 10.20 | 4.5 | primary press | pass |
| dark | --mos-text-inverse | --mos-surface-inverse | 15.25 | 4.5 | toolbar / toast / cue label | pass |
| dark | --mos-text-link-hover | --mos-surface-chrome | 11.67 | 4.5 | link hover | pass |
| dark | --mos-border-focus | --mos-surface-canvas | 8.58 | 3 | focus ring (non-text) | pass |
| dark | --mos-border-selected | --mos-surface-canvas | 8.58 | 3 | selection marks (non-text) | pass |
| dark | --mos-slot-line | --mos-surface-canvas | 4.23 | 3 | zone outline (non-text) | pass |
| dark | --mos-slot-required-line | --mos-surface-canvas | 8.48 | 3 | required zone (non-text) | pass |
| dark | --mos-keyboard-line | --mos-surface-canvas | 7.88 | 3 | keyboard marks (non-text) | pass |
| dark | --mos-border-strong | --mos-surface-raised | 3.40 | 3 | input boundary (non-text) | pass |
| dark | --mos-accent | --mos-surface-chrome | 7.80 | 3 | first-run cue ring (non-text) | pass |
| light | --mos-text-inverse | --mos-surface-inverse | 15.82 | 4.5 | strip label tooltip | pass |
| light | --mos-text-on-accent | --mos-accent | 6.07 | 4.5 | index tab (bottom-left) | pass |
| dark | --mos-text-inverse | --mos-surface-inverse | 15.25 | 4.5 | strip label tooltip | pass |
| dark | --mos-text-on-accent | --mos-accent | 7.55 | 4.5 | index tab (bottom-left) | pass |
