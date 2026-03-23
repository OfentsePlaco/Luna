# Outlook Graph Plugin Spec

## Goal

Provide real-time Outlook mailbox access for OpenClaw with the smallest practical trust boundary.

## Scope

Initial version must support:
- folder listing
- message search
- message read
- thread read
- attachment download
- draft creation
- draft update

Initial version must not support by default:
- direct send
- delete
- move
- mark read/unread
- bulk mailbox mutation

## Trust model

- direct Microsoft Graph integration
- OAuth-based auth
- local token storage on gateway machine
- no external mailbox broker in the critical path
- explicit approval required before outbound send capability is enabled

## Plugin shape

Type: native OpenClaw plugin

Suggested id:
- `outlook-graph`

Suggested package name:
- `@ofentse/outlook-graph-plugin`

## Proposed tool surface

- `outlook.list_folders`
- `outlook.search_messages`
- `outlook.get_message`
- `outlook.get_thread`
- `outlook.download_attachment`
- `outlook.create_draft`
- `outlook.update_draft`
- `outlook.send_draft` (disabled by policy by default)

## Safety policy

Default config should enforce:
- read/search allowed
- draft creation allowed
- send disabled
- delete disabled
- move disabled
- autonomous mutation disabled
- approval required for external communication

## OAuth expectations

Prefer delegated user OAuth rather than broad application permissions for a personal mailbox workflow.

## Token storage expectations

- tokens stored locally only
- clear revocation path
- no plaintext logging of tokens
- per-account separation

## Logging

Log:
- action type
- account id
- message id or draft id
- timestamp
- success/failure

Do not log by default:
- full message bodies
- attachment bodies
- secrets or access tokens

## Open questions

- exact Microsoft Graph scope set
- preferred token storage path and encryption strategy
- whether drafts should be stored remotely in Outlook or locally until approval
