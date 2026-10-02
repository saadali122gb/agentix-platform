import { AGENTS } from '../agents/index.js'

// Mock runtime metrics so GET /metrics returns data before telemetry exists.
const perAgentRuns = {
  'lead-gen': { runsToday: 142, successRate: 0.87 },
  renewals: { runsToday: 63, successRate: 0.91 },
  workflow: { runsToday: 311, successRate: 0.96 },
  finance: { runsToday: 0, successRate: 0.89 },
  'data-entry': { runsToday: 198, successRate: 0.93 },
  assistant: { runsToday: 87, successRate: 0.94 },
  'customer-facing': { runsToday: 254, successRate: 0.9 },
}

export function mockMetrics() {
  const stats = AGENTS.map((a) => perAgentRuns[a.id] || { runsToday: 0, successRate: 0 })
  const runsToday = stats.reduce((s, x) => s + x.runsToday, 0)
  const avgSuccessRate = stats.reduce((s, x) => s + x.successRate, 0) / stats.length
  return {
    activeAgents: stats.filter((x) => x.runsToday > 0).length,
    totalAgents: AGENTS.length,
    runsToday,
    avgSuccessRate: Number(avgSuccessRate.toFixed(3)),
    guardrailBlocks: 34,
    openRenewals: 112,
  }
}
