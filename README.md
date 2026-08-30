# Hundo & Fiddy — V1.9

Stable end-of-Stage-1 release of the unified Movie Hundo + TV Fiddy PWA.

## V1.9 release

V1.9 is the final Stage 1 release baseline.

It retains the installed-PWA offline cold-launch fix introduced during Stage 1 and makes the deployed release/cache-busting identifiers consistently use `hf-v1.9`.

No recommendation, user-data, storage-schema, Backup/Restore, catalogue, navigation, or visual-design changes are part of this V1.9 release cleanup.

### Offline/PWA behavior

Navigation and versioned app-shell assets use a cache-first strategy so an installed PWA can cold-launch from its precached shell with no network connection.

Update safety remains preserved:

- cache identifier: `hf-v1.9`
- versioned `style.css`, `app.js`, and `sw.js` URLs
- install fetches fresh shell assets using `cache: 'reload'`
- activation deletes previous `hf-*` caches
- `skipWaiting()` and `clients.claim()` retained
- non-shell same-origin requests remain network-first with cached fallback

## Data compatibility

No V1 user-data/storage changes were made.

Main state key remains:

`hf-v1.2`

Legacy fallback remains:

`hf-v1`

Welcome flag remains:

`hf-welcome-v1`

Post-onboarding tip dismissal remains:

`hf-post-onboarding-tip-dismissed-v1`

These storage/UI keys are intentionally not renamed to match the V1.9 application release number.

Backup/Restore format is unchanged.

## Stage 1 acceptance

Final Stage 1 verification completed against the V1.9 production baseline:

- Playwright regression: **306/306 passed**
- failed: **0**
- flaky: **0**
- skipped: **0**
- Samsung installed-PWA offline cold-launch: **PASS**
- production URL: `https://whatdoyouwanttoeat-youpick.com`

Stage 1 is closed. V1.9 is the protected production baseline for future Stage 2 work.
