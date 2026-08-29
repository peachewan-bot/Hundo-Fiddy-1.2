Hundo & Fiddy — V1.6
Stable Phase 1 release of the unified Movie Hundo + TV Fiddy PWA.
Included
Shared near-black / electric-blue Hundo & Fiddy visual system
First-run Welcome screen
Movie Hundo and TV Fiddy home choices
40-title Taste Setup on both sides
Seen / Not seen / Not interested
1–5 star ratings
Persistent comments
Movie Hundo Top 100
TV Fiddy Top 50
History
Local catalogue search
Online title search through the Hundo & Fiddy TMDB proxy
Add-title support for local and online results
Carry-forward chooser before regeneration
Unified Backup / Restore
Per-side reset and Reset Everything
Help & FAQ
Browser/back-button navigation handling
Test mode via `?test=1`
Versioned service-worker/app-shell update strategy
Data model
The stable V1.x user state remains stored under:
`hf-v1.2`
Legacy fallback key:
`hf-v1`
First-run Welcome flag:
`hf-welcome-v1`
Post-onboarding tip dismissal flag:
`hf-post-onboarding-tip-dismissed-v1`
Backup exports the complete application state: Movie Hundo + TV Fiddy together.
Online search
Internet-wide title search is already implemented through the backend proxy:
`https://hundo-fiddy-proxy.peachewan.workers.dev`
No TMDB secret/API key is exposed in the client UI.
V1.6 Bugfix 1
Internal patch identifier: `hf-v1.6-bugfix1`.
Fixes Reset/Restore success-flow navigation so multi-level browser-history cleanup completes before the success modal is created, preventing the final OK action from occasionally leaving/closing the site or installed app.
Release / cache rule
V1.6 uses the release identifier:
`hf-v1.6-bugfix1`
Any future deployed application update must bump the service-worker/cache identifier and the versioned asset references in `index.html`.
Phase boundary
V1.6 is the stable end-of-Phase-1 release.
The next major public release is intended to be V2.0. Phase 2 should begin from a separate development/beta environment, preserving V1.6 production compatibility. Claude Code's first Phase 2 task should be a read-only repository audit before modifications are made.
