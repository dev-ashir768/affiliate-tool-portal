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
