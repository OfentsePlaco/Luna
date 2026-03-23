import type { OutlookGraphConfig } from "../config";
import { graphGet } from "./client";

export async function listFolders(config: OutlookGraphConfig) {
  return graphGet(config, "/me/mailFolders?$top=200&$select=id,displayName,childFolderCount,unreadItemCount,totalItemCount");
}