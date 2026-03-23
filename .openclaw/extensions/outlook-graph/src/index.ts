import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { OutlookGraphConfigSchema, normalizeConfig } from "./config";
import { assertPolicy } from "./policy";
import { listFoldersTool } from "./tools/list-folders";
import { searchMessagesTool } from "./tools/search-messages";
import { getMessageTool } from "./tools/get-message";
import { getThreadTool } from "./tools/get-thread";
import { downloadAttachmentTool } from "./tools/download-attachment";
import { createDraftTool } from "./tools/create-draft";
import { updateDraftTool } from "./tools/update-draft";

export default definePluginEntry({
  id: "outlook-graph",
  name: "Outlook Graph",
  description: "Personal Outlook integration via Microsoft Graph with conservative local policy enforcement.",
  configSchema: OutlookGraphConfigSchema,
  register(api) {
    const config = normalizeConfig(api.pluginConfig);
    assertPolicy(config);

    api.registerTool(listFoldersTool(config), { optional: true });
    api.registerTool(searchMessagesTool(config), { optional: true });
    api.registerTool(getMessageTool(config), { optional: true });
    api.registerTool(getThreadTool(config), { optional: true });
    api.registerTool(downloadAttachmentTool(config), { optional: true });
    api.registerTool(createDraftTool(config), { optional: true });
    api.registerTool(updateDraftTool(config), { optional: true });
  },
});