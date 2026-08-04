# Interaction Regression QA — Prototype v0.2

## Scope and environment

This checklist covers every active route in Encounter One for Partner A, Partner B, and Together mode. The code-path review was completed on 2026-08-04. A browser walkthrough could not be executed in this container because the configured npm registry returned HTTP 403 and the required Vite/Playwright packages were not available locally. Rows are therefore marked **Blocked** rather than falsely reported as manually passed. The Playwright suite contains the corresponding executable interaction paths and must be run before release in an environment where dependencies can be installed.

Legend: **Yes (inspection)** means the controlled handler and deterministic destination were verified in source. **Blocked** means browser confirmation remains required.

| Screen | Buttons work | Selection visible | Back works | State persists | Passed |
|---|---|---|---|---|---|
| Welcome | Yes (inspection) | N/A | N/A by design | N/A | Blocked |
| Choose Mode | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Prototype Review / Demo | Yes (inspection) | N/A | Yes (inspection) | Yes (inspection) | Blocked |
| Partner A Preparation Intro | Yes (inspection) | N/A | Yes (inspection) | N/A | Blocked |
| Partner A — Marriage in One Sentence | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner A — An Ordinary Evening | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner A — The Promise | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner A — What Still Needs Conversation | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner A — Sharing Preparation | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner B Preparation Intro | Yes (inspection) | N/A | Yes (inspection) | N/A | Blocked |
| Partner B — Marriage in One Sentence | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner B — An Ordinary Evening | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner B — The Promise | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner B — What Still Needs Conversation | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Partner B — Sharing Preparation | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Waiting | Yes (inspection) | N/A | Yes (inspection) | Yes (inspection) | Blocked |
| Conversation Bridge | Yes (inspection) | Action status visible | Yes (inspection) | Approvals persist | Blocked |
| Together Arrival | Yes (inspection) | Agreement visible | Yes (inspection) | Screen-local | Blocked |
| Grounding | Yes (inspection) | Timer state visible | Yes (inspection) | Journey state persists | Blocked |
| Shared Marriage in One Sentence | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Mirror Moment | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| Predict the Promise | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes (inspection) | Blocked |
| The Ordinary Life Behind the Promise | Yes (inspection) | N/A | Yes (inspection) | Notes persist | Blocked |
| Two Good Purposes | Yes (inspection) | N/A | Yes (inspection) | N/A | Blocked |
| Faith, Conscience and Hope | Yes (inspection) | N/A | Yes (inspection) | N/A | Blocked |
| Pause Check | Yes (inspection) | Yes (inspection) | Yes; mode-aware | Yes (inspection) | Blocked |
| Shared Capture | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes; immediate | Blocked |
| Closing | Yes (inspection) | N/A | Yes (inspection) | N/A | Blocked |
| Partner A Integration | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes; immediate | Blocked |
| Partner B Integration | Yes (inspection) | Yes (inspection) | Yes (inspection) | Yes; immediate | Blocked |
| Shared Record | Yes (inspection) | N/A | Yes (inspection) | Shared-only state | Blocked |
| Pilot Feedback | Yes (inspection) | Yes (inspection) | Yes (inspection) | Partner-scoped | Blocked |
| Complete | Yes (inspection) | N/A | Yes (inspection) | N/A | Blocked |
| Paused / Resume | Yes (inspection) | N/A | Resume destination works | Saved path persists | Blocked |

## Required browser sign-off

Run `npm install`, `npm run dev`, and `npm run test:e2e`, then repeat the table as Partner A, Partner B, and Together at desktop and 375px widths. Confirm each row as Passed only after clicking every visible control, navigating Back and forward, refreshing, and checking that the other partner cannot see private content.
