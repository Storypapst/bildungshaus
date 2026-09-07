# Five-role survey pretest — 7 September 2026

Release `20260907-weweit-pretests`, application revision `a525939`, extends V6 with an ordered five-role survey dialog. All targets are dedicated `cmtrf0…` PRETEST copies, separate from future field collection. The button is “Fragebögen ausprobieren”; the dialog asks for fictitious data and reserves the child perspective for adult testers. Underlined links, visible focus and 44 px targets support keyboard and touch use.

## Data readback

The Terra agent used separate public browser runs, then checked the authenticated Formbricks Responses and Summary views. Each of parents, professionals, management, parent board and child perspective has three completed responses, zero incomplete own test sessions and stored case values. These are 15 synthetic submissions, not interviews with 15 real stakeholders.

The first count was wrong: Formbricks included started sessions while an earlier browser runner had timed out before completion. The agent removed only its own incomplete tests, repeated those roles and checked both the actual completion screen and the explicit completed response status. This correction was communicated to Frank.

Two aggregation fields per role were read back against the cases:

| Role | Fields | Observed summary |
| --- | --- | --- |
| Parents | eltern_1, eltern_2 | Three distinct categories each, 1 response / 33.33% per category |
| Professionals | fk_1, fk_3 | 2/1 distributions in both fields |
| Management | gf_1, gf_2 | Three distinct categories each, 1 response / 33.33% per category |
| Parent board | vorstand_1, vorstand_2 | Three distinct categories each, 1 response / 33.33% per category |
| Child perspective | kinder_1, kinder_2 | Three ratings per field; summary values 2.00 and 3.00 |

Infrastructure and detailed role IDs are recorded in the Core's `30 - Product & Delivery/40 - Signal Collection/03 - Betrieb und Nachweise.md`. Formbricks storage was configured on the existing separate object store and verified by upload/render/readback/removal of the own test object. Existing memory limits remain; Cap and Novu are stopped, not deleted. Owner verification is visible in Formbricks, but independent receipt of a specific verification email is not claimed.

## Website verification

Build and diff check passed; lint has only existing imported ScrollCraft and fast-refresh warnings. Local role-dialog checks pass desktop/mobile in both themes with zero tested Axe violations. Public story checks pass three viewports in both themes, including all five exact role URLs. Public document checks pass all 22 readers/downloads, including the original concept PDF. Seven public release artifacts match the build byte for byte. The concept PDF checksum remains `d6fac9ff192e476998b15b2c621d10a2ae63cde54f03f4f62a6cd5ab08138836`.

The first direct public click check caught the child start page still saying “SPAETERE PHASE – Methodenvorlage” without its explicit PRETEST/adult instruction. That wording was corrected in Formbricks while preserving the same ID and three responses. The final public click-through run passed all five live PRETEST landing pages, with no new submissions. Four desktop/mobile theme dialog states also passed with zero tested Axe violations.

Reports: `output/qa/public-pretests-{story,documents,links}/report.json` and `output/qa/public-pretests-assets.json`. Re-run with `VERIFY_URL`, `VERIFY_OUT`, and `VERIFY_TARGETS=1 node scripts/verify-survey-links.mjs`; this opens landing pages without submitting additional answers. No physical mobile-device acceptance is claimed.
