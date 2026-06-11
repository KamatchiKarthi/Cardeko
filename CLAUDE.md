# Cardeko — Claude Code Context Guide

## Platform Core Idea

Cardeko is a **car research platform** that helps confused buyers find the right car.

**The problem**: Too many cars, too many options, no easy way to decide.
**The solution**: A structured dataset of makes, models, variants, specs, mileage, safety ratings, and owner reviews — combined with smart filtering and comparison so buyers can go from "I don't know what to buy" to a confident shortlist.

**Primary user journey**: Buyer arrives with a budget + vague need → filters by body type / fuel type / seating / safety → reads specs + owner reviews → compares 2–3 variants → makes a decision.

**Key data entities** (all in MongoDB `cardeko` database):
| Collection | Purpose |
|---|---|
| `cars` | **Primary entity** — one doc per variant/year, fully denormalized for fast filtering |
| `carmakers` | Brand metadata (logo, country, founded) |
| `carmodels` | Model-level grouping under a make (body type, segment) |
| `safetratings` | NCAP / IIHS test results per variant |
| `reviews` | Owner reviews with sub-ratings (comfort, performance, value, etc.) |

**Design principle**: The `Car` collection is the main search surface. All critical fields (price, fuel type, mileage, safety stars, features, tags) are embedded directly for O(1) indexed queries. Normalization (CarMake, CarModel) exists for admin/CMS use, not for buyer-facing queries.

## Project Overview

Full-stack car research monorepo (Turborepo + npm workspaces).

- **Web**: Vite + React 18 + TypeScript — `apps/web`
- **Server**: Express + TypeScript + MongoDB — `apps/server`
- **Shared packages**: `packages/types`, `packages/eslint-config`, `packages/prettier-config`

## Monorepo Commands

```bash
npm run dev          # run all apps in parallel (turbo dev)
npm run build        # build all apps (respects dependency order)
npm run lint         # lint all workspaces
npm run type-check   # tsc --noEmit across all workspaces
npm run format       # prettier write
```

Run a single workspace: `npm run dev --workspace=apps/server`

## Web Architecture (`apps/web/src/`)

```
main.tsx              ← Vite entry: <Provider store> → <App />
App.tsx               ← BrowserRouter + Routes
styles/globals.css    ← Tailwind directives + CSS design tokens (:root vars)
store/
  index.ts            ← Redux store, RootState, AppDispatch, typed hooks
  api/index.ts        ← RTK Query createApi (tagTypes: Car, Review, CarMake, CarModel)
  slices/             ← compareSlice, shortlistSlice
features/
  cars/carsApi.ts     ← all /cars collection + recommend + detail hooks
  reviews/reviewsApi.ts ← getCarReviews, createReview
components/home/      ← HeroSection, HomeStatsBar, TrendingThisWeek, PopularBrands, etc.
layouts/
  RootLayout.tsx      ← sticky header + <Outlet /> + SiteFooter
pages/
  HomePage.tsx        ← full home flow (hero → stats → trending → brands → upcoming → premium → budget)
  NotFoundPage.tsx    ← 404
components/ui/
  Button.tsx          ← variant: primary/secondary/ghost/danger; size: sm/md/lg; loading state
  Card.tsx            ← padded + elevated props
  Badge.tsx           ← variant: default/accent/success/warning/error/info
```

**Design token flow**: CSS custom properties defined in `globals.css :root` → consumed by `tailwind.config.ts` color/radius/shadow keys → used as Tailwind utility classes in components.

**Dev proxy**: Vite proxies `/api/*` → `http://localhost:<PORT>` where `PORT` is read from `apps/server/.env` (defaults to `3001`). Restart the Vite dev server after changing `PORT`.

**Adding a new page:**

1. Create `src/pages/<Name>Page.tsx`
2. Add `<Route path="/<path>" element={<NamePage />} />` in `App.tsx`

**Adding a new API feature:**

1. Create `src/features/<name>/<name>Api.ts` using `baseApi.injectEndpoints()`
2. Export typed hooks from the same file

## Cars API (`/api/cars`)

| Method | URL                    | Query / Body                                  | Description                                                |
| ------ | ---------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| GET    | `/cars`                | See `CarSearchParams` in `packages/types`     | Filtered + paginated car list                              |
| GET    | `/cars/popular`        | `limit` (1–50, default 10)                    | All-time top by popularity                                 |
| GET    | `/cars/trending`       | `limit`                                       | Top cars updated in last 7 days                            |
| GET    | `/cars/premium`        | `limit`                                       | Cars ≥ ₹20L or luxury segment                              |
| GET    | `/cars/budget`         | `limit`                                       | Cars ≤ ₹10L                                                |
| GET    | `/cars/upcoming`       | `limit`                                       | Future launch dates / newest fallback                      |
| GET    | `/cars/stats`          | —                                             | Platform summary (counts, price range, safety)             |
| GET    | `/cars/brands/popular` | `limit`, `bodyType`                           | Brands ranked by popularity with top models                |
| GET    | `/cars/recommend`      | `RecommendParams`                             | Top-5 cars scored by preferences (`_matchPercent` on each) |
| GET    | `/cars/:id`            | —                                             | Full car detail (increments popularity)                    |
| GET    | `/cars/:id/reviews`    | `page`, `pageSize`, `sortBy` (newest\|rating) | Paginated reviews                                          |
| POST   | `/cars/:id/reviews`    | `CreateReviewPayload`                         | Submit review (409 if duplicate userId)                    |

**Frontend hooks** (all in `features/cars/carsApi.ts` + `features/reviews/reviewsApi.ts`):
`useGetCarsQuery`, `useGetPopularCarsQuery`, `useGetTrendingCarsQuery`, `useGetPremiumCarsQuery`, `useGetBudgetCarsQuery`, `useGetUpcomingLaunchesQuery`, `useGetHomeStatsQuery`, `useGetPopularBrandsQuery`, `useGetRecommendationsQuery`, `useGetCarByIdQuery`, `useGetCarReviewsQuery`, `useCreateReviewMutation`

## Server Architecture (`apps/server/src/`)

```
index.ts          ← entry: loads dotenv, calls bootstrap()
app.ts            ← express setup: helmet, cors, routes, error handlers
config/env.ts     ← Zod-validated env (crashes at startup if invalid)
db/mongoose.ts    ← connectDB / disconnectDB / getDBStatus
middleware/
  errorHandler.ts ← AppError class, errorHandler, notFoundHandler
routes/
  health.route.ts ← GET /api/health — returns db + uptime status
```

**Startup order**: `dotenv/config` → `env.ts` validates → `connectDB()` → `app.listen()`

## Environment Variables (server)

Defined and validated in `apps/server/src/config/env.ts` via Zod.
Copy `.env.example` → `.env` before running.

| Variable      | Required | Default                 |
| ------------- | -------- | ----------------------- |
| `NODE_ENV`    | no       | `development`           |
| `PORT`        | no       | `3001`                  |
| `MONGODB_URI` | **yes**  | —                       |
| `CORS_ORIGIN` | no       | `http://localhost:3000` |

**Never add raw `process.env.X` calls** — always import from `config/env.ts`.

## Shared Types (`packages/types/src/index.ts`)

Core interfaces: `Car`, `User`, `ApiResponse<T>`, `PaginatedResponse<T>`, `CarSearchParams`.
Build before other packages: `npm run build --workspace=packages/types`

## Code Conventions

- No semicolons, single quotes, 2-space indent (enforced by `@cardeko/prettier-config`)
- Import order: builtin → external → internal → parent → sibling (enforced by eslint-config)
- Use `type` imports for TypeScript-only types: `import type { Foo } from '...'`
- Prefix unused params with `_` (e.g. `_req`, `_next`)
- All env access via `env` object from `config/env.ts`, never raw `process.env`
- Errors: throw `AppError(statusCode, message)` — picked up by `errorHandler` middleware

## Key Patterns

**Adding a new route module:**

1. Create `src/routes/<name>.route.ts` exporting a `Router`
2. Mount in `src/app.ts` under `/api/<name>`

**Adding a new Mongoose model:**

1. Create `src/models/<name>.model.ts`
2. Define schema + export the model and its TypeScript interface

**Adding env variables:**

1. Add to `.env.example` (with placeholder value)
2. Add to the Zod schema in `src/config/env.ts`
3. Never access outside `config/env.ts`

## Context Window Tips

- Start exploration from `src/app.ts` to see all mounted routes
- Check `src/config/env.ts` for all accepted environment config
- `getDBStatus()` in `db/mongoose.ts` is the single source of truth for DB health
- All unhandled errors bubble to `errorHandler` in `middleware/errorHandler.ts`
- When adding features, types shared with the web app belong in `packages/types`
