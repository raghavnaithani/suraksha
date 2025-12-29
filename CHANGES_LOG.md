# CHANGES_LOG

All modifications made by the assistant to support a mocked verification flow and runtime logging.

## 2025-12-30

- Modified `lib/use-api.ts`: added console logging and a deterministic mocked response for `/api/verify` when the backend is unavailable. This ensures the verification terminal works offline and demo buttons (GREEN/YELLOW/RED) return sensible results.

Files changed:
- `lib/use-api.ts` (modified)

- Modified `src/verify/page.tsx`: added a deterministic `demoResult` hint for local development, plus console logs for verification start/response. This allows demo IDs (NWIR-2024-001234 / 005678 / 007890) to map to GREEN/YELLOW/RED respectively when the backend is not available.


Reason: User reported verification attempts always failing; backend endpoints are not present during local development. A safe mock fallback helps testing and preserves existing behavior when backend is available.

Notes:
- Mocked verification payload matches shape expected by `src/verify/page.tsx`.
- The mock uses `payload.demoResult` if provided; otherwise defaults to `GREEN`.
 
2025-12-30 - SOS + OTP + Verify enhancements
- File: lib/use-api.ts
- Change: Improved mock behavior for `/api/sos` (queued locally to `localStorage` when network send fails). Existing `/api/verify` mock maintained.

- File: src/sos/page.tsx
- Change: Replaced alert with in-app toast notifications; now calls `apiPost('/api/sos', payload)` and reports queued vs sent state.

- File: src/Login.tsx
- Change: Added mock OTP flow (`Send OTP` button), OTP verification using `sessionStorage` (dev-only), Aadhaar 16-digit validation, and toast notification when OTP is sent.

- File: src/verify/page.tsx
- Change: Added `PHONE` and `AADHAAR` verification tabs; verification maps demo phone/aadhaar values to GREEN/YELLOW/RED. Anonymous users are prevented from performing verifications (limited access).

2025-12-30 - SOS queue and UX fixes
- File: lib/use-api.ts
- Change: Bounded local `sos_queue` to 50 entries (prunes oldest entries) and logs trims. This prevents unbounded localStorage growth.

- File: components/Layout.tsx
- Change: Mounted global `Toaster` so in-app toast notifications are visible.

- File: src/sos/queue.tsx
- Change: Added developer SOS queue inspector at `/sos/queue` (protected) to view and clear queued SOS entries.
2025-12-30 - Event logging, queue processor, and dev tools
- File: src/lib/event-logger.ts
- Change: New runtime event logger that writes events to `localStorage.app_event_log`, emits `appEventLogged` events, and supports download/clear.

- File: src/lib/sos-queue.ts
- Change: New sos queue manager with `enqueue`, `flushQueue`, `startProcessor`, `stopProcessor`. Processor auto-retries queued SOS entries and logs events.

- File: components/ui/sos-button.tsx
- Change: Show queued SOS count badge on floating SOS button; subscribes to `sosQueueUpdated` and `storage` events.

- File: components/Layout.tsx
- Change: Initialize background sos processor (30s interval) and added online listener to flush queue when connectivity resumes.

- File: src/dev/logs.tsx
- Change: Added developer event log UI at `/dev/logs` (protected) to view and download runtime event logs.


- File: src/Login.tsx
- Change: OTP mock now shows the actual mock OTP code in a dev toast to help testing.


CHANGES LOG
===========

2025-12-30  - auth-context update
- File: lib/auth-context.tsx
- Change: Added identity-mode fields to `User` type, made `login` accept payload with identity fields, added console logging for login/logout and user changes.
- Reason: Support multiple identity modes (anonymous/otp/aadhaar/worker) and runtime audit logs.

2025-12-30 - Routing and SOS additions
- File: src/App.tsx
- Change: Added public routes `/sos-anonymous` and `/pwa/anonymous` and imports for new pages.

- File: components/Layout.tsx
- Change: Included floating `SosButton` so SOS is accessible globally (non-intrusive).

- File: components/ui/sos-button.tsx
- Change: New file. Floating SOS button component; navigates to `/sos` for logged-in users or `/sos-anonymous` for guests. Includes runtime console logging.

- File: src/sos/page.tsx
- Change: New file. Basic SOS page with a "Send SOS" button (demo-alert) and runtime logging.

- File: src/pwa/anonymous.tsx
- Change: New file. Basic guest PWA landing page with links to SOS and report.

2025-12-30 - Login identity modes

2025-12-30 - Routing fix for SOS

2025-12-30 - SOS & Auth Improvements



2025-12-30 - Anonymous & Verified Route
 - File: components/VerifiedRoute.tsx
 - Change: New component that redirects unauthenticated users to `/login` and anonymous users to `/pwa/anonymous`. This enforces limited access for anonymous identity mode.





