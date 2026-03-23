# OAuth Setup Checklist

## User-side decisions already approved

- mailbox type: personal Outlook
- allowed actions: read, search, thread retrieval, attachment download, draft creation
- disallowed by default: send, delete, move, mark read

## Setup checklist

1. Create or approve a Microsoft app registration for personal Microsoft accounts.
2. Configure delegated scopes:
   - openid
   - profile
   - offline_access
   - Mail.Read
   - Mail.ReadWrite
3. Configure redirect URI for local callback handling.
4. Store client id locally in plugin config.
5. Run OAuth connect flow and store token locally.
6. Test read-only paths first.
7. Test draft creation last.

## Approval notes

Because `Mail.ReadWrite` is required for drafts, the plugin must keep dangerous mail actions disabled locally.
