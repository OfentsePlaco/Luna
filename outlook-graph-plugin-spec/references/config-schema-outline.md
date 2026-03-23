# Config Schema Outline

Suggested config path:

`plugins.entries.outlook-graph.config`

## Fields

- `enabled`: boolean
- `tenantMode`: `single-tenant | common`
- `clientId`: string
- `tenantId`: string optional for common flow
- `redirectUri`: string
- `tokenStorePath`: string
- `allowSend`: boolean default false
- `allowDelete`: boolean default false
- `allowMove`: boolean default false
- `allowMarkRead`: boolean default false
- `allowAutonomousMutation`: boolean default false
- `defaultMailbox`: string optional
- `logBodies`: boolean default false
- `logAttachmentBodies`: boolean default false

## Validation expectations

- dangerous mutation flags default false
- token path must be local
- send should not auto-enable via unrelated flags
