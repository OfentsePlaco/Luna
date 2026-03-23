---
name: outlook-mail-assistant
description: Read, triage, summarize, and draft replies for Microsoft Outlook or Microsoft 365 email, including attachment-aware analysis when a local file is available. Use when the user needs help finding important mail, summarizing threads, extracting business facts from email bodies or common office attachments, or drafting a reply for approval before sending.
---

# Outlook Mail Assistant

Work through Outlook email methodically. Prioritize accuracy over polish.

## Core workflow

1. Identify the task: search, triage, summarize, extract fields, inspect an attachment, or draft a reply.
2. Read the relevant email or thread before concluding.
3. Separate facts from assumptions.
4. Preserve names, dates, amounts, deadlines, identifiers, and requested actions exactly.
5. If a relevant local attachment file is available, inspect it before answering.
6. If drafting a reply, draft only. Do not imply the message has been sent.

## Search and triage

When the user wants important email identified:

- Search narrowly first using sender, subject, date range, and attachment presence when available.
- Prefer actionable mail over newsletters and automated noise.
- Group related emails by thread or business topic.
- State why each email matters: decision needed, risk, deadline, money, external request, or executive visibility.

## Summarization

Default structure unless the user asks otherwise:

- What this is about
- Key points
- Risks or decisions
- Required next actions
- Important dates, amounts, or IDs

Keep summaries concise, factual, and suitable for internal forwarding.

## Attachment handling

Inspect an attachment only when it affects the answer.

Supported deterministic parsing via `scripts/parse_attachment.py`:

- pdf
- docx
- xlsx / xlsm / csv / tsv
- pptx
- txt / md / json / eml / log / rtf

Not actually supported by the script:

- OCR for image-only scans
- image understanding
- zip archive traversal

If a file is image-based, scanned, unsupported, or parsing is weak, say so explicitly and avoid false precision.

When a local attachment file is available, run:

```bash
python scripts/parse_attachment.py <file>
```

Use the script output as a grounded starting point, not as infallible truth.

## Structured extraction

When extracting fields:

- Give a short narrative summary first.
- Then list fields if that helps.
- Mark unknown values as `not stated`.
- Do not merge email-body claims and attachment claims without saying which source each came from.

Useful field categories:

- sender and recipients
- organization or counterparty
- subject or matter
- request type
- deadlines
- monetary values
- contract terms
- invoice identifiers
- order or shipment identifiers
- missing information

## Drafting replies

Draft replies in plain professional English.

Default style:

- direct
- courteous
- short paragraphs
- clear next steps
- no slang, emojis, or filler

Reply rules:

- Mirror the thread's formality.
- Answer explicit questions only when the facts are available.
- If information is missing, draft a reply that acknowledges receipt and asks for the exact missing item.
- For legal, finance, HR, or external commitment risk, keep claims narrow and avoid overcommitting.
- If asked for options, provide clearly different versions such as concise, diplomatic, or firm.
- Do not state or imply payment, approval, signature, or acceptance unless clearly supported by the source material.
- Treat every reply as a draft pending user approval.

## Output standards

Use plain English unless the user asks for a different format.

Default summary template:

### Email summary

Subject: [subject]

This email concerns [one-sentence summary].

Key points:
- [point]
- [point]
- [point]

Actions required:
- [action or `none stated`]

Important dates, amounts, or IDs:
- [item or `none stated`]

## Quality rules

- Distinguish the email body from attachment content.
- Preserve original figures, names, dates, and deadlines.
- Flag ambiguity, contradictions, and missing attachments.
- Quote only short phrases when necessary; otherwise paraphrase.
- If parsing output conflicts with the source text, say so.
- Prefer `not stated` over guessing.

## Script/runtime notes

`parse_attachment.py` depends on Python packages that may not be installed:

- pypdf
- python-docx
- openpyxl
- python-pptx

If those dependencies are missing or parsing fails:

- say exactly what failed
- fall back to manual reasoning from the available text if possible
- do not pretend the attachment was fully parsed

## Resources

- Use `scripts/parse_attachment.py` for deterministic extraction from supported attachment types.
- Read `references/attachment-parsing-guide.md` when the attachment is commercially important, legally sensitive, or the user wants a reply drafted from document content.
