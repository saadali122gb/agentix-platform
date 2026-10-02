# AI Agent Platform — Insurance & Trades

A centralized SaaS platform to deploy, manage and monitor AI agents for
insurance brokerages (and, later, construction/trades).

**Architecture (real product):**
- **Frontend** (React, GitHub Pages) — the app UI.
- **Supabase** (BaaS) — authentication, Postgres database and Row-Level
  Security. The frontend talks to Supabase directly, so auth and agent
  management work on the static site with **no server to host**.
- **Cloud backend** (Node/Express, deploy to Render/Vercel) — the AI engine
  that holds the secret API keys: agent runs (guardrail pipeline) and the
  knowledge-base RAG. Optional; the app runs without it, those AI features
  just stay off until `VITE_API_BASE_URL` is set.

## Setup (make it live)

1. **Supabase** — create a free project, then run
   [`backend/db/schema.sql`](backend/db/schema.sql) in the SQL editor (creates
   profiles, agents, activity, documents + RLS + the signup trigger).
2. **Frontend env** — `cd frontend && cp .env.example .env` and set
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
   Optionally set `VITE_API_BASE_URL` to the deployed backend for AI features.
3. `npm install && npm run dev` → sign up, then **Install starter agents** on
   the Agents Catalog, or build your own.

Without Supabase keys the app shows a setup screen on the login page.

## What's built

A responsive React dashboard with these pages:

| Page | Purpose |
| --- | --- |
| **Auth** | Real email/password sign-up & sign-in, sessions, protected routes (Supabase) |
| **Overview** | Live KPIs, category breakdown and recent activity from your data |
| **Agents Catalog** | Your agents — install starter set, create, pause/resume, delete, **run (chat)** |
| **Custom Builder** | Design an agent (tools, model, guardrail prompt) — saves to the database |
| **Knowledge Base** | Upload PDF/DOCX/TXT, indexed-document list, RAG query (via backend) |
| **Integrations** | Racing Snail CRM + Outlook/Gmail/Slack/Teams connection status |
| **Guardrails & RBAC** | Compliance controls, role access matrix, system guardrail prompt |

Theme: light/dark with a toggle (system-preference default).

**Agent categories:** Offensive (revenue & growth), Defensive (operations &
admin), Virtual Assistant (internal), Customer-Facing (guarded).

## Tech stack

- **React 18** + **Vite 5** (static build → GitHub Pages)
- **Supabase** (`@supabase/supabase-js`) — auth + Postgres + RLS
- **Tailwind CSS 3** (token-based theme, dark mode) with shadcn-style components
- **React Router** (HashRouter — no 404s on refresh/deep links)
- **Recharts** for charts · **lucide-react** for icons

## Project structure

```
ai-agent-platform/
├── frontend/                 # React app (deployed to GitHub Pages)
│   ├── src/
│   │   ├── components/       # UI primitives, layout, cards
│   │   ├── pages/            # Dashboard, Agents, Builder, KB, Integrations, Guardrails
│   │   ├── services/api.js   # Cloud backend client (VITE_API_BASE_URL)
│   │   └── data/mockData.js  # Demo data (replace with live API)
│   └── package.json
└── .github/workflows/deploy.yml   # GitHub Pages deploy (official Pages action)
```

> The `backend/` service (Node/Express or Python/FastAPI, LangChain/LlamaIndex,
> Supabase + pgvector, Racing Snail CRM, guardrail middleware) is the next
> phase and not included yet.

## Run locally

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Build a production bundle:

```bash
cd frontend
npm run build      # outputs frontend/dist
npm run preview    # serve the built bundle locally
```

## Connect a backend (optional)

The UI runs fully in **demo mode** with mock data. To point it at a real
backend, copy the example env file and set the URL:

```bash
cd frontend
cp .env.example .env
# edit .env:
# VITE_API_BASE_URL=https://your-backend.onrender.com
```

For deployed builds, set a repo **Variable** named `VITE_API_BASE_URL`
(Settings → Secrets and variables → Actions → Variables). Leave it unset to
keep demo mode.

## Deploy to GitHub Pages

Deployment is automated via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
using the **official GitHub Pages deployment action**.

1. Create a GitHub repo and push this project to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source =
   GitHub Actions**.
3. Every push to `main` builds `frontend/` and publishes `frontend/dist`.
4. Add repo **Variables** (Settings → Secrets and variables → Actions →
   Variables): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and optionally
   `VITE_API_BASE_URL`. The Supabase anon key is public by design (RLS protects
   data), so a repo Variable is fine.
5. The live URL appears in the workflow's **deploy** job summary
   (`https://<username>.github.io/<repo>/`).

The Vite `base` is set to `./` (relative assets), so the app works under any
repo subpath without hard-coding the repo name.

## Roadmap

- [x] Frontend dashboard + GitHub Pages deployment
- [x] Real auth (Supabase): sign-up/in, sessions, protected routes
- [x] Agent CRUD on Postgres (create/list/pause/delete) with RLS multi-tenancy
- [x] Agent run (chat) through the backend guardrail pipeline
- [x] Cloud backend: LLM, RAG, CRM/Slack/email, document upload parsing
- [ ] Deploy backend to Render/Vercel and wire `VITE_API_BASE_URL` (AI features)
- [ ] KB upload/query scoped to the signed-in user (JWT → backend)
- [ ] Confirm real CRM API spec; OAuth flow + token refresh for email
- [ ] Billing, team workspaces & audit logging
