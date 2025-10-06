import { z } from "zod";

export const CreateSaleSessionSchema = z.object({
  paymentType: z.enum(["paynow", "cards"]),
  accountId: z.string().min(1, { message: "Account Id is required" }),
});
export type CreateSaleSessionPayload = z.infer<typeof CreateSaleSessionSchema>;
