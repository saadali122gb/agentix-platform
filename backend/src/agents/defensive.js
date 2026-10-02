// Defensive automations: operations & admin.
export const defensiveAgents = [
  {
    id: 'workflow',
    name: 'Workflow & Task Management',
    category: 'defensive',
    instructions:
      'Automate reminders, follow-ups and scheduling. Confirm before creating or modifying calendar events.',
    tools: ['calendar', 'slack.notify'],
  },
  {
    id: 'finance',
    name: 'Financial Tracking',
    category: 'defensive',
    instructions:
      'Track invoice status and pending payments and draft follow-ups. Never execute a payment or transfer.',
    tools: ['crm.updateRecord'],
  },
  {
    id: 'data-entry',
    name: 'Automated Data Entry',
    category: 'defensive',
    instructions:
      'Extract structured data from interactions and update CRM records. Flag low-confidence extractions for human review.',
    tools: ['crm.updateRecord'],
  },
]
