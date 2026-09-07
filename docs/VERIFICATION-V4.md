# Gemeinsam: visual and relationship revision

Public release: `20260907-gemeinsam-v4`, https://dreambau.com/bildungshaus/, 7 September 2026.

The emotional opener now uses the requested proverb. Its African origin is not established; the source register explains provenance. The original hero people remain, with a small house behind them. Eight illustrations provide distinct crayon scenes through the argument. Serving JPEG encodings at unchanged dimensions reduces the nine used images from 17,499,884 to 3,402,834 bytes; PNG originals remain.

The desktop whiteboard and detail pane are adjacent; mobile details open in a bounded dialog. Overview, relationships and sources are separate tabs, with an internal scrolling cue. Article return retains node and map position. Slider tracks and handles have stronger contrast. The narrative, whitepaper and P02/P03/P05 use verified Change Leadership sources: three Rs, separately four relational-trust characteristics. Only an author article and genuine chapter excerpt were available, not the full digital book.

Wirweit and Weweit are naming candidates. No registration was performed. Current site and publication brand headings use neutral Bildungshaus while spelling is pending. Historical records and Google decks were not renamed in this revision.

## Public verification

- `public-v4-graph/report.json`: 52/52 real node → tabs → detailed finding → full article → return paths, desktop/mobile and both themes. Internal scrolling, keyboard focus, dialog focus boundaries, mouse dragging, pan/zoom and context return pass. Track contrast 5.30:1 light, 7.62:1 dark; thumb edge 8.27:1 / 10.01:1.
- `public-v4-flows/report.json`: desktop 1440×1000, mobile 390×844, compact 360×640, reduced motion 1440×900. Downloads, saved topics, economic controls, module expansion and light/dark checks pass. No JavaScript/HTTP errors or detected Axe A/AA violations.
- `public-v4-documents/report.json`: 22 readers and download bodies matched, no browser errors or detected Axe violations.
- `public-v4-illustrations/report.json`: 30 illustrated section/theme/viewport states. All images decode, no horizontal overflow. Natural full-page scrolling precedes captures so later staggered steps appear.
- `public-v4-transport.json`: public HTML and directly referenced bundles match local production bytes; apex and Matrix discovery return 200; missing asset 404; slashless URL reaches matching HTTPS page.
- Remote staging verified all 67 files before activation; index SHA256 `86b0dcdeef7800606f62fcd8433714f9873869f4cfc08072f568b38dbb14b4cd`.

Build and TypeScript pass. Lint has warnings in the imported Scroll Craft engine and generated shadcn exports, no errors. Core link checker: 123 Markdown files, 497 internal links, no missing destinations. No physical-device test or complete accessibility certification is claimed.

Some automatic full-section screenshots include an offscreen fixed skip link or catch a tab animation mid-transition. Separate settled viewport captures (`desktop-stable-overview.png`, `desktop-stable-sources.png`) and DOM readback confirm one visible tab panel, correct selected-node colors and an unfocused skip link outside the viewport. This is documented as a capture limitation, not hidden by changing the page for screenshots.

## Reproduce

Set `VERIFY_URL=https://dreambau.com/bildungshaus/` and a unique `VERIFY_OUT` for each script, then run `scripts/verify.mjs`, `scripts/verify-graph.mjs`, `scripts/verify-documents.mjs`, and `scripts/verify-illustrations.mjs` with Node. Sync canonical content with `BILDUNGSHAUS_CORE` resolved from local routing, then `npm run build`.

Deployment uses the existing nginx and read-only release directory. Backup: `/root/releases/bildungshaus/20260907-gemeinsam-v4/backup`; selective rollback via `ops/rollback.py`. No new server service, database or hardware upgrade.
