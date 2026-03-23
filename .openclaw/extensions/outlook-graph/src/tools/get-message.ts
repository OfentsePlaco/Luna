import { Type } from "@sinclair/typebox";
import { getMessage } from "../graph/messages";
import type { OutlookGraphConfig } from "../config";

export const getMessageTool = (config: OutlookGraphConfig) => ({
  name: "outlook.get_message",
  description: "Fetch a full Outlook message by id.",
  parameters: Type.Object({
    messageId: Type.String({ minLength: 1 }),
  }, { additionalProperties: false }),
  async execute(_id: string, params: any) {
    const result = await getMessage(config, params.messageId);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});