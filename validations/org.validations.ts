import z from "zod";

export const patchCurrentOrgSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" }),
});

export type PatchCurrentOrgSchemaType = z.infer<typeof patchCurrentOrgSchema>;
