-- ============================================================================
-- Supabase schema for the AI Agent Platform (Postgres + pgvector).
-- Run this in the Supabase SQL editor. Safe to re-run (idempotent-ish).
--
-- Covers: auth profiles, agents, activity log, and the RAG document store,
-- all protected by Row-Level Security so each user only sees their own data.
--
-- Embedding dimension MUST match your model + EMBEDDING_DIM:
--   voyage-3 = 1024 (default), OpenAI text-embedding-3-small = 1536.
-- ============================================================================

create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'admin',  -- admin | sales | pm | customer
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- agents
-- ---------------------------------------------------------------------------
create table if not exists agents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  name          text not null,
  category      text not null,                 -- offensive|defensive|assistant|customer
  description   text,
  model         text not null default 'claude-opus-4-8',
  instructions  text,
  tools         text[] not null default '{}',
  guardrails    text[] not null default '{}',
  status        text not null default 'active', -- active | paused
  runs_today    int not null default 0,
  success_rate  numeric not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists agents_user_idx on agents (user_id);
alter table agents enable row level security;

drop policy if exists "agents_crud_own" on agents;
create policy "agents_crud_own" on agents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- activity log
-- ---------------------------------------------------------------------------
create table if not exists activity (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  agent_name  text,
  event       text not null,
  tone        text not null default 'sky',
  created_at  timestamptz not null default now()
);

create index if not exists activity_user_idx on activity (user_id, created_at desc);
alter table activity enable row level security;

drop policy if exists "activity_crud_own" on activity;
create policy "activity_crud_own" on activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- documents (RAG store)
-- ---------------------------------------------------------------------------
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  content     text not null,
  embedding   vector(1024),
  source      text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists documents_user_idx on documents (user_id);

alter table documents enable row level security;

drop policy if exists "documents_select_own" on documents;
create policy "documents_select_own" on documents
  for select using (auth.uid() = user_id);

-- Inserts/deletes happen from the backend with the service-role key, which
-- bypasses RLS. The backend sets user_id from the caller's verified JWT.

-- Similarity search RPC (used by the backend). Optionally scope by user_id.
create or replace function match_documents(
  query_embedding vector(1024),
  match_count int default 5,
  filter_user uuid default null
)
returns table (
  id uuid,
  content text,
  source text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    d.id, d.content, d.source, d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where d.embedding is not null
    and (filter_user is null or d.user_id = filter_user)
  order by d.embedding <=> query_embedding
  limit match_count;
$$;
