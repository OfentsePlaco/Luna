import type { OutlookGraphConfig } from "../config";
import { graphGet, graphPatch, graphPost } from "./client";

function esc(value: string): string {
  return value.replace(/'/g, "''");
}

export async function searchMessages(config: OutlookGraphConfig, input: {
  query?: string;
  folderId?: string;
  top?: number;
  from?: string;
  receivedAfter?: string;
  receivedBefore?: string;
  hasAttachments?: boolean;
}) {
  const top = Math.max(1, Math.min(input.top ?? 20, 100));
  const filters: string[] = [];
  if (input.from) filters.push(`from/emailAddress/address eq '${esc(input.from)}'`);
  if (input.receivedAfter) filters.push(`receivedDateTime ge ${input.receivedAfter}`);
  if (input.receivedBefore) filters.push(`receivedDateTime le ${input.receivedBefore}`);
  if (typeof input.hasAttachments === "boolean") filters.push(`hasAttachments eq ${input.hasAttachments}`);
  const params = new URLSearchParams();
  params.set("$top", String(top));
  params.set("$select", "id,conversationId,subject,from,receivedDateTime,hasAttachments,bodyPreview,parentFolderId");
  if (filters.length) params.set("$filter", filters.join(" and "));
  const base = input.folderId ? `/me/mailFolders/${encodeURIComponent(input.folderId)}/messages` : "/me/messages";
  const path = `${base}?${params.toString()}`;
  const res = await graphGet(config, path, input.query ? { headers: { ConsistencyLevel: "eventual" } } : undefined);
  return res;
}

export async function getMessage(config: OutlookGraphConfig, messageId: string) {
  const select = [
    "id","conversationId","subject","from","toRecipients","ccRecipients","bccRecipients","receivedDateTime","sentDateTime","hasAttachments","bodyPreview","body","internetMessageId","replyTo","parentFolderId"
  ].join(",");
  return graphGet(config, `/me/messages/${encodeURIComponent(messageId)}?$select=${select}`);
}

export async function getThread(config: OutlookGraphConfig, messageId: string) {
  const seed = await getMessage(config, messageId);
  if (!seed?.conversationId) {
    return { seed, value: [seed] };
  }
  const filter = encodeURIComponent(`conversationId eq '${seed.conversationId.replace(/'/g, "''")}'`);
  const select = encodeURIComponent("id,conversationId,subject,from,toRecipients,receivedDateTime,sentDateTime,hasAttachments,bodyPreview,parentFolderId");
  const related = await graphGet(config, `/me/messages?$filter=${filter}&$top=100&$select=${select}`);
  const value = Array.isArray(related?.value) ? related.value.slice().sort((a,b) => String(a.receivedDateTime).localeCompare(String(b.receivedDateTime))) : [seed];
  return { conversationId: seed.conversationId, value };
}

export async function createDraft(config: OutlookGraphConfig, input: {
  replyToMessageId?: string;
  subject?: string;
  body: string;
  bodyType?: "text" | "html";
  to?: string[];
  cc?: string[];
  bcc?: string[];
}) {
  if (input.replyToMessageId) {
    const draft = await graphPost(config, `/me/messages/${encodeURIComponent(input.replyToMessageId)}/createReply`);
    return graphPatch(config, `/me/messages/${encodeURIComponent(draft.id)}`, {
      body: { contentType: input.bodyType === "html" ? "html" : "text", content: input.body }
    });
  }
  return graphPost(config, "/me/messages", {
    subject: input.subject ?? "",
    body: { contentType: input.bodyType === "html" ? "html" : "text", content: input.body },
    toRecipients: (input.to ?? []).map(addressRecipient),
    ccRecipients: (input.cc ?? []).map(addressRecipient),
    bccRecipients: (input.bcc ?? []).map(addressRecipient),
  });
}

export async function updateDraft(config: OutlookGraphConfig, draftId: string, patch: {
  subject?: string;
  body?: string;
  bodyType?: "text" | "html";
  to?: string[];
  cc?: string[];
  bcc?: string[];
}) {
  const body: Record<string, unknown> = {};
  if (patch.subject !== undefined) body.subject = patch.subject;
  if (patch.body !== undefined) body.body = { contentType: patch.bodyType === "html" ? "html" : "text", content: patch.body };
  if (patch.to) body.toRecipients = patch.to.map(addressRecipient);
  if (patch.cc) body.ccRecipients = patch.cc.map(addressRecipient);
  if (patch.bcc) body.bccRecipients = patch.bcc.map(addressRecipient);
  return graphPatch(config, `/me/messages/${encodeURIComponent(draftId)}`, body);
}

function addressRecipient(address: string) {
  return { emailAddress: { address } };
}