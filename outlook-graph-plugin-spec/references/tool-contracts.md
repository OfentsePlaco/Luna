# Tool Contracts

## outlook.list_folders
Input:
- mailbox? string

Output:
- folder ids
- display names
- child counts if available

## outlook.search_messages
Input:
- query string
- folderId? string
- top? number

Output:
- message ids
- subject
- sender
- received time
- thread id
- attachment presence

## outlook.get_message
Input:
- messageId string

Output:
- body
- subject
- sender
- recipients
- timestamps
- attachment metadata

## outlook.get_thread
Input:
- threadId string

Output:
- ordered thread messages

## outlook.download_attachment
Input:
- messageId string
- attachmentId string
- savePath string

Output:
- local file path
- mime type
- size

## outlook.create_draft
Input:
- to
- cc?
- bcc?
- subject
- body
- bodyType?
- replyToMessageId?

Output:
- draft id
- remote location info if relevant

## outlook.update_draft
Input:
- draftId string
- mutable fields

Output:
- updated draft metadata

## outlook.send_draft
Input:
- draftId string

Output:
- sent message metadata

Policy:
- disabled unless `allowSend=true`
- should require separate approval gate above plugin policy
