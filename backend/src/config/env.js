import 'dotenv/config'

// Embeddings provider. 'gemini' reuses GEMINI_API_KEY so one key powers
// chat + search. 'voyage'/'openai' use EMBEDDINGS_API_KEY.
function embeddingsConfig() {
  const provider = (process.env.EMBEDDINGS_PROVIDER || 'voyage').toLowerCase()
  const defaultModel =
    provider === 'gemini'
      ? 'gemini-embedding-001'
      : provider === 'openai'
        ? 'text-embedding-3-small'
        : 'voyage-3'
  const apiKey =
    process.env.EMBEDDINGS_API_KEY ||
    (provider === 'gemini' ? process.env.GEMINI_API_KEY || '' : '')
  return {
    provider,
    apiKey,
    model: process.env.EMBEDDINGS_MODEL || defaultModel,
    // Only used for mock vectors and the Supabase pgvector column.
    dim: Number(process.env.EMBEDDING_DIM) || 768,
  }
}

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

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-flash-lite-latest',
  },

  llm: {
    // Fallback provider when a model id doesn't indicate one.
    defaultProvider: (process.env.LLM_PROVIDER || '').toLowerCase() ||
      (process.env.ANTHROPIC_API_KEY ? 'anthropic' : process.env.GEMINI_API_KEY ? 'gemini' : 'anthropic'),
  },

  embeddings: embeddingsConfig(),

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
  gemini: Boolean(config.gemini.apiKey),
  embeddings: Boolean(config.embeddings.apiKey),
  vectorStore: Boolean(config.supabase.url && config.supabase.serviceRoleKey),
  crm: Boolean(config.racingSnail.apiUrl && config.racingSnail.apiKey),
  slack: Boolean(config.slack.webhookUrl),
  email: Boolean(config.email.msClientId || config.email.gmailClientId),
}
