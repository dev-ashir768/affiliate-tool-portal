import { z } from "zod";

export const checkoutSessionSchema = z.object({
  planCode: z.string().min(1, "Plan is required"),
});

export type CheckoutSessionSchemaType = z.infer<typeof checkoutSessionSchema>;
