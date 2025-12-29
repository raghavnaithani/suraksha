# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## PWA and Auth setup (added)

Quick start to test the PWA and the simple login flow added to this project:

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Open http://localhost:5173/login and sign in with any email (this app uses a fake login stored in localStorage).

4. To test PWA offline behavior, build and preview or use Chrome DevTools > Application > Service Workers:

```bash
npm run build
npm run preview
```

Notes:
- The service worker is registered at `/sw.js` and the app includes a `manifest.json` in `/public`.
- Replace the fake login with real API calls in `src/lib/auth-context.jsx` when ready.

UI improvements added:

- Responsive header (`src/components/ui/secure-header.tsx`) and sidebar navigation (`src/components/ui/sidebar-nav.tsx`) for protected pages.
- Improved login visuals (centered card, gradient background, subtle animation) and updated dashboard with cards and quick links.
- Subtle card shadows and font stack updated in `src/globals.css` for better readability.

If you'd like further styling (branding, theming, or a different visual direction such as Material, Minimal, or Tailwind-UI), tell me which option and I will continue iterating.





















public can verify by number, id, by photo
can log complaint with complete forms
see his id card
get all details wa number etc, direct chat,  public helpline number, 
complaint status check
