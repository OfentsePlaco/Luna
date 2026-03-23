# REPO-DIAGRAM.md

## Repository relationship map

This diagram shows how the main repo documents, memory files, skill assets, and Outlook integration work relate to each other.

```mermaid
graph TD
    A[Luna Repo Root] --> B[AGENTS.md]
    A --> C[SOUL.md]
    A --> D[USER.md]
    A --> E[MEMORY.md]
    A --> F[memory/2026-03-23.md]
    A --> G[security-notes.md]
    A --> H[outlook-mail-assistant/]
    A --> I[outlook-graph-plugin-spec/]
    A --> J[.openclaw/extensions/outlook-graph/]

    B --> D
    B --> E
    D --> E
    F --> E

    H --> H1[SKILL.md]
    H --> H2[references/attachment-parsing-guide.md]
    H --> H3[references/outlook-plugin-design.md]
    H --> H4[scripts/parse_attachment.py]

    I --> I1[README.md]
    I --> I2[SKILL.md]
    I --> I3[references/config-schema-outline.md]
    I --> I4[references/tool-contracts.md]
    I --> I5[references/threat-model.md]
    I --> I6[references/microsoft-graph-implementation-plan.md]
    I --> I7[references/oauth-setup-checklist.md]

    J --> J1[openclaw.plugin.json]
    J --> J2[package.json]
    J --> J3[src/index.ts]
    J --> J4[src/config.ts]
    J --> J5[src/policy.ts]
    J --> J6[src/auth/oauth.ts]
    J --> J7[src/auth/token-store.ts]
    J --> J8[src/graph/client.ts]
    J --> J9[src/graph/mail-folders.ts]
    J --> J10[src/graph/messages.ts]
    J --> J11[src/graph/attachments.ts]
    J --> J12[src/tools/list-folders.ts]
    J --> J13[src/tools/search-messages.ts]
    J --> J14[src/tools/get-message.ts]
    J --> J15[src/tools/get-thread.ts]
    J --> J16[src/tools/download-attachment.ts]
    J --> J17[src/tools/create-draft.ts]
    J --> J18[src/tools/update-draft.ts]

    H3 --> I
    I --> J
    D --> J
    E --> J
```

## Outlook workstream relationships

### 1. User policy and memory
- `USER.md` stores working preferences and current operating rules
- `MEMORY.md` stores durable long-term rules and decisions
- `memory/2026-03-23.md` stores the detailed daily log of Outlook integration decisions and reviews

### 2. Outlook mail skill
- `outlook-mail-assistant/` is the higher-level skill for analyzing email content and attachments
- it is useful for manual analysis and draft generation
- it is **not** the real-time mailbox integration itself

### 3. Outlook plugin design layer
- `outlook-graph-plugin-spec/` defines the intended plugin behavior
- this includes:
  - threat model
  - tool contracts
  - config outline
  - OAuth checklist
  - Microsoft Graph implementation plan

### 4. Local plugin implementation layer
- `.openclaw/extensions/outlook-graph/` is the actual local native plugin scaffold
- it is the implementation candidate for the design in `outlook-graph-plugin-spec/`
- it currently contains:
  - manifest
  - config schema
  - policy guardrails
  - auth/token stubs
  - Graph client code
  - phase-1 tools for approved Outlook actions

### 5. Security and platform context
- `security-notes.md` records the OpenClaw hardening decisions already applied on the machine
- those security decisions matter because Outlook integration is a high-trust capability and should stay aligned with the repo’s safer operating posture

## Current state summary

- policy exists
- design exists
- local plugin scaffold exists
- OAuth connect flow is incomplete
- runtime validation is incomplete
- live Outlook access is **not finished yet**
