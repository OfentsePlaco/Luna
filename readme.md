# Luna

Luna is a personal OpenClaw workspace and working repository.

This repo holds:
- assistant identity and operating rules
- user preference and memory files
- OpenClaw security notes
- skill work
- Outlook integration design and implementation work

It is not a generic software project in the usual sense. It is a live assistant workspace with documentation, memory, and evolving capability work kept together in one place.

## What this repo contains

### Core workspace files
- `AGENTS.md` — workspace operating rules
- `SOUL.md` — assistant persona and behavior guidance
- `USER.md` — user profile and working preferences
- `MEMORY.md` — curated long-term memory
- `memory/` — daily notes and short-term continuity
- `HEARTBEAT.md` — heartbeat task control
- `TOOLS.md` — local environment notes
- `IDENTITY.md` — assistant identity metadata

### Security and platform notes
- `security-notes.md` — notes from the OpenClaw hardening pass and related security decisions
- `repo-diagram.md` — structural relationship map for the repo

### Outlook workstream
This repo currently contains three Outlook-related layers:

1. **Skill layer**
   - `outlook-mail-assistant/`
   - Used for email/attachment analysis and draft-oriented workflows

2. **Design/spec layer**
   - `outlook-graph-plugin-spec/`
   - Contains the intended Microsoft Graph plugin design, tool contracts, threat model, OAuth checklist, and implementation plan

3. **Local implementation layer**
   - `.openclaw/extensions/outlook-graph/`
   - Native OpenClaw plugin scaffold for a real-time Outlook integration using Microsoft Graph

## Current Outlook integration status

The Outlook integration work is **in progress**.

Current state:
- policy defined
- design defined
- local plugin scaffold created
- OAuth connect flow incomplete
- runtime validation incomplete
- live mailbox access not finished

Approved initial Outlook capability scope:
- read
- search
- thread retrieval
- attachment download
- draft creation

Not approved by default:
- send
- delete
- move
- mark read/unread

## Repo intent

This repo is used to:
- preserve assistant continuity
- document durable operating decisions
- track workspace-specific capabilities
- store skill and plugin work tied to real operational use

## Notes

- Some files in this repo are operational memory, not conventional product documentation.
- Some content reflects live machine configuration decisions, but machine-local secrets and runtime state should still be handled carefully.
- Marketplace/community integrations are not treated as trustworthy by default; Outlook work here is moving toward a direct Microsoft Graph path with local policy enforcement.
