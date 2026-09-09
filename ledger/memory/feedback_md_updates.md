---
name: Feedback — Always Update .md Files After Work
description: After completing any task, update the relevant .md documentation file to keep Arun and Claude in sync across sessions.
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
After completing any task — bug fix, new feature, architecture decision, config change, sprint progress — update the relevant .md file to reflect the new state.

**Why:** Arun and Claude use the .md files as the shared source of truth. Without updates, the docs drift and future sessions lose context.

**How to apply:**
- Reactak work → update `REACTAK_NOTES.md` at repo root
- Mosaic architecture changes → update relevant file in `web/modules/custom/mosaic/docs/`
- Sprint progress → update `web/modules/custom/mosaic/sprints/sprint-XX.md`
- ADR decisions → create/update in `web/modules/custom/mosaic/docs/adrs/`
- Major project decisions → update `MOSAIC.md` at repo root
- Always update memory files in `.claude/projects/.../memory/` as well
