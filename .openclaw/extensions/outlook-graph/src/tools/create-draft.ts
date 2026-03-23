import { Type } from "@sinclair/typebox";
import { createDraft } from "../graph/messages";
import type { OutlookGraphConfig } from "../config";

export const createDraftTool = (config: OutlookGraphConfig) => ({
  name: "outlook.create_draft",
  description: "Create an Outlook draft or reply draft without sending it.",
  parameters: Type.Object({
    replyToMessageId: Type.Optional(Type.String()),
    subject: Type.Optional(Type.String()),
    body: Type.String({ minLength: 1 }),
    bodyType: Type.Optional(Type.Union([Type.Literal("text"), Type.Literal("html")])),
    to: Type.Optional(Type.Array(Type.String())),
    cc: Type.Optional(Type.Array(Type.String())),
    bcc: Type.Optional(Type.Array(Type.String())),
  }, { additionalProperties: false }),
  async execute(_id: string, params: any) {
    const result = await createDraft(config, params);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});