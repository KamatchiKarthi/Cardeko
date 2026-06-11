# CarDeko

> **A car research platform that helps confused buyers find the right car.**

---

## What did you build and why?

Most car buyers in India face the same problem: too many options, too much noise, and no structured way to decide. They land on a manufacturer site, get overwhelmed by spec tables, and end up making gut-feel decisions or relying on YouTube reviews that don't match their budget.

**CarDeko is a structured research tool — not a marketplace.**

The goal is to take a buyer from *"I have ₹8L and I need something safe for the family"* to a confident shortlist in under 5 minutes. The platform does this through:

- A **5-question AI-powered quiz** that builds a personalised shortlist scored by match percentage
- **Filtered browsing** by body type, fuel type, seating, price, safety stars, and more
- **Side-by-side comparison** of up to 3 variants
- **Full spec sheets** with owner reviews, NCAP ratings, mileage data, and feature lists

### What was deliberately cut

These features were scoped out to keep the MVP focused on the core research journey:

| Cut | Reason |
|---|---|
| **Authentication / user accounts** | Adds complexity without improving day-1 research value. State lives in Redux — auth can be layered on top without structural changes. |
| **EMI calculator** | Useful, but derivative. A buyer needs to pick the right car first; financing comes after. |
| **Admin / CMS panel** | The data model (`carmakers`, `carmodels`, `cars`) is already structured for a future admin interface — it was not built because no one is actively publishing listings yet. |
| **Dealer listings / marketplace** | Out of scope. Vision is buyer knowledge, not lead generation. |
| **Animations / transitions** | Time was spent on correctness and architecture. Polish is next. |

---

## Tech stack and why

### Monorepo — Turborepo + npm workspaces

Three packages share one repo: `apps/web`, `apps/server`, `packages/types`. Turborepo gives parallel builds with dependency-aware task ordering. The shared `@cardeko/types` package means TypeScript interfaces are defined once — no drift between what the server sends and what the frontend expects.

### Backend — Express + TypeScript + MongoDB

MongoDB was chosen because the primary query surface is a single denormalized `cars` collection. Every filter field (price, fuel type, body type, safety stars, features) is embedded directly — no joins, no aggregation pipelines for the hot path. Mongoose schemas enforce shape at the application layer; Zod validates environment variables at startup so misconfiguration crashes early, not silently.

### Frontend — Vite + React 18 + TypeScript

| Technology | Why |
|---|---|
| **Vite** | Sub-second HMR, native ESM, proxies `/api` directly to the Express server — no CORS configuration needed in dev. |
| **React 18** | Stable, well-understood. The team already knows it. |
| **Tailwind CSS + CSS design tokens** | CSS custom properties define the token layer (brand colours, radius, shadows). Tailwind maps those tokens to utility classes. Changing the brand colour is a one-line edit in `globals.css`. |
| **Redux Toolkit + RTK Query** | RTK Query eliminates manual loading/error state boilerplate entirely — every API call gets `isLoading`, `isError`, `data` for free, plus automatic cache invalidation via tag types. The Redux slices (`compareSlice`, `shortlistSlice`, `quizSlice`) are the single source of truth for UI state across pages. |
| **React Router v6** | File-based mental model with nested routes. The `RootLayout` wraps all pages with the sticky navbar and compare tray without prop-drilling. |

---

## What was delegated to AI vs. done manually

### Where AI helped most

- **Boilerplate and scaffolding** — Vite config, PostCSS setup, Tailwind token wiring, RTK Query base API setup, Express middleware stack. These are correct-but-tedious patterns where AI produced production-quality output in seconds.
- **Seed data** — Generating 40+ realistic car records with accurate specs (displacement, bhp, torque, mileage, features) across segments from micro to luxury would have taken hours manually. AI produced a seeding script that populated the database with believable data.
- **Type definitions** — The `packages/types` interfaces (`ICar`, `ICarSummary`, `ICarListItem`, `IRecommendedCar`) were drafted by AI against the MongoDB document shape and refined once. No divergence between server models and frontend types.
- **Repetitive component patterns** — Card, Badge, Button variants, skeleton loaders, section headers. Consistent and done fast.

### Where AI got in the way

- **RTK Query `useQueries`** — AI generated a hook (`useCarsByIds`) using `baseApi.useQueries()` which does not exist on a base API with no typed endpoints. Caught by TypeScript; fixed manually to use a dispatch + selector subscription pattern.
- **Import ordering** — AI-generated files occasionally violated the project's `import/order` ESLint rule (external → internal → relative). Fixed with `eslint --fix` but it required a dedicated pass.
- **Specificity over generalisation** — AI tends to add `try/catch` blocks, fallbacks, and defensive checks that the architecture already handles upstream (Zod env validation, RTK Query error states, Express `errorHandler` middleware). These had to be trimmed to keep the code idiomatic.

The net result: AI accelerated the scaffolding and data layer so the team could focus on the things that actually require judgment — data modelling decisions, the quiz scoring algorithm, the comparison UX, and making the filtering feel fast.

---

## If we had another 4 hours

1. **Authentication** — JWT-based auth with a `users` collection. The Redux store is already structured to hold a `currentUser` slice; the server middleware just needs a `requireAuth` guard.
2. **EMI calculator** — Input loan amount, tenure, and interest rate against the selected car's on-road price. Pure frontend, no API needed.
3. **Smarter recommendation algorithm** — Current match score weights budget, body type, fuel type, and seating equally. A better version learns from click-through and shortlist signals to re-rank results.
4. **AI chatbox** — Ask "what's the most fuel-efficient SUV under ₹12L with 5 stars?" and get a structured answer backed by the live `cars` collection via a thin LLM layer.
5. **Performance** — Server: index tuning on `priceExShowroom`, `fuelType`, `bodyType`, `safetyRatingStars` as a compound index. Frontend: route-level code splitting (`React.lazy`), image lazy loading, and `stale-while-revalidate` cache headers on collection endpoints.
6. **Accessibility + WCAG 2.1** — Colour contrast audit (brand accent blue `#2563eb` on white is AA-compliant; amber `#f59e0b` on dark needs checking), focus ring visibility, `aria-label` on icon-only buttons, keyboard navigation for the comparison tray.
7. **Broken image handling** — `CarImage` component already has a gradient fallback; the remaining gap is a CDN check script that flags missing image slugs in the database before they reach production.

---

## Project structure

```
cardeko/
├── apps/
│   ├── web/                  # Vite + React frontend
│   │   └── src/
│   │       ├── components/   # ui/, home/, compare/, explore/, shortlist/
│   │       ├── features/     # cars/, reviews/, quiz/, compare/ (RTK endpoints + utils)
│   │       ├── hooks/        # useCarsByIds, useCompareCars, useShortlistCars
│   │       ├── layouts/      # RootLayout (Navbar + CompareTray + SiteFooter)
│   │       ├── pages/        # HomePage, ExplorePage, ComparePage, CarDetailPage, …
│   │       ├── store/        # Redux store, RTK Query base API, slices
│   │       └── styles/       # globals.css (design tokens + Tailwind)
│   └── server/               # Express + Mongoose backend
│       └── src/
│           ├── modules/      # car/, review/, health/ (routes, controller, service, model)
│           ├── db/           # Mongoose connection + seed script
│           ├── config/       # Zod env validation
│           └── middleware/   # errorHandler, validate
└── packages/
    ├── types/                # Shared TypeScript interfaces (ICar, ICarSummary, …)
    ├── eslint-config/        # Shared ESLint rules
    └── prettier-config/      # Shared Prettier rules
```

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Configure the server
cp apps/server/.env.example apps/server/.env
# → fill in MONGODB_URI (MongoDB Atlas connection string)

# 3. Seed the database (optional)
npm run seed --workspace=apps/server

# 4. Start both apps
npm run dev
# Server → http://localhost:5000
# Frontend → http://localhost:3000
```

Health check: `GET http://localhost:5000/api/health`
