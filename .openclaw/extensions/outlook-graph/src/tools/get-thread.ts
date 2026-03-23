import { Type } from "@sinclair/typebox";
import { getThread } from "../graph/messages";
import type { OutlookGraphConfig } from "../config";

export const getThreadTool = (config: OutlookGraphConfig) => ({
  name: "outlook.get_thread",
  description: "Reconstruct an Outlook thread using conversationId and local ordering.",
  parameters: Type.Object({
    messageId: Type.String({ minLength: 1 }),
  }, { additionalProperties: false }),
  async execute(_id: string, params: any) {
    const result = await getThread(config, params.messageId);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});