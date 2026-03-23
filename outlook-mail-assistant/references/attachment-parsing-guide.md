# Attachment Parsing Guide

Use this reference when an email includes a file and the user needs more than a quick summary.

## Parsing order

1. Identify the file type.
2. Identify the business purpose.
3. Extract the critical facts.
4. Summarize risks, obligations, or next steps.
5. Draft any requested reply only after the document is understood.

## Source separation

Keep these sources separate in the final answer:

- email body
- attachment content
- parser inference

If a fact appears only in the attachment, say so.
If a fact appears only in the email body, say so.
If the parser output is uncertain, say so.

## By document type

### Invoice or quote

Extract:
- issuer
- recipient
- invoice or quote number
- issue date
- due date
- currency
- subtotal
- tax
- total
- payment terms
- purchase order reference
- banking or remittance instructions if present

Watch for:
- missing PO numbers
- inconsistent totals
- overdue dates
- changed bank details

### Contract, MSA, SOW, order form, or NDA

Extract:
- parties
- effective date
- term
- renewal mechanics
- termination rights
- fees and billing terms
- service scope
- liabilities or indemnities mentioned
- signature status
- referenced exhibits or schedules

Watch for:
- unsigned versions
- conflicts between email and attachment
- commercial promises in the email that are absent from the document

### Resume or candidate profile

Extract:
- candidate name
- role focus
- current or most recent employer
- years of experience if stated
- key skills
- location
- notice period or availability
- compensation expectations if stated

### Report, memo, deck, or presentation

Extract:
- topic
- headline findings
- metrics and dates
- recommendations
- decisions needed

### Spreadsheet or CSV

Do not narrate rows exhaustively unless asked.
Instead:
- identify the structure
- summarize the relevant sheets or columns
- extract only the records or totals relevant to the user's request

## Reply patterns

### Acknowledge receipt

Thank you for sending this through. I have reviewed the materials and noted the key points. We will review internally and revert on the outstanding items shortly.

### Request clarification

Thank you. I have reviewed the email and attachment. Before we proceed, could you please confirm [specific missing item]? Once we have that, we can move this forward.

### Confirm next step without overcommitting

Thank you for the update. We have noted the details and are reviewing internally. We will come back to you by [date if known] with the next step.

## Risk controls

Do not:
- state that payment, approval, signature, or acceptance has occurred unless clearly stated
- fill missing fields from context alone
- collapse different document versions into one set of facts without noting the conflict
- present a draft reply as if it has already been sent

When uncertain, say the point is not stated, unsupported, or ambiguous.
