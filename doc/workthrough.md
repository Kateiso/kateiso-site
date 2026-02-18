# Website Upgrade Walkthrough

## Goal
- Add a reusable chat layer (Kai) with a model-provider abstraction for future expansion.
- Upgrade visual direction and photos browsing to an Instagram-like streaming experience.
- Standardize brand display text from `Kateiso` to `Kateiso Cao`.

## Decisions
- Chat runtime: independent API service (Fastify).
- Provider abstraction: Gemini + Anthropic as first adapters.
- Entry point: global floating trigger + right-side drawer.
- Memory policy: in-session only.
- Access policy: public usage with gateway-side rate limiting.
- Photos: responsive multi-size image fields and immersive viewer.

## Implementation Notes
1. Added global chat shell in `src/layouts/Base.astro` and behavior in `public/assets/js/site.js`.
2. Rebuilt `src/pages/photos.astro` and `src/pages/en/photos.astro` into stream cards + fullscreen viewer.
3. Reworked home moments sections to a horizontal media rail using normalized gallery data.
4. Introduced `src/utils/gallery.ts` to support both old and new manifest shapes.
5. Extended `scripts/process-inbox.mjs` to emit richer gallery objects and optional media derivatives.
6. Updated brand naming in SEO/page titles/JSON-LD author fields.
7. Added AGENTS reminder for future Wangge Yucun case-study publication.

## Validation Plan
- `npm run build` in website root.
- Spot-check `docs/index.html`, `docs/photos.html`, `docs/en/photos.html` outputs.
- Verify chat drawer open/close/submit UX and fallback message when gateway env is not set.

## Result
- Implemented in this iteration; see git diff for affected files.
