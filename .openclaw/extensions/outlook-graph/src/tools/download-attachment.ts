import { Type } from "@sinclair/typebox";
import { downloadAttachment } from "../graph/attachments";
import type { OutlookGraphConfig } from "../config";

export const downloadAttachmentTool = (config: OutlookGraphConfig) => ({
  name: "outlook.download_attachment",
  description: "Download an Outlook file attachment to a local approved directory.",
  parameters: Type.Object({
    messageId: Type.String({ minLength: 1 }),
    attachmentId: Type.String({ minLength: 1 }),
  }, { additionalProperties: false }),
  async execute(_id: string, params: any) {
    const result = await downloadAttachment(config, params.messageId, params.attachmentId);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});