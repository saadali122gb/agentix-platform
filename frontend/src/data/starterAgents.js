/** Predefined agents a new workspace can install with one click. */
export const STARTER_AGENTS = [
  {
    name: 'Lead Generation & Outbound',
    category: 'offensive',
    description:
      'Automatic prospect outreach and initial qualification across email and LinkedIn.',
    model: 'claude-opus-4-8',
    instructions:
      'Draft personalised outbound messages and qualify inbound prospects. Never promise pricing or coverage; hand qualified leads to a human.',
    tools: ['CRM lookup', 'Send email'],
    guardrails: ['No binding quotes', 'Opt-out honoured'],
    status: 'active',
    runs_today: 142,
    success_rate: 0.87,
  },
  {
    name: 'Intent Tracking & Renewals',
    category: 'offensive',
    description:
      'Analyses CRM data to track renewal dates and surface cross-sell / upsell opportunities.',
    model: 'claude-opus-4-8',
    instructions:
      'Analyse CRM data to find upcoming renewals and cross-sell/upsell signals. Surface opportunities; do not contact customers without approval.',
    tools: ['CRM lookup'],
    guardrails: ['Licensed human approval for advice'],
    status: 'active',
    runs_today: 63,
    success_rate: 0.91,
  },
  {
    name: 'Workflow & Task Management',
    category: 'defensive',
    description:
      'Automates reminders, follow-ups and calendar scheduling for brokers and PMs.',
    model: 'gemini-flash-lite-latest',
    instructions:
      'Automate reminders, follow-ups and scheduling. Confirm before creating or modifying calendar events.',
    tools: ['Schedule meeting', 'Slack notify'],
    guardrails: ['Read-only calendar by default'],
    status: 'active',
    runs_today: 311,
    success_rate: 0.96,
  },
  {
    name: 'Automated Data Entry',
    category: 'defensive',
    description: 'Extracts data from customer interactions and updates CRM records.',
    model: 'gemini-flash-lite-latest',
    instructions:
      'Extract structured data from interactions and update CRM records. Flag low-confidence extractions for human review.',
    tools: ['CRM update'],
    guardrails: ['Human review on low confidence'],
    status: 'active',
    runs_today: 198,
    success_rate: 0.93,
  },
  {
    name: 'Internal Virtual Assistant',
    category: 'assistant',
    description:
      'Answers staff queries on meetings, invoice status, follow-ups and business metrics.',
    model: 'claude-opus-4-8',
    instructions:
      'Answer staff questions using only data the requesting user is authorized to see.',
    tools: ['Knowledge base search', 'Invoice status'],
    guardrails: ['RBAC-scoped data access'],
    status: 'active',
    runs_today: 87,
    success_rate: 0.94,
  },
  {
    name: 'Customer Support Agent',
    category: 'customer',
    description: 'Handles external client questions with strict compliance guardrails.',
    model: 'gemini-flash-lite-latest',
    instructions:
      'Help external customers with general questions and their own policy data only. Never give binding policy advice or sales commitments. Escalate anything requiring licensed judgement to a human broker.',
    tools: ['Knowledge base search'],
    guardrails: ['No policy advice', 'No sales commitments', 'Escalate on doubt'],
    status: 'active',
    runs_today: 254,
    success_rate: 0.9,
  },
]
