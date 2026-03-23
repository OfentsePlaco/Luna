import { Type } from "@sinclair/typebox";
import { listFolders } from "../graph/mail-folders";
import type { OutlookGraphConfig } from "../config";

export const listFoldersTool = (config: OutlookGraphConfig) => ({
  name: "outlook.list_folders",
  description: "List Outlook mail folders for the connected personal Outlook account.",
  parameters: Type.Object({
    includeChildCounts: Type.Optional(Type.Boolean()),
  }, { additionalProperties: false }),
  async execute() {
    const result = await listFolders(config);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});