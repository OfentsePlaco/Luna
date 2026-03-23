# Threat Model

## Main risks

1. mailbox data overexposure
2. silent outbound email actions
3. destructive mailbox mutation
4. token leakage
5. excessive OAuth scopes
6. poor logging hygiene

## Controls

- narrow scopes
- default read/draft only
- send/delete/move disabled by default
- local token storage
- explicit approval before outbound actions
- action logging without body dumping

## Blast radius reduction

Keep the first version useful without allowing silent irreversible actions.

That means:
- no delete
- no move
- no send by default
- no autonomous mutation
