import z from "zod";

export const patchCurrentOrgSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" }),
});

export type PatchCurrentOrgSchemaType = z.infer<typeof patchCurrentOrgSchema>;

export const createInviteSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email" }),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export type CreateInviteSchemaType = z.infer<typeof createInviteSchema>;

export const acceptInviteSchema = z.object({
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .optional(),
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .optional(),
});

export type AcceptInviteSchemaType = z.infer<typeof acceptInviteSchema>;

/** Client form schema when the invitee is a new (stub) user. */
export const acceptInviteNewUserSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type AcceptInviteNewUserSchemaType = z.infer<
  typeof acceptInviteNewUserSchema
>;
