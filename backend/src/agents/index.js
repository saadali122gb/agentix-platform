import { offensiveAgents } from './offensive.js'
import { defensiveAgents } from './defensive.js'
import { assistantAgents } from './assistant.js'
import { customerAgents } from './customer.js'
import { runAgent } from './base.js'

export const AGENTS = [
  ...offensiveAgents,
  ...defensiveAgents,
  ...assistantAgents,
  ...customerAgents,
]

const byId = new Map(AGENTS.map((a) => [a.id, a]))

export function listAgents() {
  // Strip internal instructions from the public listing.
  return AGENTS.map(({ instructions, ...rest }) => rest)
}

export function getAgent(id) {
  return byId.get(id) || null
}

export { runAgent }
