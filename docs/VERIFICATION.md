Current revision: [V6 scaling, diagrams and hero verification](VERIFICATION-V6.md). The following records the preceding V3 revision.

# Verification — revised Wurzelwald presentation

Public URL: https://dreambau.com/bildungshaus/ · revision date: 2026-09-07.

## Content and provenance

The revised source set contains 18 syntheses, a twelve-chapter 3,885-word whitepaper, executive summary, source register and unchanged original concept: 22 registered reader documents. Core concept and module files were also aligned against the original and chronological input. A 36-requirement coverage matrix and seven closed editorial review findings are recorded in the Core. No new empirical pilot or financial results are claimed.

The graph contains 13 nodes, including actual actors child, family, pedagogical team, kitchen, leadership and provider. Ordinary scrolling tells the complete story; opt-in spatial exploration and a list offer additional routes. Selection, map transform and page position survive the return from an article. Sources include their population, denominator and limits.

## Public release and browser checks

Release `20260907-wurzelwald-v3`: 50 files, 6,752,433 bytes. Every upload checksum verified before activation. Public HTML, JS and CSS match the build. Existing nginx, readonly release mount and no additional application service. Deployment backups and selective rollback: `ops/README.md`.

Commands run against the actual public URL:

```sh
VERIFY_URL=https://dreambau.com/bildungshaus/ VERIFY_OUT=output/qa/public-v3-graph node scripts/verify-graph.mjs
VERIFY_URL=https://dreambau.com/bildungshaus/ VERIFY_OUT=output/qa/public-v3-documents node scripts/verify-documents.mjs
VERIFY_URL=https://dreambau.com/bildungshaus/ VERIFY_OUT=output/qa/public-v3-flow-settled node scripts/verify.mjs
```

- 52 real node→dialog→article click paths passed: 13 × desktop/mobile × light/dark. Browser/contextual return, map pan/zoom, keyboard activation and normal wheel scrolling passed.
- All 22 reader documents and exact downloadable bodies passed; library entry for P12/P18, unknown-document recovery and no-JS links passed.
- Four complete interaction profiles passed: 1440×1000, 390×844, 360×640 and reduced motion at 1440×900. Includes dialog, source, theme, keyboard scenario slider, module accordion and conversation-note download.
- Zero observed page errors, failed content responses or Axe WCAG 2/2.1 A/AA findings in those checks. This is not a complete accessibility certification. Mobile dimensions/touch were emulated in Chrome; no physical iOS/Android device tested.
- Apex and Matrix discovery return 200. The slashless presentation URL resolves to the correct HTTPS URL; a missing asset returns 404. `output/qa/public-v3-routes.json` records actual responses and checksums.

`npm run build`, `npm run lint`, missing-file sync regression and `git diff --check` passed. Existing ScrollCraft/shadcn lint warnings remain. The sync rejects missing registered files before writing partial content.

## Visual evidence

Public screenshots and reports are under `output/qa/public-v3-*`. Whole-story review and any subsequent targeted layout correction are recorded in `docs/REVISION-2026-09-07.md`. Earlier v1 findings are archived in `docs/VERIFICATION-v1.md` and are not substituted for current checks.

The new sparse, crooked crayon relationship image is `public/images/beziehungen-punk-v2.png`, generated with the integrated image tool from the user's visual brief. It is generated artwork, not a child's original drawing. Amber Slate colours, Outfit and the ordered interface are retained.

This repository remains local-only. No remote, PR or merge is implied. Formbricks is a separate installed/prepared service, stopped pending DNS and public end-to-end checks; the website does not claim an active survey.

## Final targeted layout and timing review

Whole-page review identified overlapping edge text and an overly long mobile list. The final release moves edge descriptions into a selected-relationship legend and makes the mobile overview deliberately expandable (initial graph section approximately 2,002px instead of 4,795px). The visible UI changes passed targeted keyboard/list/edge checks, then the public 52-path graph suite and 22-document suite again.

One full-flow Axe run measured the open dialog during its 100ms entry animation. The exact node was reproduced at 50ms/opacity 0.8024 with contrast 3.98:1; after completion the text is #586576 on white, 5.94:1. The test now awaits actual animation completion and opacity 1 before applying the same full ruleset. No CSS or accessibility-rule suppression was used. All four public full-flow profiles pass in `output/qa/public-v3-flow-settled/report.json`. Controlled diagnosis is in `output/qa/dialog-contrast-diagnostic/`.
