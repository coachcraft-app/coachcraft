# CoachCraft

<div align="center">
  <img src="web/public/images/coach_craft_logo.svg" alt="CoachCraft Logo" width="180">
</div>

CoachCraft is a lightweight coaching toolkit for planning sessions and managing teams.

It’s split into:

- `web/`: Astro + Alpine.js + Tailwind SPA (static build)
- `backend/`: Fastify + GraphQL Yoga + SQLite (Drizzle ORM)

## Features

- Team + player management
- Session scheduling
- Session activities + reusable activity templates (with lists/categories)
- GraphQL API backed by SQLite
- AWS Cognito OIDC authentication in production (optional in local dev)

## Quickstart (local development)

### 1) Backend (GraphQL API)

From `backend/`:

```bash
npm install
npm run dev
```

- API runs on `http://localhost:3000/graphql` by default.
- Note: the web dev server also uses port `3000` by default. If you want to run both at once, start the backend on a different port (example below).

### 2) Web (SPA)

From `web/`:

```bash
npm install
npm run dev
```

- Web dev server runs on `http://localhost:3000`.
- In non-production modes, the SPA loads dummy data and **skips** Cognito + API calls.

## Running the web app against the real backend (production mode)

The SPA only initializes OIDC + GraphQL when running in `production` mode.

From `web/`:

```bash
npm run prod:dev
```

You’ll also need to set the `PUBLIC_*` environment variables listed below.

If you want to run backend + web locally together, a simple setup is:

- **Backend**: `PORT=4000 npm run dev`
- **Web**: `PUBLIC_API_SERVER_URL=http://localhost:4000/graphql npm run prod:dev`

## Configuration

### Backend environment variables

| Variable               | Purpose                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                 | API port (default: `3000`)                                                                                                          |
| `DEV_DB_URL`           | SQLite DB file path (defaults to `:memory:` if unset). In dev, the backend will create a new `*.db` file each run when this is set. |
| `NO_AUTH`              | If set (to any value), disables JWT verification (useful for local testing)                                                         |
| `COGNITO_REGION`       | AWS region for Cognito JWT verification                                                                                             |
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID for JWT verification                                                                                           |

### Web environment variables

| Variable                                | Purpose                                                     |
| --------------------------------------- | ----------------------------------------------------------- |
| `PUBLIC_API_SERVER_URL`                 | GraphQL endpoint URL (e.g. `http://localhost:3000/graphql`) |
| `PUBLIC_COGNITO_PROD_USER_POOL`         | OIDC authority / issuer URL (Cognito User Pool URL)         |
| `PUBLIC_COGNITO_PROD_APP_CLIENT_ID`     | Cognito App Client ID                                       |
| `PUBLIC_COGNITO_POST_AUTH_REDIRECT_URL` | Redirect URL after login                                    |
| `PUBLIC_COGNITO_USER_DATA_SCOPE`        | OIDC scope string for user data                             |

There’s a `web/.env.production` checked in with a couple of production defaults.

## Project layout

```text
.
├─ backend/               # Fastify + GraphQL Yoga API, Drizzle ORM (SQLite)
└─ web/                   # Astro + Alpine.js SPA (static build)
```

## Build

- **Web**: from `web/`, run `npm run prod` (Astro build output goes to `web/dist/`).
- **Backend**: from `backend/`, run `npm run build` (TypeScript build + triggers web build).

## License

MIT (see `LICENSE`).
