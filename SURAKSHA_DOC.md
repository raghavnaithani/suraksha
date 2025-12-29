# Suraksha — Developer & User Guide

This document describes the Suraksha app in this workspace: purpose, how to run it, main flows, developer tools, troubleshooting, and where key files live.

---

## Quick start

- Install dependencies (if not already):

```powershell
npm install
```

- Start dev server (foreground):

```powershell
npm run dev
```

- Start dev server detached (so your terminal is free):

```powershell
Start-Process npm -ArgumentList 'run','dev'
```

- Open the app in your browser: http://localhost:5173 (vite may pick another port if 5173 is in use)

Note: Vite shows an interactive prompt in the terminal (press `o` + Enter to open browser, `q` to quit). That's normal.

---

## Overview & Purpose

Suraksha is a React + Vite app with features implemented to demo the "Golden 4" requirements: offline-resilient SOS reporting, identity modes (OTP / Aadhaar / Anonymous / Worker), verification flows, and audit logging. The changes are intentionally additive and non-breaking.

Tech stack: React (TSX), Vite, Tailwind-style UI, React Router.

---

## Major Flows (User-facing)

1. Login / Identity modes
   - Available modes: OTP, Aadhaar, Worker, Anonymous.
   - OTP: developer-mock OTP flow (a toast shows the code during dev). Sending OTP stores a session value and lets you sign in.
   - Aadhaar: client-side validation (digits-only, 16-digit rule enforced) and a consent modal appears before storing/masking.
   - Anonymous: limited features — verification may be blocked and some protected routes disabled.

Files: [src/Login.tsx](src/Login.tsx)

2. Verification
   - `/verify` flow supports demo modes: phone, Aadhaar, etc.
   - If backend `/api/verify` is absent, a deterministic mock returns structured GREEN/YELLOW/RED results for demo IDs.

Files: [src/verify/page.tsx](src/verify/page.tsx), [lib/use-api.ts](lib/use-api.ts)

3. SOS (Emergency) flow
   - Floating SOS button (queued badge shows number of queued items).
   - When network is available the client attempts to POST to `/api/sos`. If network/server fails, the entry is enqueued locally (localStorage) for retry.
   - A background processor attempts periodic flush and also flushes automatically when the browser goes online.
   - Queue is capped (default 50 entries) to avoid unbounded storage.

Files: [src/sos/page.tsx](src/sos/page.tsx), [src/lib/sos-queue.ts](src/lib/sos-queue.ts), [components/ui/sos-button.tsx](components/ui/sos-button.tsx)

4. Notifications / Toaster
   - App uses a Toast provider. During dev the OTP value is shown in a toast for convenience.

Files: [components/ui/toast.tsx](components/ui/toast.tsx), [components/ui/toaster.tsx](components/ui/toaster.tsx)

---

## Developer Tools & Debugging Pages

- Event Log (dev): a protected route that shows stored events and allows download/clear. Events are stored in `localStorage` under key `app_event_log`.
  - Files: [src/dev/logs.tsx](src/dev/logs.tsx), [src/lib/event-logger.ts](src/lib/event-logger.ts)

- SOS Queue Inspector (dev): view queued SOS payloads, clear queue, and trigger manual flush.
  - Files: [src/sos/queue.tsx](src/sos/queue.tsx), [src/lib/sos-queue.ts](src/lib/sos-queue.ts)

---

## Storage Keys & Important Constants

- `app_event_log` — stores recent events (cap 500 records)
- `suraksha_sos_queue` — stores queued SOS entries (cap 50 entries)

You can inspect or clear these via browser DevTools Application > Local Storage, or via dev pages in the app.

---

## Troubleshooting & Common Issues

- White screen / blank app on load:
  - Open browser DevTools Console (F12) — the console shows missing imports or runtime errors. Copy the stack trace and fix missing exports/import names or run `npm install` if package is missing.

- `vite` interactive prompt looks like the server is stuck:
  - This is normal; the server runs in foreground and accepts single-key commands. Use `o` + Enter to open browser, or run the server detached with `Start-Process npm -ArgumentList 'run','dev'` in PowerShell.

- Missing symbol/export errors (e.g., `does not provide an export named X`):
  - Often due to a wrapper re-export mismatch. See `lib/*` wrappers which re-export from `src/lib/*`. If you add a function in `src/lib/*`, export it there and update wrapper in `lib/` if needed.

- Radix/other dependency errors:
  - Run `npm install` and add missing @radix packages (we installed `@radix-ui/react-dialog` and `@radix-ui/react-toast` during debugging).

---

## Files Changed / Important Modules (summary)

- `lib/use-api.ts` — API wrappers, mocking fallback for `/api/verify` and special `/api/sos` delegation to `sos-queue`.
- `src/lib/event-logger.ts` — client event logger (read/write/clear/download).
- `lib/event-logger.ts` — small wrapper re-export that maps to `src/lib/event-logger.ts` for existing import paths.
- `src/lib/sos-queue.ts` + `lib/sos-queue.ts` wrapper — local SOS queue manager with enqueue/flush/processor.
- `components/Layout.tsx` — mounts Toaster and starts SOS background processor; listens for `online` events to flush queue.
- `components/ui/sos-button.tsx` — floating SOS button with queued-count badge.
- `components/ui/toast.tsx` + `components/ui/toaster.tsx` — toast components.

For a full list of edits and rationale, see `CHANGES_LOG.md` in the repo root.

---

## Security & Privacy Notes (quick)

- This repository includes mock/demo handling for Aadhaar and OTP — do not use this in production. Aadhaar handling here is client-only masking + consent modal, *not* a compliant production flow.
- Events and queued entries are stored in `localStorage`. For production, use secure, encrypted storage and backend persistence with proper consent, retention, and deletion policies.

---

## Next recommended improvements

- PWA offline caching and service-worker enhancements (queue reporting for PWA guests).
- Harden retry/backoff for sos-queue with attempt counters and exponential backoff.
- Replace mock OTP/Aadhaar with real backend integration.
- Add unit/integration tests for queue behavior and event logging.

---

If you want, I can:
- Commit these changes with a revertable message.
- Generate a smaller quickstart README for end-users.
- Add automated tests for the SOS queue.

File: [SURAKSHA_DOC.md](SURAKSHA_DOC.md)
