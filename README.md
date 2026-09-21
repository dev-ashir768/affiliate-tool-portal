# Affiliate Tool Portal

Next.js frontend for the affiliate tool. Server routes (BFF) and `proxy.ts` call **affiliate-tool-apis**; the browser talks to this app only.

Sibling backend: [affiliate-tool-apis](https://github.com/dev-ashir768/affiliate-tool-apis) (default `http://localhost:4000`).

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `API_URL` | Recommended | Backend origin (no trailing slash). Default if unset: `http://localhost:4000` |
| `NEXT_PUBLIC_API_URL` | Optional | Same as `API_URL` if `API_URL` is unset |

Resolved in `lib/auth/constants.ts` → `getApiBaseUrl()`.

**Auth cookies** (set by BFF after login/register/refresh; names are fixed, not env):

- `access_token` — httpOnly
- `refresh_token` — httpOnly

There is **no** portal JWT secret. Tokens are issued by the API; the portal stores them in cookies and forwards `Authorization: Bearer` on server-side API calls. Route guards decode the access JWT payload without verifying (API still verifies).

No in-portal API stub: if the backend is down, BFF fetches fail.

## Run with APIs (local)

**1. APIs** (separate clone):

```bash
git clone https://github.com/dev-ashir768/affiliate-tool-apis.git
cd affiliate-tool-apis
cp .env.example .env   # DATABASE_URL, Redis, JWT secrets, CORS_ORIGINS=http://localhost:3000
npm install
npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed
npm run dev            # http://localhost:4000  — health: GET /health
# optional worker: npm run worker
```

**2. Portal** (this repo):

```bash
cp .env.example .env   # API_URL=http://localhost:4000
npm install
npm run dev            # http://localhost:3000
```

APIs `CORS_ORIGINS` must include the portal origin (`http://localhost:3000`). Details: APIs `README.md` and `docs/OPERATOR_RUNBOOK.md`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
