import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type TokenStore = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  scope?: string;
  account?: string;
};

export async function loadTokenStore(filePath: string): Promise<TokenStore | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as TokenStore;
  } catch {
    return null;
  }
}

export async function saveTokenStore(filePath: string, token: TokenStore): Promise<void> {
  await mkdir(path.dirname(path.resolve(filePath)), { recursive: true });
  await writeFile(filePath, JSON.stringify(token, null, 2), "utf8");
}