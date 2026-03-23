---
name: outlook-graph-plugin-spec
description: Design and review a safe native OpenClaw plugin for real-time Microsoft Outlook access through Microsoft Graph. Use when defining tool surface, permissions, token handling, approval gates, safety defaults, and phased capability rollout for Outlook mailbox access.
---

# Outlook Graph Plugin Spec

Use this skill when defining or reviewing a real Outlook plugin for OpenClaw.

## Design target

Build a native plugin for Microsoft Graph with a narrow tool surface and conservative defaults.

## Phase 1

Implement only:
- folder listing
- message search
- message read
- thread read
- attachment download
- draft creation
- draft update

Do not implement by default:
- direct send
- delete
- move
- state mutation
- bulk actions

## Required design outputs

Produce:
- plugin id and package naming
- tool surface
- config schema outline
- safety policy defaults
- token handling notes
- logging policy
- phased rollout plan

## Review rules

- prefer delegated OAuth for personal mailbox workflows
- keep send capability separate from read/draft capability
- require explicit user approval before outbound communication
- avoid hidden third-party brokers
- keep logs useful but non-sensitive

## Resources

- Read `references/config-schema-outline.md`
- Read `references/tool-contracts.md`
- Read `references/threat-model.md`
