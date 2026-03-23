import type { OutlookGraphConfig } from "../config";
import { requireAccessToken } from "../auth/oauth";

const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";

export async function graphGet(config: OutlookGraphConfig, relativePath: string, init?: RequestInit): Promise<any> {
  const token = await requireAccessToken(config);
  const res = await fetch(`${GRAPH_ROOT}${relativePath}`, {
    method: "GET",
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Graph GET failed ${res.status}: ${await safeBody(res)}`);
  }
  return res.json();
}

export async function graphPost(config: OutlookGraphConfig, relativePath: string, body?: unknown, init?: RequestInit): Promise<any> {
  const token = await requireAccessToken(config);
  const res = await fetch(`${GRAPH_ROOT}${relativePath}`, {
    method: "POST",
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Graph POST failed ${res.status}: ${await safeBody(res)}`);
  }
  if (res.status === 204) return { ok: true };
  return res.json();
}

export async function graphPatch(config: OutlookGraphConfig, relativePath: string, body: unknown): Promise<any> {
  const token = await requireAccessToken(config);
  const res = await fetch(`${GRAPH_ROOT}${relativePath}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Graph PATCH failed ${res.status}: ${await safeBody(res)}`);
  }
  if (res.status === 204) return { ok: true };
  return res.json();
}

async function safeBody(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 1000);
  } catch {
    return "<no body>";
  }
}