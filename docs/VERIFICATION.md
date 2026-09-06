# Verification — 2026-09-07

Release: `20260907-v1`, public URL: https://dreambau.com/bildungshaus/.
The brief was authored under the user's explicit creative delegation.

## Content

The final source set contains the 3,176-word whitepaper, 16 research syntheses,
executive summary, Jan's original concept and the source register. Twenty
reader documents are included. The original concept and Frank's chronological
transcript remain unchanged in the Core; the transcript is not published by
this site. Website copies remove frontmatter and translate internal links to
reader routes. Jan's text itself is retained.

The independent editorial review found two ambiguities, both corrected before
publication: the planned facility now reads as planned, and the calculation
shows Berlin RV-Tag, Ganztag/Teilzeit, August 2026 and included meals beside the
amount. Network edges and the adjustable percentage are explicitly hypotheses.

## Public browser acceptance

`VERIFY_URL=https://dreambau.com/bildungshaus/ VERIFY_OUT=output/qa/live node scripts/verify.mjs`

Chrome: desktop 1440×1000, mobile 390×844, compact 360×640, reduced motion
1440×900. All passed:

- Problem-node selection and correct 46.5% finding; detail dialog, source text,
  Escape dismissal and selected-topic persistence.
- Keyboard slider changes the scenario; module accordion reveals detail.
- Downloaded conversation notes contain the selected topic and its source.
- No horizontal overflow, uncaught page errors or HTTP failures.
- Axe WCAG 2 A/AA and 2.1 AA: zero reported violations in light/dark views and
  open detail dialogs. This is automated coverage, not a full accessibility audit.

`VERIFY_URL=https://dreambau.com/bildungshaus/ VERIFY_OUT=output/qa/live-documents node scripts/verify-documents.mjs`

All 20 reader routes rendered. All 20 Markdown downloads returned HTTP 200 and
matched their intended content exactly. Internal publication links resolve to
known routes; Whitepaper axe scan is clear. Return navigation restores the
library position, an unknown document has a working recovery link, and the
no-JavaScript fallback has three accessible document links.

Reports and screenshots: `output/qa/live/`, `output/qa/live-documents/`.

## Scroll and visual review

Scroll Craft's official shoot harness captured contiguous final live frames
for desktop and 390px mobile; contact sheets were inspected. Ten native-flow
acts span approximately 10.9 desktop and 15.4 mobile viewport heights. Content
remains ordered and reachable. No pinned timeline or video is used: ordinary
flow acts are outside the harness's dead-scroll test and static prose is outside
its cue-contrast test. Axe and manual screenshot inspection cover those cases.
The separate reduced-motion contact sheet was inspected and is recorded in `output/scroll/live-reduced/`.
Physical iOS/Safari hardware was not tested.

The intended curve was approachability → recognition → understanding → a
concrete next step. The graph is the interaction peak. Review changed the
initial overly tidy drawings to crooked crayon assets, made mobile headings
fit, and repaired style precedence between Scroll Craft resets and shadcn.
The final palette keeps Amber Slate's orange/blue while using legible text
colors. Links inside longform documents are underlined.

## Build and deployment

`npm run build`: TypeScript and Vite passed. `npm run lint`: no errors; eleven
warnings in unchanged Scroll Craft engine and shadcn export conventions.
`npm audit --omit=dev`: zero reported vulnerabilities.

The 47-file static release uses a read-only release-specific mount in the
existing nginx pod. Remote file checksums were verified before activation;
nginx syntax and Kubernetes server dry-runs passed. Public bundles match local:

- `index-BdDI2HV9.js`: `65f92a6677351ea0ff5c699afb1a6d78ba6b6dc37e230c7b71379dd3fef068de`
- `Reader-oHn9ikKW.js`: `80525e91e65183fba1e8b53111ee29389c39a29f85e95c51a340728563cf8cbd`

Apex and Testmails returned 200, protected Testmails API 401; Matrix discovery
is byte-identical to its prior baseline. Missing assets return 404. No server
process was added. Release backups and selective rollback instructions are in
`ops/README.md`; deployment evidence is in `output/deploy/20260907-v1/`.

This repository is local-only; no remote, PR or merge is implied. Formbricks
is a separate prepared installation with unresolved RAM/DNS dependencies.

## Assets and signature

Two final raster assets were generated with the integrated image tool: the
crooked house/people and plants. Two earlier, overly tidy versions are retained
only in `assets-drafts/`. No paid KIE credit usage is claimed.

Custom grammar: editorial workbook, chosen because the story needs readable
source depth and a freely navigable graph. The brief records why the film,
gallery, poster, live software surface, split stage and cutlist alternatives
were unsuitable. Signature: graph selection highlights its relationships and
builds a personal, source-linked conversation note. The fingerprint registry
was empty before this first build.
