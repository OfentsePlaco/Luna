import type { OutlookGraphConfig } from "../config";
import { loadTokenStore } from "./token-store";

export function getAuthorizeUrl(config: OutlookGraphConfig, state: string, codeChallenge: string): string {
  const tenant = config.tenantMode === "common" ? "common" : "consumers";
  const scopes = ["openid", "profile", "offline_access", "Mail.Read", "Mail.ReadWrite"].join(" ");
  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.redirectUri,
    response_mode: "query",
    scope: scopes,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?${params.toString()}`;
}

export async function requireAccessToken(config: OutlookGraphConfig): Promise<string> {
  const token = await loadTokenStore(config.tokenStorePath);
  if (!token?.accessToken) {
    throw new Error("Outlook is not connected yet. Complete OAuth setup before using live mailbox tools.");
  }
  return token.accessToken;
}