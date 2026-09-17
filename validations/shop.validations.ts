import { z } from "zod";

export const connectShopSchema = z.object({
  region: z.enum(["US", "UK"]),
});

export type ConnectShopSchemaType = z.infer<typeof connectShopSchema>;
