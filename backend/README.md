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
| POST | `/kb/upload` | Upload PDF/DOCX/TXT/MD/CSV files; parse → chunk → embed → store |
| POST | `/kb/ingest` | Ingest raw text (chunk + embed + store) |
| POST | `/kb/query` | RAG query against the knowledge base |

Auth is a stub: send `x-user-role` (`admin` \| `sales` \| `pm` \| `customer`)
and `x-user-id` headers. Defaults to `admin`.

## Structure

```
backend/
├── db/schema.sql           # Supabase pgvector schema + match_documents RPC
└── src/
    ├── index.js            # server bootstrap
    ├── app.js              # express app, middleware, route mount
    ├── config/env.js       # env + feature flags
    ├── lib/http.js         # fetch wrapper (timeout + JSON + errors)
    ├── middleware/         # auth, error handler
    ├── routes/             # agents, metrics, kb
    ├── agents/             # offensive, defensive, assistant, customer + runner
    ├── guardrails/         # system prompt, RBAC, compliance, output checker
    ├── integrations/       # Racing Snail CRM, Slack, email (Graph + Gmail)
    ├── rag/                # chunk, embed, ingest, vector store, query pipeline
    └── llm/                # Anthropic client + embeddings (Voyage/OpenAI)
```

## Integrations (real, with mock fallback)

Everything runs in **mock mode** until the matching credentials are set; then
the same code paths make real calls. `GET /health` reports which are live.

### RAG / knowledge base (Supabase + pgvector)

1. Create a Supabase project and run **`backend/db/schema.sql`** in the SQL
   editor (creates the `documents` table, ANN index and `match_documents` RPC).
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Set an embeddings provider: `EMBEDDINGS_PROVIDER=voyage` (default) or
   `openai`, plus `EMBEDDINGS_API_KEY` and `EMBEDDINGS_MODEL`.
   **`EMBEDDING_DIM` must match the `vector(N)` dimension in `schema.sql`**
   (voyage-3 = 1024, OpenAI text-embedding-3-small = 1536).
4. Add content:
   - `POST /kb/upload` (multipart, field `files`) — uploads **PDF / DOCX / TXT /
     MD / CSV** (≤20 MB each, 10 at a time); text is extracted with `unpdf`
     (PDF) and `mammoth` (DOCX), then chunked, embedded and stored.
   - `POST /kb/ingest { text, source?, metadata? }` — ingest raw text directly.
   - `POST /kb/query { query }` — embeds the query, retrieves top matches and
     answers grounded in them (citing `[n]`).

### Racing Snail CRM

Set `RACING_SNAIL_API_URL` + `RACING_SNAIL_API_KEY`. The client maps the RBAC
scope to query params on every read. **The REST paths are assumptions** (no
public spec was available) — adjust `src/integrations/racingSnail.js` to the
real API.

### Email (Outlook / Gmail)

Senders use Microsoft Graph and the Gmail API. They require a **per-user OAuth
access token** passed at call time (tokens are per-user and short-lived, so they
are not read from env). Wire the OAuth authorization-code flow into the auth
layer and pass the token to `sendEmail({ ..., provider, accessToken })`.

### Slack

Set `SLACK_WEBHOOK_URL` to post alerts/follow-ups via an incoming webhook.

## Guardrail pipeline

Every `POST /agents/:id/run` call passes through:

1. **RBAC** — is the caller's role allowed to use this agent category?
2. **System prompt** — base compliance guardrail + agent instructions.
3. **LLM completion** — Anthropic (mock text if `ANTHROPIC_API_KEY` unset).
4. **Output checker** — deterministic regex screen, then an LLM compliance
   review. Fails **closed** (blocks on doubt).

## Next steps

- Confirm Racing Snail's real API paths/fields and adjust the client
- OAuth authorization-code flow + token storage/refresh for email
- Persist custom agents and add audit logging
- Replace the auth stub with JWT / session verification
- Enable Supabase RLS policies for tenant/role isolation
