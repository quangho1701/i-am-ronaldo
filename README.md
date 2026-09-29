# I Am Ronaldo

A personal daily task list and count-up focus timer. Built with the existing React, TypeScript, Vinext, Cloudflare Workers, D1, and Drizzle starter.

## Run locally

Requires Node 24+ (Node's built-in TypeScript support is used for tests).

```sh
npm ci
npm run setup:local
npm run dev
```

Open the link in `.private/local-link.txt`. The local key is generated randomly and separately from production; there is no authentication bypass. Use `localhost`, which browsers treat as a secure context for development cookies.

## Features

- Today: create, edit, move, reorder, archive, filter, complete, and reopen tasks.
- Editable starter templates and customizable baskets.
- Count-up sessions, pause/resume, atomic switching, end without completion, completion celebration.
- One active session per personal workspace; server timestamp segments survive closing the browser.
- Weekly review in Indianapolis time, including unfinished work and splitting sessions across local week boundaries.
- Secret-link access, one-year HttpOnly/Secure cookie, no account, no paid AI service.
- Installable manifest, static-only service worker, optional sound and screen wake lock.

## Verification

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Browser and API tests require a **disposable local database**, a running dev server, and Chromium (`npx playwright install chromium`). Run `node tests/browser.mjs`, `node tests/api.mjs`, and `node tests/sync-browser.mjs` in that order. They create QA records; do not run against a populated personal database. Browser tests expect the original empty task list and use a local key, never production credentials.

See `docs/VERIFICATION.md` for the tests performed and remaining device checks.

## Production access and deployment

Reuse the project in `.openai/hosting.json`. Publish using the Sites workflow; generated SQL under `drizzle/` creates the D1 tables before Worker upload. Only the shell is publicly accessible. Every data API validates the app's private-access cookie. There is no client-selected workspace identifier.

Set the sensitive runtime variable `ACCESS_KEY_HASH` to the lowercase SHA-256 hex digest of a randomly generated 32-byte base64url key (43 characters). The device link is `https://your-host/#key=YOUR_KEY`. Keep the raw key outside source control. Changing the hash and deploying invalidates all previously issued cookies. The fragment is removed immediately and exchanged through a same-origin POST. Local `.dev.vars`, `.private/`, and generated runtime files are ignored.

If an old owner-scoped workspace is detected, the app fails closed instead of creating a competing workspace or merging records. Back up D1 and inspect all workspaces before migration. With exactly one verified legacy workspace and no `personal` row, update its `owner_id` and matching mutation receipts to `personal` together in a database transaction. Multiple legacy workspaces require an explicit selection; never merge them automatically. No legacy production database existed for this build.

## Important behavior

Timer time measures how long the timer runs. Paused time is excluded. Closing the app does not stop it. Tasks start empty; templates are not scheduled automatically. Archived tasks retain session history. Basket changes affect future sessions only. Renames keep the same basket identity. A stale revision produces a conflict instead of silently overwriting another device.

Unknown write outcomes retain the same request ID (including across a tab reload via session storage) and block dependent changes until retry. Polling pauses when hidden and refreshes on foreground/reconnect. Offline editing and background alarms are intentionally outside v1.

The current product requirements are in `docs/HANDOFF_PLAN.md`. Mascots are original generated illustrations, not official Ronaldo assets. Nunito is distributed under the SIL Open Font License in `public/fonts/OFL.txt`.
