import path from "node:path";
import { mkdir } from "node:fs/promises";
import type { OutlookGraphConfig } from "./config";

export function assertPolicy(config: OutlookGraphConfig) {
  if (config.allowSend || config.allowDelete || config.allowMove || config.allowMarkRead || config.allowAutonomousMutation) {
    throw new Error("policy violation: dangerous Outlook actions are disabled by design in phase 1");
  }
}

export async function ensureDownloadDir(config: OutlookGraphConfig): Promise<string> {
  const dir = path.resolve(config.downloadDir);
  await mkdir(dir, { recursive: true });
  return dir;
}

export function safeJoinDownloadPath(downloadDir: string, fileName: string): string {
  const base = path.resolve(downloadDir);
  const sanitized = fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "attachment.bin";
  const target = path.resolve(base, sanitized);
  if (!target.startsWith(base)) {
    throw new Error("invalid attachment path");
  }
  return target;
}