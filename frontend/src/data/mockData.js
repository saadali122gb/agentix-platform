// Mock data powering the dashboard until the cloud backend is connected.
// Shapes mirror what the backend API is expected to return.

export const AGENT_CATEGORIES = {
  offensive: {
    label: 'Offensive (Revenue & Growth)',
    tone: 'emerald',
  },
  defensive: {
    label: 'Defensive (Operations & Admin)',
    tone: 'sky',
  },
  assistant: {
    label: 'Virtual Assistant (Internal)',
    tone: 'violet',
  },
  customer: {
    label: 'Customer-Facing',
    tone: 'amber',
  },
}

export const agents = [
  {
    id: 'lead-gen',
    name: 'Lead Generation & Outbound',
    category: 'offensive',
    description:
      'Automatic prospect outreach and initial qualification across email and LinkedIn.',
    status: 'active',
    runsToday: 142,
    successRate: 0.87,
    guardrails: ['No binding quotes', 'Opt-out honoured'],
  },
  {
    id: 'renewals',
    name: 'Intent Tracking & Renewals',
    category: 'offensive',
    description:
      'Analyses CRM data to track renewal dates and surface cross-sell / upsell opportunities.',
    status: 'active',
    runsToday: 63,
    successRate: 0.91,
    guardrails: ['Licensed human approval for advice'],
  },
  {
    id: 'workflow',
    name: 'Workflow & Task Management',
    category: 'defensive',
    description:
      'Automates reminders, follow-ups and calendar scheduling for brokers and PMs.',
    status: 'active',
    runsToday: 311,
    successRate: 0.96,
    guardrails: ['Read-only calendar by default'],
  },
  {
    id: 'finance',
    name: 'Financial Tracking',
    category: 'defensive',
    description:
      'Monitors invoice status, tracks pending payments and schedules follow-ups.',
    status: 'paused',
    runsToday: 0,
    successRate: 0.89,
    guardrails: ['No payment execution'],
  },
  {
    id: 'data-entry',
    name: 'Automated Data Entry',
    category: 'defensive',
    description:
      'Extracts data from customer interactions and updates CRM records.',
    status: 'active',
    runsToday: 198,
    successRate: 0.93,
    guardrails: ['Human review on low confidence'],
  },
  {
    id: 'assistant',
    name: 'Internal Virtual Assistant',
    category: 'assistant',
    description:
      'Answers staff queries on meetings, invoice status, follow-ups and business metrics.',
    status: 'active',
    runsToday: 87,
    successRate: 0.94,
    guardrails: ['RBAC-scoped data access'],
  },
  {
    id: 'customer-facing',
    name: 'Customer Support Agent',
    category: 'customer',
    description:
      'Handles external client questions with strict compliance guardrails.',
    status: 'active',
    runsToday: 254,
    successRate: 0.9,
    guardrails: ['No policy advice', 'No sales commitments', 'Escalate on doubt'],
  },
]

export const metrics = {
  activeAgents: agents.filter((a) => a.status === 'active').length,
  totalAgents: agents.length,
  runsToday: agents.reduce((sum, a) => sum + a.runsToday, 0),
  avgSuccessRate:
    agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length,
  guardrailBlocks: 34,
  openRenewals: 112,
}

export const activityTrend = [
  { day: 'Mon', runs: 820, blocked: 6 },
  { day: 'Tue', runs: 932, blocked: 4 },
  { day: 'Wed', runs: 901, blocked: 9 },
  { day: 'Thu', runs: 1034, blocked: 5 },
  { day: 'Fri', runs: 1120, blocked: 8 },
  { day: 'Sat', runs: 640, blocked: 2 },
  { day: 'Sun', runs: 580, blocked: 0 },
]

export const recentActivity = [
  {
    id: 1,
    agent: 'Lead Generation & Outbound',
    event: 'Qualified 12 new prospects from inbound forms',
    time: '4 min ago',
    tone: 'emerald',
  },
  {
    id: 2,
    agent: 'Customer Support Agent',
    event: 'Escalated a coverage question to a licensed broker',
    time: '11 min ago',
    tone: 'amber',
  },
  {
    id: 3,
    agent: 'Intent Tracking & Renewals',
    event: 'Flagged 8 policies renewing within 30 days',
    time: '26 min ago',
    tone: 'violet',
  },
  {
    id: 4,
    agent: 'Automated Data Entry',
    event: 'Synced 45 records to Racing Snail CRM',
    time: '38 min ago',
    tone: 'sky',
  },
  {
    id: 5,
    agent: 'Compliance Guardrail',
    event: 'Blocked an unauthorised premium quote in draft reply',
    time: '52 min ago',
    tone: 'rose',
  },
]

export const knowledgeDocs = [
  { id: 'd1', name: 'Commercial Property SOP.pdf', type: 'SOP', chunks: 184, status: 'indexed', updated: '2026-09-28' },
  { id: 'd2', name: 'Auto Policy FAQ.md', type: 'FAQ', chunks: 42, status: 'indexed', updated: '2026-09-30' },
  { id: 'd3', name: 'Broker Onboarding Guide.docx', type: 'Training', chunks: 96, status: 'indexed', updated: '2026-09-25' },
  { id: 'd4', name: 'Liability Coverage Terms.pdf', type: 'Policy', chunks: 231, status: 'processing', updated: '2026-10-01' },
  { id: 'd5', name: 'Claims Handling Playbook.pdf', type: 'SOP', chunks: 158, status: 'indexed', updated: '2026-09-20' },
]

export const integrations = [
  { id: 'racing-snail', name: 'Racing Snail CRM', kind: 'CRM', status: 'connected', detail: 'Primary CRM · 2-way sync' },
  { id: 'outlook', name: 'Outlook', kind: 'Email', status: 'connected', detail: 'Send & track outbound' },
  { id: 'gmail', name: 'Gmail', kind: 'Email', status: 'disconnected', detail: 'OAuth not granted' },
  { id: 'slack', name: 'Slack', kind: 'Chat', status: 'connected', detail: 'Alerts & follow-ups' },
  { id: 'teams', name: 'Microsoft Teams', kind: 'Chat', status: 'disconnected', detail: 'Pending admin approval' },
]
