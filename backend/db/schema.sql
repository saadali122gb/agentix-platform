-- Knowledge base schema for Supabase (Postgres + pgvector).
-- Run in the Supabase SQL editor, or via `supabase db` / psql.
--
-- IMPORTANT: the vector dimension below MUST match your embedding model and
-- the EMBEDDING_DIM env var:
--   voyage-3                      -> 1024   (default)
--   OpenAI text-embedding-3-small -> 1536
-- If you change models, change vector(1024) in BOTH places and re-create.

create extension if not exists vector;

create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  content     text not null,
  embedding   vector(1024),
  source      text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- Approximate nearest-neighbour index for cosine distance.
-- Tune `lists` roughly to sqrt(row_count); analyse after bulk loads.
create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index if not exists documents_source_idx on documents (source);

-- Similarity search RPC used by the backend (vectorStore.similaritySearch).
create or replace function match_documents(
  query_embedding vector(1024),
  match_count int default 5
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
    d.id,
    d.content,
    d.source,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where d.embedding is not null
  order by d.embedding <=> query_embedding
  limit match_count;
$$;

-- The backend connects with the service-role key and bypasses RLS.
-- If you also expose this table to the anon/auth client, enable RLS and add
-- policies that enforce your tenant/role scoping:
-- alter table documents enable row level security;
