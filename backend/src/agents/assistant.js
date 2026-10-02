// Virtual assistant: internal operations.
export const assistantAgents = [
  {
    id: 'assistant',
    name: 'Internal Virtual Assistant',
    category: 'assistant',
    instructions:
      'Answer staff questions about meetings, invoice status, follow-ups and business metrics using only data the requesting user is authorized to see.',
    tools: ['crm.listContacts', 'kb.query'],
  },
]
