import { Type } from "@sinclair/typebox";
import { searchMessages } from "../graph/messages";
import type { OutlookGraphConfig } from "../config";

export const searchMessagesTool = (config: OutlookGraphConfig) => ({
  name: "outlook.search_messages",
  description: "Search or list Outlook messages with conservative filters.",
  parameters: Type.Object({
    query: Type.Optional(Type.String()),
    folderId: Type.Optional(Type.String()),
    top: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    from: Type.Optional(Type.String()),
    receivedAfter: Type.Optional(Type.String()),
    receivedBefore: Type.Optional(Type.String()),
    hasAttachments: Type.Optional(Type.Boolean()),
  }, { additionalProperties: false }),
  async execute(_id: string, params: any) {
    const result = await searchMessages(config, params);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});