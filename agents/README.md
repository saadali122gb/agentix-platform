# Pre-built AI Agents

Downloadable agent configurations for the AI Agent Platform (Insurance & Trades).

Each `*.agent.json` file is a ready-to-use agent definition. Download one, then
import it in the app (Agents Catalog → New agent), or use the app's
**Install starter agents** button to add the whole set at once.

| Agent | Category | File |
| --- | --- | --- |
| Lead Generation & Outbound | Offensive | [lead-generation-outbound.agent.json](lead-generation-outbound.agent.json) |
| Intent Tracking & Renewals | Offensive | [intent-tracking-renewals.agent.json](intent-tracking-renewals.agent.json) |
| Workflow & Task Management | Defensive | [workflow-task-management.agent.json](workflow-task-management.agent.json) |
| Automated Data Entry | Defensive | [automated-data-entry.agent.json](automated-data-entry.agent.json) |
| Internal Virtual Assistant | Assistant | [internal-virtual-assistant.agent.json](internal-virtual-assistant.agent.json) |
| Customer Support Agent | Customer-facing | [customer-support-agent.agent.json](customer-support-agent.agent.json) |

See [`index.json`](index.json) for a machine-readable list.

## Config shape

```json
{
  "name": "Customer Support Agent",
  "category": "customer",
  "description": "...",
  "model": "gemini-flash-lite-latest",
  "instructions": "...",
  "tools": ["Knowledge base search"],
  "guardrails": ["No policy advice", "No sales commitments", "Escalate on doubt"],
  "status": "active"
}
```
