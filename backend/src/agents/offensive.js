// Offensive automations: revenue & growth.
export const offensiveAgents = [
  {
    id: 'lead-gen',
    name: 'Lead Generation & Outbound',
    category: 'offensive',
    instructions:
      'Draft personalised outbound messages and qualify inbound prospects. Never promise pricing or coverage; hand qualified leads to a human.',
    tools: ['crm.listContacts', 'email.send'],
  },
  {
    id: 'renewals',
    name: 'Intent Tracking & Renewals',
    category: 'offensive',
    instructions:
      'Analyse CRM data to find upcoming renewals and cross-sell/upsell signals. Surface opportunities; do not contact customers without approval.',
    tools: ['crm.getRenewals'],
  },
]
