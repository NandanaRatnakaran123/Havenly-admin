# CLAUDE.md — Havenly Admin (Frontend)

`havenly-admin` is the internal admin dashboard for Havenly, a real estate site (live client site: https://havenly-drab.vercel.app/, public code in the sibling folder `Havenly-frontned`; that spelling is intentional, don't rename it). Staff use the admin to add and manage property listings and to handle everything the public site collects.

## Next.js version warning

Next.js 16.x with Cache Components. APIs differ from older versions: read the matching guide in `node_modules/next/dist/docs/` before using a Next.js API.

Lessons learned here:
- Middleware is now `src/proxy.ts` (exports `proxy`).
- Client hooks that read runtime data (`usePathname`, `useSearchParams`) must sit inside `<Suspense>` or the build fails with `blocking-prerender-client-hook`. See `SidebarNav` in `components/layout/sidebar.tsx`, and every list page wrapping its table in `<Suspense>`.
- `params` is a Promise. In `[id]` pages, `await` it inside a small async component wrapped in `<Suspense>`.
- No `new Date()` in server components. It is fine inside client event handlers (mutations).

## Tech stack

| Area | Tool |
| --- | --- |
| Framework | Next.js (App Router), React 19, strict TypeScript |
| Styling | Tailwind CSS v4, `clsx` + `tailwind-merge` via `cn()`. Primary colour emerald. |
| UI primitives | Hand-written in `components/ui` (button, input/select/textarea, card, badge, table, skeleton). Confirm dialog uses native `<dialog>`. No Radix/shadcn yet. |
| Tables | `@tanstack/react-table` (server-side sort/filter/pagination) |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Server state | `@tanstack/react-query` |
| Client state | `zustand` (`store/ui.ts`: mobile sidebar, role) |
| Toasts | `sonner` |
| Theming | `next-themes` (class-based dark mode) |
| Icons | `lucide-react` |
| Tests | Vitest + Testing Library + jsdom |

Don't add dependencies without saying why.

## Commands

```bash
npm run dev         # http://localhost:3001 (public site uses 3000)
npm run build       # production build
npm run start       # serve build on :3001
npm run lint
npm run typecheck
npm run format
npm test            # see known issue
```

Status at last check: `typecheck`, `lint` and `build` pass.

**Known issue:** `npm test` fails on this machine with `TypeError: Cannot read properties of undefined (reading 'config')` before any test runs. It also fails in `Havenly-frontned` and with a minimal node-environment config, so it is a Vitest/environment problem, not app code. The tests in `src/lib/lib.test.ts` are written but not yet confirmed passing.

## Project structure

```
src/
├── proxy.ts                         # auth gate: no cookie -> /login?next=..., cookie on /login -> /
├── app/
│   ├── layout.tsx                   # Providers, fonts, robots noindex
│   ├── error.tsx  not-found.tsx  globals.css
│   ├── actions/auth.ts              # loginAction / logoutAction (server actions, httpOnly cookie)
│   ├── (auth)/login/page.tsx
│   └── (dashboard)/                 # AppShell: sidebar + topbar
│       ├── page.tsx                 # overview: counts, listings by type, pending review
│       ├── properties/              # list, new/, [id]/edit/
│       ├── submissions/             # visitor-posted properties: approve (creates draft) / reject
│       ├── requirements/            # "Post your requirement" leads
│       ├── enquiries/               # contact, property, service enquiries, loan call-backs
│       ├── services/                # list, new/, [id]/edit/
│       ├── blog/                    # property guides: list, new/, [id]/edit/
│       ├── users/  settings/
├── components/
│   ├── ui/  shared/  layout/  auth/
│   ├── data-table/                  # DataTable, ResourceTable (URL-driven), RowActions, pagination
│   ├── property/                    # PropertiesTable, PropertyForm
│   ├── tables/                      # other resources' tables and forms
│   └── dashboard/overview.tsx
├── config/  site.ts  nav.ts (roles per item)  options.ts (cities, categories, amenities, ...)
├── data/seed.ts                     # mock data (modelled on the public site)
├── lib/
│   ├── api.ts                       # fetch wrapper (cookie, ApiError)
│   ├── resource.ts                  # createResource(): CRUD client, mock or real API
│   ├── resources.ts                 # propertiesApi, submissionsApi, ... instances
│   ├── settings.ts  query-keys.ts  validations.ts  utils.ts  auth-constants.ts
├── hooks/use-debounce.ts   providers/   store/ui.ts   types/index.ts   test/setup.ts
```

Path alias: `@/*` → `src/*`.

## Data model (mirrors the public site)

`Property`: title, description, price (sale total or monthly rent), type `sale|rent`, category `apartment|villa|house|plot|commercial`, bedrooms, bathrooms, areaSqft, address, locality, city (10 cities in `config/options.ts`), optional Kerala district, image URL, furnishing, possession, amenities[], advertiser name and role (`owner|agent|builder`), `featured`, `verified` ("Verified by Havenly"), `status` `draft|published`, `createdAt`. The public Property ID is derived: `propertyRef(id)` → `HVN1000 + id`.

Other collections: `Submission` (from /post-property), `Requirement` (from /post-requirement), `Enquiry` (contact / property / service / loan call-back), `Service` (legal, registration, building plan), `BlogPost` (a "property guide"), `AdminUser`, `SiteSettings` (support contacts, WhatsApp number).

## Data layer

All backend access goes through `createResource(path, seed, searchKeys)` in `lib/resource.ts`, exposed as `list / get / create / update / remove`.
- `NEXT_PUBLIC_USE_MOCKS` is not `"false"`: in-memory mock using `data/seed.ts` (resets on reload).
- `NEXT_PUBLIC_USE_MOCKS=false`: real calls to `${NEXT_PUBLIC_API_URL}/<path>`. Expected backend contract: `GET /x?page&pageSize&search&status&sort&order` → `{ data, total }`, `GET/PATCH/DELETE /x/:id`, `POST /x`, `GET/PUT /settings`, `POST /auth/login` → `{ token }`.

List pages use `ResourceTable`: page, search, status filter and sort live in the URL (`?page=&q=&status=&sort=&order=`). Row buttons (publish, feature, verify, approve...) are `RowActions` with a `patch`. Approving a submission also creates a draft property (`after` hook in `components/tables/submissions-table.tsx`).

To add a resource: type in `types/`, seed + `createResource` in `lib/resources.ts`, a table in `components/tables/`, a page under `app/(dashboard)/`, a nav entry in `config/nav.ts`.

## Auth and roles

- Login posts to the backend `/auth/login`. In non-production, if the backend is unreachable, `ADMIN_DEV_EMAIL` / `ADMIN_DEV_PASSWORD` from `.env.local` work (see `.env.example`). The token is stored in an `httpOnly` cookie (`AUTH_COOKIE_NAME`). Never use `localStorage` for tokens.
- `proxy.ts` is only an optimistic gate. The backend must enforce permissions on every call.
- Roles `admin | editor | viewer` filter the sidebar via `config/nav.ts`. The role currently defaults to `admin` in `store/ui.ts`; set it from a `/me` call once the backend exists. Hiding nav items is not security.

## Conventions

- Server Components by default; `"use client"` only at leaves (forms, tables, interactive UI).
- kebab-case files, PascalCase components, named exports (default only for route files).
- Tailwind only, `cn()` for conditional classes, `dark:` variants for dark mode.
- No `any`. Forms: `react-hook-form` + `zodResolver`, schemas in `lib/validations.ts`, `valueAsNumber` for number inputs.
- Destructive actions go through `ConfirmDialog`.
- Every page exports `metadata` (title template `%s | Havenly Admin`). The app is `noindex`.

## Environment variables

See `.env.example`: `NEXT_PUBLIC_ADMIN_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCKS`, `AUTH_COOKIE_NAME`, `ADMIN_DEV_EMAIL`, `ADMIN_DEV_PASSWORD`. `.env.local` is git-ignored; never commit secrets.

## Not built yet / next

- Backend API (the admin runs on mock data until then) and a `/me` endpoint for the real role.
- Image upload (properties take an image URL for now), multiple photos per listing.
- User create/invite and role change UI; bulk actions; CSV export.
- Confirm Vitest works on a healthy environment.
- Unknowns about the public site: its `/properties` filters and sort options and the contact form fields were not visible when fetched (client-rendered), so check the sibling code (`Havenly-frontned/src/lib/filters.ts`) before changing the data model.

## Working agreements for Claude

- Run `npm run typecheck && npm run lint && npm run build` after meaningful changes and report real results.
- Keep the admin's types aligned with `Havenly-frontned/src/types/property.ts` and flag mismatches.
- Prefer editing existing files; keep changes scoped. Don't hand-edit `.next/`, `node_modules/` or lockfiles.
