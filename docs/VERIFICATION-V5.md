# V5 — Lernen, Einarbeitung und gemeinsame Qualität

Public release: `20260907-lernen-v5`, 2026-09-07, https://dreambau.com/bildungshaus/.

## Delivered

Equal-weight proverb clauses, tilted hero, two bounded mindmap perspectives (one house / multiple houses and provider), direct full findings with source tabs and article links. Thirteen individually revised cards distinguish observed evidence, assumptions and proposed tests. Concept and P02/P03/P10 were expanded with onboarding, adaptive change, kitchen turnover and transfer between houses. Existing document IDs remain compatible; visible Whitepaper labels become Konzept.

Four generated felt-tip illustrations accompany a sequential learning story. Lab responsibility, kitchen conflicts, Reggio-inspired educational pathway, reinvestment cycle and Roadmap are explicit. Blue-section links have permanent underlines and hover/focus states. Inactive scenario tracks are more restrained. The survey section has an accessible preview and explicitly unavailable start button until actual surveys exist.

## Public verification

- 52 direct article paths: 13 nodes × desktop/mobile × light/dark.
- Both map perspectives; complete labels; bounded extreme drags; native pointer capture and touch; keyboard, ordinary page scrolling and reader return.
- Four complete interaction profiles, both themes; 22 reader documents and exact downloadable bodies.
- Thirty illustrated section states across three viewport/motion profiles and both themes. Proverb typography, hero rotation, sequential opacity progression, reduced motion, image decoding, survey preview and page/dialog accessibility checks pass.
- Zero observed JavaScript errors, failed content responses or Axe A/AA findings in these suites. Physical mobile devices and a full accessibility certification are outside this check.
- User's completely white browser screenshot could not be reproduced exactly. Confirmed pan/focus/clipping failure modes were repaired; no unsupported claim about the exact blank-page cause.

Repeat with `VERIFY_URL=https://dreambau.com/bildungshaus/` and a fresh `VERIFY_OUT` for `scripts/verify-mindmap.mjs`, `scripts/verify.mjs`, `scripts/verify-documents.mjs`, `scripts/verify-story-v5.mjs`. Reports/screenshots: `output/qa/public-v5-*`.

Build, lint and diff whitespace checks pass. Lint warnings remain in imported ScrollCraft, shadcn exports and the exported map clamp helper. Public HTML, main JS, CSS and Reader match the local production build. All 75 uploaded files were checksum verified before activation; 33,187,625 bytes include retained PNG originals, not initial page transfer. Apex and Matrix discovery remain byte-identical, missing asset returns 404 and slashless URL redirects to correct HTTPS address. See `output/qa/public-v5-routes.json`.

Existing nginx static hosting; no extra service or database. Backup: `/root/releases/bildungshaus/20260907-lernen-v5/backup`; selective rollback via `ops/rollback.py`. Local Git only; no PR or merge claimed.

## Survey boundary

Authoritative DNS still lacked `umfrage.dreambau.com` at the latest audit. Required A record: `umfrage` → `46.225.160.119`, TTL 3600 or automatic. Formbricks is installed but stopped; no owner bootstrap or real survey IDs exist. Five schema-checked import drafts are prepared. After DNS, startup/owner, HTTPS, application mail, import and actual response/analytics checks remain. The website does not invent active survey links or collect responses through its preview.

## Artwork

Generated artwork, not actual children's drawings. Four final PNG originals and web JPEGs in `public/images/lernen-*`; prompts/source paths in `docs/visual-assets-v5-final.json`. Original concept and chronological input remain unchanged.
