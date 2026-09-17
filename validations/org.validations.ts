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
