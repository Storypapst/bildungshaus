# Reader diagrams and tables

Local revision, 9 September 2026. No publication.

The reading experience keeps Outfit and existing semantic color tokens. Explanations are placed between the relevant arguments, not gathered into an illustration gallery. Open layouts, a small hand-drawn-looking branching line, comparisons and feedback loops do different jobs. The diagrams carry real concepts, not decorative statistics. No extra background cards or gradients are added.

## Coverage

- Summary: eight explanatory figures covering continuity, evidence denominator, pedagogy, participation, kitchen, transfer, resource accounting and pilot prerequisites.
- Concept: six figures embedded after their source paragraphs.
- P02, P03, P08, P10, P18: one additional explanation each. All eighteen pre-existing research diagrams remain.
- P10, P12 and sources: all Markdown tables use a shared presentation. Visible section-derived captions, clear column headings, generous cells and quiet alternate rows. Wide tables remain semantic tables inside a named keyboard-scroll region on narrow screens.

The figure material is derived from the existing documents. The 65% finding explicitly describes facilities, not individual staff, and points back to the source context. Feedback loops remain hypotheses. Time savings and cash savings remain separate.

The reader now renders each complete Markdown document in one pass. Figures are attached to paragraph source ranges, preserving list/table continuity and existing article heading attachments. Anchor coverage is tested, so editorial changes that invalidate anchors are caught.

## Validation

`node scripts/verify-reader-visuals.mjs`

36 reader states: nine documents × 390/1440 px × light/dark. All figure counts and table wrappers present; no document horizontal overflow. Screenshots and results: `output/qa/reader-visuals/`.

Build passes. Additional axe WCAG A/AA checks on summary and P12 at 390 px found no violations in the reading content. This is browser emulation, not physical iPhone verification. Editorial/visual independent review remains with the lead agent.
