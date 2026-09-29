# Verification

## Passed locally

- Six domain/security test groups: task defaults, independent templates, invalid dates, pause/resume, end/finish/undo, atomic switching, basket snapshots, archived history, local week clipping, DST weeks (167/169 hours), secret exchange, cookie tampering/expiry/rotation, and origin checks.
- Real local D1 API integration: missing and incorrect access rejected; Secure/HttpOnly/SameSite cookie; one active session from simultaneous starts; same-request retries and double taps do not duplicate data; mismatched payload/request ID and stale revisions rejected.
- Chromium browser flow: private-link exchange removes fragment, Vietnamese task creation, basket selection, first action, start, pause/reload/resume, finish celebration, undo, weekly details, and settings.
- Independent browser contexts: second device sees start, pause, and finish via polling.
- Dropped successful server response: draft remains; retry uses the same request ID and creates one task.
- Screenshots at 375px, 390px, and desktop; no horizontal overflow. Focus timer, Pause, and Finish visible in the initial phone viewport.
- TypeScript check, ESLint, and production Worker build.

## Still requires an actual iPhone

- Safari Add to Home Screen and cookie sharing/fallback paste flow.
- Device screen lock and wake-lock behavior, battery saver restrictions, and completion sound.
- VoiceOver and real touch/keyboard accessibility review. Browser simulation does not substitute for those checks.

## Scope boundaries

No paid AI APIs, background notifications, offline writes, automatic scheduling, countdowns, streaks, or account login. The production dataset begins empty except for baskets, templates, and preferences. QA records are local only.
