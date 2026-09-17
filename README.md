# Threat Intelligence Visualizer

A work-in-progress portfolio prototype for presenting threat records through a React dashboard, charts, and a geographic map. It is not a production security platform or a live threat feed.

## What's in the repository

- `frontend/`: React 19, TypeScript, Vite 7, Tailwind CSS, Chart.js and Leaflet. Includes login/registration screens, dashboard components, theme switching and settings.
- `backend/`: Express 5 and TypeScript, PostgreSQL via Sequelize, JWT authentication, and routes for users, threats and analytics.
- `backend/src/services/threatIntelligence.ts`: fixture-based collection methods and scheduling code. Names such as AbuseIPDB and PhishTank identify mock data, not working external integrations.

## Local development

Use a maintained Node.js 22 release (22.12+), npm, and a local PostgreSQL installation. The locked Vite version requires Node 20.19+ or 22.12+; PostgreSQL version compatibility has not been tested. There is no root package or combined startup script.

These are the commands declared by the project, not a verified end-to-end quick start. Read the known limitations below before attempting to run it. Keep the backend in an isolated local environment; it has not been hardened for public access.

1. Create a disposable PostgreSQL database named `threat_intelligence_dev`, owned by your local database role. Configure the role and password below. Startup calls `sequelize.sync({ alter: false })`; no migration or seed command is supplied.
2. Configure and install the backend, from the repository root:

   ```sh
   cd backend
   cp .env.example .env
   # Edit .env: replace DB_PASSWORD and JWT_SECRET, and set your database role.
   # Generate a unique JWT secret locally with: openssl rand -hex 32
   npm ci
   npm run build
   node --env-file=.env dist/server.js
   ```

   `npm start` runs the compiled server but requires environment variables to be supplied externally. The code and `npm run dev` do not load `.env` automatically. For development with explicit loading:

   ```sh
   node --env-file=.env ./node_modules/nodemon/bin/nodemon.js src/server.ts
   ```

   The API defaults to port 3001, with a `GET /health` route. `NODE_ENV` supports `development` and `production` only. All consumed backend settings are documented in `.env.example`; no feed API keys are currently consumed.

3. In a separate terminal, from the repository root:

   ```sh
   cd frontend
   npm ci
   npm run dev -- --host localhost
   ```

   Open http://localhost:5173. The client defaults to `http://localhost:3001/api`; optionally set `VITE_API_URL` in `frontend/.env.local` before starting Vite. Vite exposes `VITE_*` values to the browser: never put secrets there. Default development CORS permits localhost ports 5173 and 3000. The map requests tiles from OpenStreetMap and needs network access.

## Known limitations

- No default account or seed script exists. Historical README demo credentials were documentation only, not a supported login.
- Frontend login sends `email`; backend validation/controller expect `username`. The dashboard also expects nested `overview`, `charts` and `recentActivity` fields, while the backend returns a different, flat payload. These are source-confirmed integration mismatches.
- Threat Management and Advanced Analytics pages are “coming soon” placeholders. Password-reset client methods have no corresponding backend routes.
- Collection methods return static fixtures. Startup does not call the collection scheduler; dashboard/map requests run on mount, not as a live stream. Waiting after startup does not create live feed data.
- The backend's unnamed `app.use('*', ...)` catch-all is incompatible with Express 5 route syntax and needs correction before successful startup. Runtime behavior was not exercised in this review.
- Security work remains: registration role assignment, token lifecycle and fallback signing configuration need review. Production database TLS disables certificate verification and production CORS still contains a placeholder domain. Do not deploy this unchanged or use real credentials/data for demonstrations.

## Build, lint and test status

Run commands inside the indicated package:

| Package | Command | Purpose / current review result |
| --- | --- | --- |
| backend | `npm run build` | TypeScript to `dist/`; blocked locally because `tsc` was not installed |
| backend | `npm test` | Placeholder script; deliberately exits 1 |
| frontend | `npm run build` | TypeScript project build and Vite bundle; blocked locally because `tsc` was not installed |
| frontend | `npm run lint` | ESLint; blocked locally because `eslint` was not installed |
| frontend | `npm run preview -- --host localhost` | Preview an existing build on port 4173; not a production server |

The frontend has no test script. No packages were installed during this documentation review, and neither build success nor functional tests are claimed. A new security workflow scans reachable Git history with redacted Gitleaks output and audits both lockfiles for high/critical advisories. It does not run application tests and has not yet been executed in GitHub Actions.

`node_modules/` is ignored, but the reviewed history still contains tracked backend dependencies. Ignore rules do not remove already tracked files; history cleanup is a separate maintenance task. Keep package lockfiles for reproducible installs.

## License and attribution

Project code is provided under the [MIT License](LICENSE). Original repository authorship by Andile Mushwana (`georgem66`) and contributions recorded in Git history, including `copilot-swe-agent[bot]`, are retained. Backend package-level license metadata is aligned to MIT; dependency licenses are unchanged. OpenStreetMap contributors' attribution remains in the map component; map data, tiles and third-party libraries retain their own terms.
