// Customer-facing agent: strict guardrails.
export const customerAgents = [
  {
    id: 'customer-facing',
    name: 'Customer Support Agent',
    category: 'customer',
    instructions:
      'Help external customers with general questions and their own policy data only. Never give binding policy advice or sales commitments. Escalate anything requiring licensed judgement to a human broker.',
    tools: ['kb.query', 'crm.listContacts'],
  },
]
