# MoneyUP Mobile Agent Guide

## Basic flow

Run these commands from `mobile/`:

```bash
pnpm install --frozen-lockfile
pnpm start
pnpm android
pnpm ios
pnpm web
pnpm lint
pnpm exec tsc --noEmit
```

There is no `init` script in `package.json`; dependency installation is the initialization step. Copy `.env.template` to a local environment file and configure the `EXPO_PUBLIC_*` API variables before starting Expo.

## Architecture

This is an Expo SDK 54 React Native app using Expo Router, TypeScript, NativeWind, Zustand, Axios, React Hook Form, and Expo SecureStore.

- `app/` is the file-based Expo Router tree.
- `app/auth/` contains unauthenticated routes.
- `app/(money-up-app)/_layout.tsx` checks `useAuthStore` and redirects unauthenticated users to `/auth/login`.
- The authenticated navigation hierarchy is drawer -> stack -> tabs. Configure each navigator in its nearest `_layout.tsx`.
- `core/` contains API clients, feature actions, interfaces, and storage adapters.
- `presentation/` contains Zustand stores, forms, reusable components, and navigation UI.
- `core/index.ts` and `presentation/index.ts` are barrel files for the `@/core` and `@/presentation` imports.

## Repository conventions

- Use the `@/*` path alias for project imports.
- Keep HTTP calls in `core/<feature>/*.actions.ts`; retrieve auth tokens from SecureStore and send Bearer authorization headers.
- Keep async feature state in `presentation/<feature>/store/`, including loading and error state.
- Preserve the existing Zustand persistence and SecureStore auth keys unless changing the auth contract.
- Use `react-hook-form` with the shared `InputControl`, `ErrorMessage`, and `PasswordInput` components for forms.
- Use NativeWind `className` styles. Shared colors are defined in `tailwind.config.js`.
- NativeWind scans `app/`, `components/`, and `presentation/`; update that configuration when adding another source directory.
- Use Expo Router layouts for navigation configuration instead of configuring routes inside screen components.
- Use `expo-haptics` for interaction feedback where the surrounding flow already uses it.

## Validation

For route, store, API, or shared-component changes, run:

```bash
pnpm lint
pnpm exec tsc --noEmit
```

No test runner or test script is currently configured in this mobile package.

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **study-app** (API base `https://8zw887e5.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
