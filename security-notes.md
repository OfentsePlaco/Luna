# SECURITY-NOTES.md

## 2026-03-23 OpenClaw hardening pass

Applied machine-local security changes based on the OpenClaw Gateway security guidance.

### Implemented

- Gateway kept local-only on `loopback`
- Gateway auth kept on token mode
- `session.dmScope` set to `per-channel-peer`
- `tools.fs.workspaceOnly = true`
- `tools.exec.applyPatch.workspaceOnly = true`
- `gateway.allowRealIpFallback = false`
- `gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback = false`
- `gateway.controlUi.dangerouslyDisableDeviceAuth = false`
- `browser.ssrfPolicy.dangerouslyAllowPrivateNetwork = false`
- Browser exception limited to `localhost`
- `discovery.mdns.mode = minimal`
- Log redaction kept enabled

### Explicit exception requested by user

- `gateway.controlUi.allowInsecureAuth = true`

This is intentionally left enabled. It is expected to continue producing audit warnings.

### Verification status

- Gateway reachable after config changes
- Security audit: `0 critical`
- Remaining warnings are expected from the explicit insecure-auth exception, plus contextual warnings about reverse proxies / deep probe scope

### Telegram group policy fix

Original state was inconsistent:

- `channels.telegram.groupPolicy = "allowlist"`
- no `groupAllowFrom`
- no `allowFrom`

That combination causes all group messages to be silently dropped.

Fix applied:

- `channels.telegram.groupPolicy = "disabled"`

Reason: this removes the inconsistency without widening group access by accident. If group interaction is needed later, switch back to `allowlist` and define `groupAllowFrom`, or use explicit group config with mention gating.

### Update target

Requested OpenClaw update:

- from `2026.3.13`
- to `2026.3.22`
