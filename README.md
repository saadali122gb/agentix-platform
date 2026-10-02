# AI Agent Platform — Insurance & Trades

A centralized SaaS platform to deploy, manage and monitor AI agents for
insurance brokerages (and, later, construction/trades). This repository
currently contains the **frontend dashboard**, which deploys automatically to
**GitHub Pages**. The cloud backend (AI engine, RAG, CRM integrations) is
planned as a separate service — the frontend talks to it via a single
configurable API URL and runs in **demo mode** (mock data) until then.

## What's built

A responsive React dashboard with these pages:

| Page | Purpose |
| --- | --- |
| **Overview** | Active agents, KPIs, 7-day activity chart, recent activity feed |
| **Agents Catalog** | Standardized, pre-built agents by category (filterable) |
| **Custom Builder** | Form to design a custom agent (tools, model, guardrail prompt) with live preview |
| **Knowledge Base** | Upload UI + indexed document list + RAG query box |
| **Integrations** | Racing Snail CRM + Outlook/Gmail/Slack/Teams connection status |
| **Guardrails & RBAC** | Compliance controls, role access matrix, system guardrail prompt |

**Agent categories:** Offensive (revenue & growth), Defensive (operations &
admin), Virtual Assistant (internal), Customer-Facing (guarded).

## Tech stack

- **React 18** + **Vite 5** (static build → GitHub Pages)
- **Tailwind CSS 3** with a lightweight shadcn-style component set
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
4. The live URL appears in the workflow's **deploy** job summary
   (`https://<username>.github.io/<repo>/`).

The Vite `base` is set to `./` (relative assets), so the app works under any
repo subpath without hard-coding the repo name.

## Roadmap

- [x] Frontend dashboard + GitHub Pages deployment
- [ ] Cloud backend (LLM calls, RAG pipeline, Supabase pgvector)
- [ ] Racing Snail CRM integration + custom CRM option
- [ ] Communication webhooks (Outlook, Gmail, Slack, Teams)
- [ ] RBAC + compliance guardrail middleware & output checker
- [ ] Auth and multi-tenant workspaces
