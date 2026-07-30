# Technical decisions and implementation plan

## Build plan
The prototype is delivered in vertical slices: structured content, local journey state, reusable shell and cards, private preparation, approved-content bridge, shared encounter, private integration, shared record, feedback, then accessibility and automated checks.

## Decisions
- **Local reducer and Context:** one serializable state tree makes privacy boundaries reviewable. Each partner owns a separate response map; shared screens read only approved extracts.
- **localStorage persistence:** `weddingos-prototype-v1` preserves refresh progress. This is convenience, not security; Reset Demo removes the working state.
- **Deterministic bridge:** the bridge counts approved exact responses or approved summaries. It never examines private text to generate shared language.
- **Route-first experience:** every meaningful moment has a URL so pilots can return to a precise place. Prototype navigation remains intentionally permissive for review.
- **Static content:** Scripture and journey copy ship in the bundle. There are no API calls, AI services, analytics, external assets, or fonts.
- **Progress without scoring:** calm stage names replace percentages, scores, streaks, and deadlines.
- **Build 2 boundary:** real accounts, partner-device isolation, authorization, encryption policy, deletion/export, consent and threat modeling must be designed only after the experience is approved.

## Privacy model
UI separation models a future two-user product but is not a security boundary: anyone with access to this browser can inspect localStorage. Private integration never enters the shared record.
