import 'dotenv/config'

/** Centralized, typed access to environment configuration. */
export const config = {
  port: Number(process.env.PORT) || 8787,
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-8',
  },

  embeddings: {
    // 'voyage' (Anthropic-recommended) or 'openai'
    provider: (process.env.EMBEDDINGS_PROVIDER || 'voyage').toLowerCase(),
    apiKey: process.env.EMBEDDINGS_API_KEY || '',
    model: process.env.EMBEDDINGS_MODEL || 'voyage-3',
    // Must match the vector(N) column dimension in db/schema.sql.
    // voyage-3 = 1024, OpenAI text-embedding-3-small = 1536.
    dim: Number(process.env.EMBEDDING_DIM) || 1024,
  },

  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  racingSnail: {
    apiUrl: (process.env.RACING_SNAIL_API_URL || '').replace(/\/$/, ''),
    apiKey: process.env.RACING_SNAIL_API_KEY || '',
  },

  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  },

  email: {
    // OAuth app identifiers; per-user access tokens are passed per request.
    msClientId: process.env.MS_CLIENT_ID || '',
    gmailClientId: process.env.GMAIL_CLIENT_ID || '',
  },
}

/** Feature flags derived from which credentials are present. */
export const features = {
  llm: Boolean(config.anthropic.apiKey),
  embeddings: Boolean(config.embeddings.apiKey),
  vectorStore: Boolean(config.supabase.url && config.supabase.serviceRoleKey),
  crm: Boolean(config.racingSnail.apiUrl && config.racingSnail.apiKey),
  slack: Boolean(config.slack.webhookUrl),
  email: Boolean(config.email.msClientId || config.email.gmailClientId),
}
