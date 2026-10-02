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

  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  racingSnail: {
    apiUrl: process.env.RACING_SNAIL_API_URL || '',
    apiKey: process.env.RACING_SNAIL_API_KEY || '',
  },

  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  },
}

/** Feature flags derived from which credentials are present. */
export const features = {
  llm: Boolean(config.anthropic.apiKey),
  vectorStore: Boolean(config.supabase.url && config.supabase.serviceRoleKey),
  crm: Boolean(config.racingSnail.apiUrl && config.racingSnail.apiKey),
  slack: Boolean(config.slack.webhookUrl),
}
