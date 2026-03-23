import { writeFile } from "node:fs/promises";
import type { OutlookGraphConfig } from "../config";
import { graphGet } from "./client";
import { ensureDownloadDir, safeJoinDownloadPath } from "../policy";

export async function downloadAttachment(config: OutlookGraphConfig, messageId: string, attachmentId: string) {
  const attachment = await graphGet(config, `/me/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(attachmentId)}`);
  if (!attachment?.contentBytes) {
    throw new Error("attachment does not contain downloadable contentBytes");
  }
  const dir = await ensureDownloadDir(config);
  const target = safeJoinDownloadPath(dir, attachment.name ?? `${attachmentId}.bin`);
  const bytes = Buffer.from(String(attachment.contentBytes), "base64");
  await writeFile(target, bytes);
  return {
    filePath: target,
    name: attachment.name,
    contentType: attachment.contentType,
    size: attachment.size,
  };
}