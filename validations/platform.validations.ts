import { z } from "zod";

export const createStaffSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  role: z.enum(["SUPERADMIN", "FINANCE", "OPS"]),
  password: z.string().min(8).max(128),
});

export type CreateStaffSchemaType = z.infer<typeof createStaffSchema>;

export const patchStaffSchema = z
  .object({
    role: z.enum(["SUPERADMIN", "FINANCE", "OPS"]).optional(),
    status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  })
  .refine((v) => v.role !== undefined || v.status !== undefined, {
    message: "At least one of role or status is required",
  });

export type PatchStaffSchemaType = z.infer<typeof patchStaffSchema>;

export const createProxySchema = z.object({
  label: z.string().trim().min(1).max(120),
  host: z.string().trim().min(1).max(255),
  port: z.number().int().min(1).max(65535),
  protocol: z.enum(["HTTP", "HTTPS", "SOCKS5"]),
  username: z.string().trim().max(120).optional().nullable(),
  password: z.string().max(256).optional().nullable(),
  region: z.string().trim().max(32).optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "DISABLED", "BANNED"]).optional(),
});

export type CreateProxySchemaType = z.infer<typeof createProxySchema>;

export const patchProxySchema = z
  .object({
    label: z.string().trim().min(1).max(120).optional(),
    host: z.string().trim().min(1).max(255).optional(),
    port: z.coerce.number().int().min(1).max(65535).optional(),
    protocol: z.enum(["HTTP", "HTTPS", "SOCKS5"]).optional(),
    username: z.string().trim().max(120).optional().nullable(),
    password: z.string().max(256).optional().nullable(),
    region: z.string().trim().max(32).optional().nullable(),
    status: z.enum(["AVAILABLE", "IN_USE", "DISABLED", "BANNED"]).optional(),
  })
  .refine((b) => Object.keys(b).length > 0, {
    message: "At least one field is required",
  });

export type PatchProxySchemaType = z.infer<typeof patchProxySchema>;

export const patchPlatformPlanSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    description: z.string().trim().max(500).optional().nullable(),
    monthlyPriceCents: z.coerce.number().int().nonnegative().optional(),
    seatLimit: z.coerce.number().int().nonnegative().optional(),
    shopLimit: z.coerce.number().int().nonnegative().optional(),
    botLimit: z.coerce.number().int().nonnegative().optional(),
    dailyInviteQuota: z.coerce.number().int().nonnegative().optional(),
    trialDays: z.coerce.number().int().min(0).max(90).optional(),
    stripePriceId: z.string().trim().min(1).max(120).optional().nullable(),
    isPublic: z.boolean().optional(),
    active: z.boolean().optional(),
    sortOrder: z.coerce.number().int().optional(),
  })
  .refine((b) => Object.keys(b).length > 0, {
    message: "At least one field is required",
  });

export type PatchPlatformPlanSchemaType = z.infer<
  typeof patchPlatformPlanSchema
>;
