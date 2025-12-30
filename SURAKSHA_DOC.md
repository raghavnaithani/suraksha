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

## User & Developer Flows (Feature-by-feature)

Below are step-by-step flows written from the user's perspective together with the corresponding developer checks and expected results. Use these as test scripts or documentation for testers.

1) App entry / Home
- User flow:
  - Open `/` in a browser (http://localhost:5173).
  - See the app header, navigation, and the Home screen contents.
  - Toast area and floating SOS button should be present.
- Expected user result:
  - Page loads without the Vite error overlay.
  - Navigation links (Login, Verify, SOS, Complaints, Assist) are visible and clickable.
- Dev flow / checks:
  - Verify no unresolved import errors in browser console.
  - Confirm `Toaster` component mounted by inspecting page DOM or seeing toasts on actions.

2) Login / Identity Modes
- User flow:
  - Open `/login`.
  - Choose identity mode: `OTP`, `Aadhaar`, `Worker`, or `Anonymous`.
  - Follow on-screen prompts (OTP input, Aadhaar input + consent, or quick anonymous continue).
- Expected user result:
  - OTP mode: after entering the OTP the user is signed in and redirected to Home.
  - Aadhaar mode: Aadhaar number validated client-side, consent modal shown, then masked ID stored for session display (last 4 digits only).
  - Anonymous: limited UI access is permitted; some features (e.g., long-term complaint tracking) are restricted.
- Dev flow / checks:
  - Ensure validation functions in `src/Login.tsx` enforce digit-only Aadhaar and required lengths.
  - Confirm session state updates in `lib/auth-context.tsx` and that ProtectedRoute uses it to gate routes.

3) Verification Terminal
- User flow:
  - Open `/verify`.
  - Use demo buttons (GREEN/YELLOW/RED) to simulate verification results or enter search parameters and run a verification.
- Expected user result:
  - A result panel shows worker info, trust score, risk flags, and human-friendly guidance.
  - No crashes — when backend is missing the UI displays a mock result with `requestId` starting with `mock-`.
- Dev flow / checks:
  - `lib/use-api.ts` returns a deterministic mock for `/api/verify` when network requests fail.
  - Confirm event `apiPost` or verification-specific events are recorded in `app_event_log`.

4) Quick SOS (floating button + /sos)
- User flow:
  - On any page, click the floating SOS button (bottom-right) or navigate to `/sos`.
  - Fill the minimal required fields and tap Submit.
- Expected user result:
  - If online and backend reachable: toast shows "SOS sent"; no local queue entry.
  - If offline or backend fails: toast shows "SOS queued"; queue badge increments and entry saved to `suraksha_sos_queue`.
- Dev flow / checks:
  - Inspect localStorage: `localStorage.getItem('suraksha_sos_queue')` contains new entry when offline.
  - Event logger records `apiPost_sos_request` and on failure `apiPost_sos_enqueue_failed` or `apiPost_sos_queued`.
  - `src/lib/sos-queue.ts` returns queue length and implements `enqueue`, `flushQueue`, `startProcessor`.

5) Assisted Emergency Reporting (`/assist`)
- User flow:
  - Navigate to `/assist`.
  - Step 1: enter Location → Next.
  - Step 2: enter Description and optional Contact → Send SOS.
  - Step 3: confirmation and optional "Report another".
- Expected user result:
  - Stepper advances; toast shows success (or queued) and final confirmation displayed.
  - Event `assisted_sos_sent` recorded.
- Dev flow / checks:
  - `src/components/assist/AssistedReport.tsx` calls `apiPost('/api/sos')` and handles both network success and queued fallback paths.
  - Confirm dynamic import to `lib/event-logger` logs the event successfully.

6) SOS Queue Inspector (`/sos/queue`)
- User flow:
  - Open `/sos/queue` to view queued entries.
  - Optionally flush or remove items (if controls exist).
- Expected user result:
  - A list of queued items with timestamps, payload preview and count.
  - Badge on floating SOS button reflects queue length.
- Dev flow / checks:
  - Verify `suraksha_sos_queue` in localStorage matches UI list.
  - When online, calling `flushQueue()` (automatically or manually) POSTs entries and removes them on success.

7) Complaints (index + dynamic `ComplaintForm`)
- User flow:
  - Open `/complaints` to see list of complaint types.
  - Click "Start" on a type → navigates to `/complaints/new/:typeId` and shows a dynamic form.
  - Fill fields and Submit.
- Expected user result:
  - The form shows schema title/description and appropriate inputs (text, textarea, date, select, phone).
  - Toast "Complaint submitted" on success; or "Submission failed" when offline with fallback behavior.
- Dev flow / checks:
  - `src/lib/complaint-types.ts` defines `COMPLAINT_TYPES` and field schemas.
  - `src/components/complaints/ComplaintForm.tsx` renders fields dynamically and posts to `/api/complaints` via `apiPost`.
  - Event `complaint_submitted` is recorded in `app_event_log` with payload containing `type` and `values`.

8) Event Log / Dev logs (`/dev/logs`)
- User flow:
  - Open `/dev/logs` (protected route) to view chronological client-side events.
  - Optionally download or clear logs.
- Expected user result:
  - Events show timestamp, type, and payload (SOS queued, flush attempts, complaints, verify actions).
- Dev flow / checks:
  - Confirm `src/lib/event-logger.ts` persists events under `app_event_log` and emits `appEventLogged` for real-time UI updates.
  - The event list UI reads `getEvents()` and supports `clearEvents()` and `downloadEvents()` operations.

9) Toasts & Notifications
- User flow:
  - Actions like sending SOS, submitting complaints, or verification produce a short toast message.
- Expected user result:
  - Single toast visible (TOAST_LIMIT = 1) with title and optional description.
  - Toast includes gentle guidance (e.g., "Saved locally and will retry").
- Dev flow / checks:
  - Verify `components/ui/use-toast.ts` exposes `useToast()` and `toast()` helpers.
  - Inspect memory state and dispatched toasts in the in-memory store while testing.

---

## How to Use These Flows for Testing (Checklist)
- Manual test steps (one-liners):
  - Home load: open `/` → expect header + no overlay.
  - Identity: `/login` → test OTP, Aadhaar (consent), Anonymous.
  - Verify: `/verify` → click GREEN/YELLOW/RED → see result card.
  - SOS quick: Click floating SOS → submit → check toast and `suraksha_sos_queue` when offline.
  - Assisted: `/assist` → complete 3-step wizard → confirm toast & event.
  - Queue inspector: `/sos/queue` → view items → go online → expect auto-flush.
  - Complaints: `/complaints` → Start → fill form → submit → check event log.
  - Dev logs: `/dev/logs` → verify events present.

  ## Header Navigation (Top Bar)

  - Where you see it:
    - The header/top navigation is rendered by `components/Layout.tsx` and appears on pages wrapped with `Layout` (for example: `/`, `/sos`, `/assist`, `/complaints`, `/sos/queue`, `/dev/logs`, `/verify`, `/rights`, `/dashboard`).
    - Pages that do NOT use `Layout` (for example `/login`, `/pwa/anonymous`, `/sos-anonymous`) will not show the top bar.

  - Buttons/links available in the top bar:
    - Home — `/`
    - SOS — `/sos`
    - Assist — `/assist`
    - Complaints — `/complaints`
    - Verify — `/verify`
    - Rights — `/rights`
    - Dashboard — `/dashboard`
    - Dev Logs — `/dev/logs` (on the right side)

  - Notes for users:
    - The floating SOS button (bottom-right) is separate and always present when `Layout` is used.
    - Use the top bar for quick navigation during testing and demos.


## Dev Notes: Where to look in code
- `lib/use-api.ts` — central `apiPost` with mocks for `/api/verify` and delegate for `/api/sos`.
- `src/lib/sos-queue.ts` — queue manager (enqueue, getQueueLength, flushQueue, startProcessor)
- `src/lib/event-logger.ts` — persistent client event log
- `src/lib/complaint-types.ts` — complaint schema definitions and field types
- `src/components/*` — UI components (Layout, SOS button, ComplaintForm, AssistedReport, Toaster)

## Common Troubleshooting Steps (for testers)
- If you see a Vite overlay complaining about unresolved import:
  - Note the file path and missing module. Many imports use aliases `@lib/*` mapped to `lib/*` in `tsconfig.json` — ensure the import matches either `@lib/...` or `../..` relative path to existing file.
  - Hard-refresh the page and restart the dev server if HMR doesn't clear the overlay.
- If queued items are not flushing when online:
  - Check console for `flush_on_online_failed` events.
  - Inspect `suraksha_sos_queue` and run `flushQueue()` from the console by importing the module in dev tools if needed.

---

If you'd like, I can now:
- Add a short printable tester checklist file (`TESTING_GUIDE.md`) with the above steps condensed. 
- Commit these doc changes and stage them for your review. 

Tell me which of those you want next (create checklist, commit & push, or continue implementing Contextual Warnings). 

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
