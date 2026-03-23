# Outlook Plugin Design

Use this reference when designing or reviewing a real-time Outlook integration for OpenClaw.

## Goal

Enable real-time Outlook access with the smallest practical trust boundary.

Preferred outcome:
- read mail
- search mail
- read threads
- inspect attachments
- create drafts
- require explicit approval before any outbound send

## Recommended architecture

### Best option

A small OpenClaw plugin that talks directly to Microsoft Graph using OAuth.

Why:
- official API
- no screen scraping
- no mailbox password handling
- scope control is explicit
- tokens can stay local
- blast radius is easier to understand

### Acceptable but riskier option

A vetted third-party broker/plugin that mediates Outlook access.

Additional risks:
- external service trust
- token handling outside your machine
- weaker visibility into actual mailbox operations
- broader operational dependency

## Capability split

Split capabilities into tiers.

### Tier 1: Read-only
- list folders
- list messages
- search messages
- get message
- get thread
- fetch attachment metadata
- download attachment

### Tier 2: Drafting
- create draft reply
- create draft message
- update draft

### Tier 3: Dangerous actions
- send mail
- delete mail
- move mail
- mark read/unread
- bulk actions

Do not enable Tier 3 by default.

## Policy defaults

Recommended default policy:

- read/search: allowed
- drafts: allowed
- send: disabled
- delete/move: disabled
- autonomous mailbox actions: disabled
- external recipient mail: approval required
- internal recipient mail: still approval required unless user explicitly relaxes it

## Token handling expectations

Require:
- OAuth, not raw mailbox passwords
- local token storage on the gateway machine
- clear revocation path
- no token exfiltration to unrelated services
- documented storage path and permissions

Prefer:
- refresh token encryption if available
- per-account separation
- explicit reconnect flow if scopes change

## Logging expectations

Log enough for auditability without dumping sensitive content.

Should log:
- mailbox action type
- account used
- target message id or draft id
- timestamp
- result status

Should avoid logging by default:
- full email bodies
- full attachment content
- secrets or bearer tokens

## Recommended tool surface

A clean Outlook plugin should expose narrow actions like:

- outlook.list_folders
- outlook.search_messages
- outlook.get_message
- outlook.get_thread
- outlook.download_attachment
- outlook.create_draft
- outlook.update_draft
- outlook.send_draft

Avoid vague catch-all methods that can do too much with hidden side effects.

## Review checklist

Before trusting an Outlook plugin, verify:

1. Is the code actually present and reviewable?
2. Is the OAuth flow documented clearly?
3. Are the required scopes minimal?
4. Are send/delete actions separate from read/search?
5. Are tokens stored locally and safely?
6. Are dangerous actions disabled by default?
7. Is there any unexplained external API hop or broker?
8. Can replies be drafted without sending?
9. Is attachment handling local and deterministic where possible?
10. Is failure behavior explicit and safe?

## Red flags

Treat these as serious warnings:

- the skill package contains only prompts but no real code
- install instructions point to a mystery repo
- broad mailbox write scopes with no justification
- send/delete enabled by default
- unclear token storage
- hidden external proxying of mailbox content
- autonomous invocation of send-capable tools
- instructions that blur draft vs send

## Suggested first implementation scope

Build only:
- folder listing
- message search
- message read
- thread read
- attachment download
- draft creation

Delay:
- send mail
- delete or move mail
- state mutation like mark read/unread
- bulk actions

This keeps the first version useful without being reckless.
