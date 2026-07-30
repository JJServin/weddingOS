# WeddingOS Prototype 0.1

A polished, local prototype of Journey 001, Encounter One: **“What Are We Saying Yes To?”** WeddingOS helps couples distinguish readiness for marriage from readiness for a celebration. It supports understanding and never recommends marrying now or waiting.

> **Privacy warning:** Build 1 simulates Partner A and Partner B in one browser using localStorage. Do not enter sensitive or identifying information. This is not real privacy or authentication. Firebase and real two-user privacy will be considered only after the experience is approved.

## Install and run
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` — Vite development server
- `npm run lint` — ESLint
- `npm run test` — Vitest unit/component checks
- `npm run build` — TypeScript and production bundle
- `npm run test:e2e` — Playwright browser journey
- `npm run format` — Prettier

## Structure
`src/content` holds copy; `src/types` the domain model; `src/state` reducer, persistence and approved-content rules; `src/components` reusable shell; `src/pages` route experiences; `src/routes` routing; `tests` Vitest; `e2e` Playwright; and `docs` product, scope, architecture and testing decisions.

## Reset demo data
Open **Prototype menu** from any screen and choose **Reset Demo**. This returns to the welcome screen and replaces saved prototype state. Browser storage may also be cleared manually.

## Limitations
There is no backend, authentication, cross-device synchronization, production privacy, AI, analytics, payment, or deployment. Route guards are intentionally soft for prototype review. Encounter Two is intentionally unavailable.
