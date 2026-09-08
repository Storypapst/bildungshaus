# Local design revision, 8 September 2026

No commit, push or deployment. Main hero unchanged pending selection.

- Reader: eight new explanatory visuals in summary, six in concept, five supplemental article visuals; eighteen existing article diagrams retained.
- Reader tables: captions, header hierarchy, row rhythm, keyboard focus and contained mobile overflow.
- Presentation: neutral survey card and following section; static mindmap detail pane; explicit everyday/scaling perspectives; post-it nodes and selected marker-line animation with reduced-motion fallback. Mobile map starts at a readable zoom.
- Hero lab: five distinct compositions, each at actual 1280px and 390px viewport widths, with theme propagation.

## Verification

- Build passes; active CSS color literals centralized in tokens.
- Reader worker verified 36 document/viewport/theme states; no page overflow. Summary and P12 accessibility checks passed.
- Ten standalone hero states pass overflow and WCAG A/AA checks.
- Independent source and rendered review covered reader diagrams, mobile table, map layout/animation and hero frames/themes. Identified count/caption, frame width/theme, mobile map scale and composition issues were corrected and rechecked. No blocking findings remain in that targeted review.
- Minor: mobile hero4 CTA extends below the first 844px viewport, accessible by normal scrolling.
- Physical iPhone/Safari not verified.
