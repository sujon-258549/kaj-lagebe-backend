# Kaj Lagbe — Backend API

Express + TypeScript + Prisma backend for the Kaj Lagbe job-portal platform. Powers the public site ([kajlagbe-frontend](../kajlagbe-frontend)) and the admin panel ([kajlagbe.admin](../kajlagbe.admin)).

## Tech Stack

- **Runtime** — Node.js + TypeScript (`tsx` for dev, `tsc` for build)
- **Framework** — Express 5
- **Database** — PostgreSQL via Prisma 7 (`@prisma/adapter-pg`)
- **Auth** — JSON Web Tokens (access + refresh) with `argon2` password hashing
- **Real-time** — Socket.IO
- **Payments** — SSLCommerz
- **AI** — OpenRouter (configured, not yet used in any module)
- **Validation** — Zod

## Quick Start

```bash
# 1. Install
npm install

# 2. Copy env and fill values
cp .env.example .env

# 3. Generate Prisma Client (no DB changes)
npm run generate

# 4. Apply migrations (creates / updates DB tables)
npm run migrate

# 5. Run dev server
npm run dev
```

Default port: `4500` (override with `PORT` in `.env`). Mounted under `/api`.

## NPM Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Watch-mode dev server via `tsx` |
| `npm run build` | Compile TS to `dist/` |
| `npm run start` | Run compiled build |
| `npm run prod` | Run in `NODE_ENV=production` |
| `npm run migrate` | `prisma migrate dev` (interactive) |
| `npm run generate` | Regenerate Prisma Client (safe — no DB touch) |
| `npm run studio` | Open Prisma Studio |
| `npm run create-admin` | Bootstrap a super admin user |
| `npm run create-module` | Scaffold a new feature module |

## Project Structure

```
src/
├── app.ts                       # Express app setup + middleware wiring
├── server.ts                    # HTTP server + Socket.IO bootstrap
├── app/
│   ├── config/                  # dotenv-driven config object
│   ├── middleware/              # activityTracker, globalErrorHandler, validateRequest
│   ├── router/index.ts          # Mounts every module under /api
│   ├── shared/                  # catchAsync, dateRange (range resolver / bucket timeline)
│   ├── utils/                   # auth, jwtHelpers, prismaClient, response, sockets, etc.
│   └── modules/                 # 30+ feature modules — each self-contained:
│       ├── auth/
│       ├── users/
│       ├── job/
│       ├── application/
│       ├── blog/
│       ├── analytics/           # NEW — page-view ingestion + traffic aggregations
│       └── dashboard/           # Restructured into sub-services (see below)
└── prisma/
    └── schema.prisma            # Postgres schema (40+ models)
```

### Dashboard module (restructured)

```
modules/dashboard/
├── dashboard.controller.ts      # Thin HTTP layer for 15 endpoints
├── dashboard.routes.ts          # Grouped routes: /admin/*, /charts/*, /tables/*
├── dashboard.service.ts         # Aggregator that re-exports every sub-service
└── services/
    ├── overview.service.ts      # Role-aware overview (worker / poster / admin)
    ├── admin.service.ts         # Admin KPIs with previous-period delta, growth, funnel
    ├── realtime.service.ts      # Online users + merged live activity feed
    ├── charts.service.ts        # Jobs-by-category, hiring rate, recruitment funnel, salary benchmarks
    └── tables.service.ts        # Recent jobs, top candidates, jobs-with-applicants
```

## API Surface

All routes are mounted under `/api`. Authenticated routes expect `Authorization: Bearer <accessToken>`.

### Core feature modules

| Path | Module |
| --- | --- |
| `/api/auth` | Login / refresh / forgot-password |
| `/api/employ` | Users (workers / posters / employees) |
| `/api/job` | Job CRUD + filters |
| `/api/application` | Job applications |
| `/api/blog` | Blogs |
| `/api/blog-comment` | Blog comments |
| `/api/category`, `/api/sub-category` | Taxonomy |
| `/api/role`, `/api/role-permission`, `/api/department` | RBAC |
| `/api/work-types` | Work-type catalog |
| `/api/subscription`, `/api/payment` | Plans + SSLCommerz checkout |
| `/api/contact`, `/api/review` | Public contact + reviews |
| `/api/notification` | In-app notifications |
| `/api/media`, `/api/folder`, `/api/gallery` | Media library |
| `/api/site-setting`, `/api/system-config` | Runtime configuration |
| `/api/tenant` | Multi-tenancy |
| `/api/activity-log`, `/api/error-log` | Audit + error trail |

### Dashboard endpoints

| Path | Description |
| --- | --- |
| `GET /api/dashboard/overview` | Role-aware personal overview (any role) |
| `GET /api/dashboard/admin/kpis?range=` | KPI batch with previous-period delta |
| `GET /api/dashboard/admin/growth?range=` | Time-series of users / jobs / applications |
| `GET /api/dashboard/admin/funnel?range=` | Visitors → Signups → Applied → Hired |
| `GET /api/dashboard/admin/recent` | Recent users / jobs / applications / contacts |
| `GET /api/dashboard/charts/jobs-by-category?range=` | Donut chart data |
| `GET /api/dashboard/charts/application-status?range=` | Status breakdown |
| `GET /api/dashboard/charts/hiring-rate?range=` | Accepted / total ratio |
| `GET /api/dashboard/charts/recruitment-funnel?range=` | Application stages |
| `GET /api/dashboard/charts/salary-benchmarks` | Avg salary by experience level |
| `GET /api/dashboard/tables/recent-jobs?range=&limit=` | Latest jobs + applicant counts |
| `GET /api/dashboard/tables/top-candidates?range=&limit=` | Top applicants per period |
| `GET /api/dashboard/tables/jobs-with-applicants?range=&limit=` | Jobs + their recent applicants |
| `GET /api/dashboard/online` | Online users + live sessions |
| `GET /api/dashboard/live-feed?limit=` | Merged signup / application / contact feed |

### Analytics endpoints

| Path | Description |
| --- | --- |
| `POST /api/analytics/track` | **Public** — page-view ingestion (no auth required) |
| `GET /api/analytics/traffic?range=&source=` | Page views, sessions, unique users + delta |
| `GET /api/analytics/timeseries?range=&source=` | Bucketed traffic time-series |
| `GET /api/analytics/top-pages?range=&limit=` | Most-viewed paths |
| `GET /api/analytics/geo?range=&limit=` | Country breakdown |
| `GET /api/analytics/devices?range=` | Device type breakdown |
| `GET /api/analytics/browsers?range=` | Browser breakdown |
| `GET /api/analytics/os?range=` | OS breakdown |
| `GET /api/analytics/referrers?range=&limit=` | Top referring URLs |
| `GET /api/analytics/live` | Live visitor count (last 5 min) |

`range` accepts: `today`, `yesterday`, `this-week`, `last-week`, `this-month`, `last-month`, `this-year`, `all`.

## Page-View Tracking

The `PageView` model captures every page render from the admin panel (and any frontend that calls `/api/analytics/track`). Each row stores:

- `sessionId`, optional `userId`
- `path`, `fullUrl`, `title`, `referrer`, UTM params
- Parsed `device` / `browser` / `os` (from user-agent, no external dependency)
- `ip`, `country`, `city`, `region` (geo lookup is a future step)
- `isBot`, `isUnique` (first view of the session today), `source` tag
- `durationMs` of the previous page (sent on next navigation)

The `analytics/track` endpoint is intentionally skipped by the activity-tracker middleware to avoid log recursion.

## Environment Variables

See `.env.example`. Key entries:

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `PORT` | HTTP port (default 4500) |
| `ACCESS_SECRET`, `ACCESS_EXPIRE` | JWT access token signing + TTL |
| `REFRESH_SECRET`, `REFRESH_EXPIRE` | JWT refresh token signing + TTL |
| `COOKIE_DOMAIN` | Cookie scope (e.g. `.localhost` for dev) |
| `STORE_ID`, `STORE_PASSWORD`, `STORE_NAME` | SSLCommerz credentials |
| `SUCCESS_URL`, `FAIL_URL`, `CANCEL_URL`, `IPN_URL` | Payment redirect URLs |
| `OPENROUTER_API_KEY` | OpenRouter (AI) — not yet wired into any module |

## CORS

Allowed origins (in `src/app.ts`): `http://localhost:3000`, `:5173`, `:4800`, `:4801`. Adjust the array there for staging / production.

## Conventions

- **Module skeleton:** every feature has `<name>.routes.ts`, `<name>.controller.ts`, `<name>.service.ts`, optional `<name>.constant.ts`. Use `npm run create-module` to scaffold.
- **Errors:** throw `ApiError(statusCode, message)` — `globalErrorHandler` formats them and writes to `error_logs`.
- **Activity logs:** every authenticated request goes through `activityTracker` and is persisted in `activity_logs` (skip-list configured in `utils/activityLogger.ts`).
- **Dates:** use `shared/dateRange.ts` (`resolveRange`, `previousRange`, `buildBucketTimeline`, `bucketKey`, `bucketLabel`) for any time-series / KPI work — keeps charting consistent.
- **No destructive CLI without approval** — never run `prisma migrate reset` / `db push` against shared databases.
