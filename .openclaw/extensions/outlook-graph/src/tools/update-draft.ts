import { Type } from "@sinclair/typebox";
import { updateDraft } from "../graph/messages";
import type { OutlookGraphConfig } from "../config";

export const updateDraftTool = (config: OutlookGraphConfig) => ({
  name: "outlook.update_draft",
  description: "Update an existing Outlook draft without sending it.",
  parameters: Type.Object({
    draftId: Type.String({ minLength: 1 }),
    subject: Type.Optional(Type.String()),
    body: Type.Optional(Type.String()),
    bodyType: Type.Optional(Type.Union([Type.Literal("text"), Type.Literal("html")])),
    to: Type.Optional(Type.Array(Type.String())),
    cc: Type.Optional(Type.Array(Type.String())),
    bcc: Type.Optional(Type.Array(Type.String())),
  }, { additionalProperties: false }),
  async execute(_id: string, params: any) {
    const { draftId, ...patch } = params;
    const result = await updateDraft(config, draftId, patch);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});