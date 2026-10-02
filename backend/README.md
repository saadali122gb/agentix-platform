# Backend — AI Agent Platform

Node + Express cloud backend: AI engine, RAG pipeline, CRM integration and the
RBAC / compliance guardrail layer. Designed to deploy to **Render / Vercel /
Cloudflare Workers**. Runs end-to-end in **mock mode** without any API keys, so
the frontend can talk to it immediately in development.

## Run locally

```bash
cd backend
npm install
cp .env.example .env     # optional — fill in keys to leave mock mode
npm run dev              # http://localhost:8787  (node --watch)
```

Point the frontend at it: in `frontend/.env` set
`VITE_API_BASE_URL=http://localhost:8787`.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Status + which features are live (based on configured keys) |
| GET | `/agents` | Agent catalog (internal instructions stripped) |
| POST | `/agents` | Register a custom agent (stub) |
| POST | `/agents/:id/run` | Run an agent turn through the guardrail pipeline |
| GET | `/metrics` | Dashboard KPIs |
| POST | `/kb/query` | RAG query against the knowledge base |

Auth is a stub: send `x-user-role` (`admin` \| `sales` \| `pm` \| `customer`)
and `x-user-id` headers. Defaults to `admin`.

## Structure

```
backend/src/
├── index.js            # server bootstrap
├── app.js              # express app, middleware, route mount
├── config/env.js       # env + feature flags
├── middleware/         # auth, error handler
├── routes/             # agents, metrics, kb
├── agents/             # offensive, defensive, assistant, customer + runner
├── guardrails/         # system prompt, RBAC, compliance, output checker
├── integrations/       # Racing Snail CRM, Slack, email
├── rag/                # vector store (Supabase pgvector) + query pipeline
└── llm/                # Anthropic client
```

## Guardrail pipeline

Every `POST /agents/:id/run` call passes through:

1. **RBAC** — is the caller's role allowed to use this agent category?
2. **System prompt** — base compliance guardrail + agent instructions.
3. **LLM completion** — Anthropic (mock text if `ANTHROPIC_API_KEY` unset).
4. **Output checker** — deterministic regex screen, then an LLM compliance
   review. Fails **closed** (blocks on doubt).

## Next steps

- Real embeddings provider + Supabase `match_documents` RPC and `documents` table
- Racing Snail CRM live endpoints + custom CRM schema
- Outlook (Microsoft Graph) and Gmail senders with OAuth
- Persist custom agents and audit logs
- Replace the auth stub with JWT / session verification
