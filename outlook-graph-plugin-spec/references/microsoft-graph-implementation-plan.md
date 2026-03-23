# Microsoft Graph Implementation Plan

## Objective

Implement a native OpenClaw plugin for personal Outlook that supports only the approved capability set:

- read messages
- search messages
- retrieve threads
- download attachments
- create drafts

Explicitly out of scope for the initial release:

- send
- delete
- move
- mark read/unread
- autonomous mailbox mutation

## Architecture choice

Use a native OpenClaw plugin that talks directly to Microsoft Graph.

Why this is the correct design:
- official API
- delegated user OAuth works for personal Outlook
- no mailbox password handling
- minimal trust boundary
- token storage stays local on the gateway machine

## Auth model

### OAuth type

Use delegated OAuth authorization code flow with PKCE.

Reason:
- appropriate for a personal Outlook mailbox
- avoids application-wide tenant access
- aligns with user-present consent
- easier to reason about than application permissions

### Recommended app registration posture

- single app registration for this gateway
- delegated permissions only
- no application permissions
- no admin-only scopes

### Required scopes for initial release

Use the minimum practical set:

- `offline_access`
- `openid`
- `profile`
- `Mail.Read`
- `Mail.ReadWrite`

Blunt truth:
- `Mail.Read` is enough for read/search/list operations
- but **draft creation on messages requires `Mail.ReadWrite`**
- there is no clean draft-only mail-write scope
- so the permission boundary is broader than the desired action boundary
- the plugin must enforce the action restrictions itself

### Scope rationale

- `Mail.Read` covers reading/searching/listing and attachment access
- `Mail.ReadWrite` is required for creating reply drafts and message drafts
- `Mail.Send` is intentionally excluded

## Graph endpoints for phase 1

### Folder listing

- `GET /me/mailFolders`
- optionally `GET /me/mailFolders/{id}/childFolders`

### Message search/list

Primary path:
- `GET /me/messages?$select=...&$top=...&$filter=...`

Folder-scoped path:
- `GET /me/mailFolders/{id}/messages?$select=...&$top=...&$filter=...`

Search notes:
- use `$search` where supported for subject/body/from search patterns
- use `$filter` for deterministic filters like dates and read state
- constrain payload with `$select`
- page using `@odata.nextLink`

### Message read

- `GET /me/messages/{id}?$select=...`

Recommended selected fields:
- `id`
- `conversationId`
- `subject`
- `from`
- `toRecipients`
- `ccRecipients`
- `receivedDateTime`
- `sentDateTime`
- `hasAttachments`
- `bodyPreview`
- `body`
- `internetMessageId`
- `replyTo`
- `parentFolderId`

### Thread retrieval

Graph does not expose a single perfect "get thread" endpoint for Outlook mail the way Gmail does.

Practical approach:
1. fetch seed message
2. take its `conversationId`
3. query related messages with the same `conversationId`
4. sort locally by `receivedDateTime`

Implementation path:
- `GET /me/messages/{id}?$select=conversationId,...`
- `GET /me/messages?$filter=conversationId eq '{conversationId}'&$select=...`

If Graph filter behavior is inconsistent for `conversationId`, fall back to folder-bounded retrieval plus local filtering.

### Attachment metadata

- `GET /me/messages/{id}/attachments`

### Attachment download

- `GET /me/messages/{id}/attachments/{attachmentId}`

For file attachments:
- decode `contentBytes`
- write to a local approved path
- return local file path and metadata

Do not auto-open or auto-execute downloaded files.

### Draft creation

Two supported draft paths:

1. new draft message
   - `POST /me/messages`
2. reply draft to existing message
   - `POST /me/messages/{id}/createReply`

Recommended initial support:
- `createReply` for thread-safe reply drafting
- `POST /me/messages` for brand-new drafts only if explicitly requested

### Draft update

- `PATCH /me/messages/{draftId}`

Allowed mutable fields in phase 1:
- `subject`
- `body`
- `toRecipients`
- `ccRecipients`
- `bccRecipients`

### Not implemented in phase 1

- `POST /me/messages/{id}/send`
- reply/send one-shot endpoints
- delete endpoints
- move endpoints
- mark read/unread mutation endpoints

## Plugin module design

Suggested files:

- `src/index.ts`
- `src/config.ts`
- `src/auth/oauth.ts`
- `src/auth/token-store.ts`
- `src/graph/client.ts`
- `src/graph/mail-folders.ts`
- `src/graph/messages.ts`
- `src/graph/attachments.ts`
- `src/policy.ts`
- `src/logging.ts`
- `src/tools/list-folders.ts`
- `src/tools/search-messages.ts`
- `src/tools/get-message.ts`
- `src/tools/get-thread.ts`
- `src/tools/download-attachment.ts`
- `src/tools/create-draft.ts`
- `src/tools/update-draft.ts`

## Tool contracts

### outlook.list_folders

Input:
- `includeChildCounts?: boolean`

Output:
- array of folder objects with `id`, `displayName`, `childFolderCount`, `unreadItemCount`, `totalItemCount`

### outlook.search_messages

Input:
- `query?: string`
- `folderId?: string`
- `top?: number`
- `receivedAfter?: string`
- `receivedBefore?: string`
- `from?: string`
- `hasAttachments?: boolean`

Output:
- array of message summaries
- pagination cursor or nextLink token if present

### outlook.get_message

Input:
- `messageId: string`

Output:
- normalized message detail

### outlook.get_thread

Input:
- `messageId: string`

Output:
- ordered thread messages
- `conversationId`

### outlook.download_attachment

Input:
- `messageId: string`
- `attachmentId: string`
- `saveDir?: string`

Output:
- local saved file path
- attachment metadata

Policy:
- save only to approved local directories
- reject path traversal

### outlook.create_draft

Input:
- either `replyToMessageId` or explicit recipients
- `subject?`
- `body`
- `to?`
- `cc?`
- `bcc?`
- `bodyType?: 'text' | 'html'`

Output:
- `draftId`
- subject
- recipients summary

Policy:
- allowed
- does not send
- if `replyToMessageId` is provided, prefer Graph `createReply`

### outlook.update_draft

Input:
- `draftId: string`
- mutable fields

Output:
- updated draft metadata

## Policy enforcement

Because `Mail.ReadWrite` is broader than your desired action set, policy enforcement must be local and explicit.

Hard policy defaults:
- `allowSend = false`
- `allowDelete = false`
- `allowMove = false`
- `allowMarkRead = false`
- `allowAutonomousMutation = false`

Implementation rule:
- dangerous tool handlers should not even register unless enabled in config
- for phase 1, do not implement those handlers at all

## Token storage plan

Store tokens locally only.

Recommended path:
- `C:\Users\ofent\.openclaw\secrets\outlook-graph-token.json`

Requirements:
- directory exists only on gateway machine
- never commit tokens
- never log tokens
- file permissions as tight as Windows allows for the user profile

Future improvement:
- encrypt refresh token with Windows DPAPI if practical

## Logging plan

Log action metadata only.

Log:
- action name
- mailbox alias or account id
- message id / conversation id / draft id
- attachment id and saved path when relevant
- timestamp
- success/failure
- error code class

Do not log:
- full message body
- attachment body
- token values
- full OAuth response payloads

## Error handling

Expected error classes:
- expired token
- revoked consent
- insufficient scope
- item not found
- Graph throttling
- malformed query
- local file write failure

Policy:
- fail closed
- never fall back to unsafe behavior
- surface exact reason in a clean internal error message
- respect retry-after on Graph throttling

## OpenClaw config design

Suggested config:

```json
{
  "plugins": {
    "entries": {
      "outlook-graph": {
        "enabled": false,
        "config": {
          "clientId": "...",
          "tenantMode": "consumers",
          "redirectUri": "http://127.0.0.1:39081/callback",
          "tokenStorePath": "C:\\Users\\ofent\\.openclaw\\secrets\\outlook-graph-token.json",
          "allowSend": false,
          "allowDelete": false,
          "allowMove": false,
          "allowMarkRead": false,
          "allowAutonomousMutation": false,
          "downloadDir": "C:\\Users\\ofent\\.openclaw\\workspace\\downloads\\outlook"
        }
      }
    }
  }
}
```

## Implementation sequence

### Step 1: scaffold plugin
- create manifest
- create config schema
- create auth module
- create Graph client wrapper

### Step 2: implement read path
- list folders
- search messages
- get message
- get thread

### Step 3: implement attachment path
- list attachments through `get_message`
- download file attachments safely to local disk

### Step 4: implement draft path
- create reply drafts
- create new drafts
- patch drafts

### Step 5: hardening
- logging
- token-store protections
- throttling handling
- pagination helpers
- input validation

### Step 6: controlled user test
- connect personal Outlook account
- search inbox
- read one message
- fetch one thread
- download one non-sensitive attachment
- create one draft reply
- verify nothing was sent or mutated beyond drafts

## Test plan

### Unit tests
- config validation
- policy gating
- query builder correctness
- path sanitization for downloads
- draft payload normalization

### Integration tests
- OAuth connect flow
- folder listing
- search by sender and subject
- message fetch with attachments
- thread reconstruction by conversationId
- draft creation and update

### Negative tests
- send endpoint unavailable
- delete endpoint unavailable
- mark-read unavailable
- invalid save path rejected
- revoked token produces clean reconnect-needed error

## Blunt constraints

1. Microsoft Graph does not give a true draft-only write scope.
   - If you want draft creation, you must accept `Mail.ReadWrite`.
   - The plugin must compensate with stricter local policy.

2. Thread retrieval is workable but not perfectly elegant.
   - Outlook mail threading via Graph is more awkward than it should be.
   - `conversationId`-based reconstruction is the practical route.

3. The safest build is custom.
   - Third-party Outlook plugins may be faster, but the trust boundary is worse.

## Deliverable definition

A successful phase-1 plugin gives you:
- real-time Outlook reading
- narrow search
- thread retrieval
- safe attachment download
- draft creation

And still does **not** let the agent:
- send mail
- delete mail
- move mail
- mark mail read/unread
