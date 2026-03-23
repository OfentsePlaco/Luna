import { Type, Static } from "@sinclair/typebox";

export const OutlookGraphConfigSchema = Type.Object({
  clientId: Type.String({ minLength: 1 }),
  tenantMode: Type.Union([Type.Literal("consumers"), Type.Literal("common")], { default: "consumers" }),
  redirectUri: Type.String({ minLength: 1 }),
  tokenStorePath: Type.String({ minLength: 1 }),
  downloadDir: Type.String({ minLength: 1 }),
  allowSend: Type.Optional(Type.Boolean({ default: false })),
  allowDelete: Type.Optional(Type.Boolean({ default: false })),
  allowMove: Type.Optional(Type.Boolean({ default: false })),
  allowMarkRead: Type.Optional(Type.Boolean({ default: false })),
  allowAutonomousMutation: Type.Optional(Type.Boolean({ default: false })),
}, { additionalProperties: false });

export type OutlookGraphConfig = Static<typeof OutlookGraphConfigSchema>;

export function normalizeConfig(input: Partial<OutlookGraphConfig> | Record<string, unknown> | undefined): OutlookGraphConfig {
  const cfg = (input ?? {}) as Partial<OutlookGraphConfig>;
  return {
    clientId: String(cfg.clientId ?? ""),
    tenantMode: (cfg.tenantMode === "common" ? "common" : "consumers"),
    redirectUri: String(cfg.redirectUri ?? ""),
    tokenStorePath: String(cfg.tokenStorePath ?? ""),
    downloadDir: String(cfg.downloadDir ?? ""),
    allowSend: Boolean(cfg.allowSend ?? false),
    allowDelete: Boolean(cfg.allowDelete ?? false),
    allowMove: Boolean(cfg.allowMove ?? false),
    allowMarkRead: Boolean(cfg.allowMarkRead ?? false),
    allowAutonomousMutation: Boolean(cfg.allowAutonomousMutation ?? false),
  };
}