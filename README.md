# WeddingOS Prototype 0.2

A local prototype of Journey 001, Encounter One: **“What Are We Saying Yes To?”** It tests whether couples benefit from exploring marriage meaning before wedding structure. WeddingOS supports understanding and never recommends whether, when or how a couple should marry.

> **Privacy warning:** This prototype simulates Partner A and Partner B in one browser using localStorage. Do not enter sensitive or identifying information. This is not production privacy or authentication.

## Install and run
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` — Vite development server
- `npm run lint` — ESLint
- `npm run test` — Vitest
- `npm run build` — TypeScript and production bundle
- `npm run test:e2e` — Playwright

## Structure
`src/content` holds static copy and options; `src/types` the domain model; `src/state` reducer, v2 persistence and permission rules; `src/components` reusable interaction primitives; `src/pages` route experiences; `tests` and `e2e` automated checks; and `docs` design and technical decisions.

## Reset Prototype v0.2
Open **Prototype menu** and choose **Reset Prototype v0.2**. Revised data uses the `weddingos-prototype-v2` key; v0.1 answers are not loaded into revised prompts.

## Limitations
This remains a one-device experience-testing simulation. No production privacy, backend, Firebase, AI, authentication, synchronization, analytics, deployment or payment service exists. Encounter Two is shown only as unavailable and is not built.
