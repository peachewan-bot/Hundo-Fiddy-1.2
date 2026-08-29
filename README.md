# Hundo & Fiddy — V1.8

Candidate stable end-of-Phase-1 release of the unified Movie Hundo + TV Fiddy PWA.

## V1.8 change

V1.8 fixes a confirmed real-device Android PWA defect:

When the installed app was cold-launched with Flight mode enabled and Wi-Fi disabled, the app could remain stuck on its splash screen instead of loading offline.

The cause was the service worker's network-first navigation strategy. V1.8 changes navigation and versioned app-shell assets to cache-first, allowing an installed PWA to cold-launch immediately from its precached shell.

Update safety remains preserved:

- cache identifier bumped to `hf-v1.8`
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

Backup/Restore format is unchanged.

## Regression requirement

V1.8 should be treated as a release candidate until:

1. the complete Playwright regression suite is rerun against the deployed V1.8 site;
2. the real Samsung installed-PWA offline cold-launch test is repeated with Flight mode enabled and Wi-Fi disabled;
3. normal online launch/update behavior is reconfirmed.

Only after those pass should V1.8 receive the stable production tag.
