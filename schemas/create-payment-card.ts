import { z } from "zod";

export const CreatePaymentCardSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Card name is maxed at 30 characters" })
    .trim(),
});

export type CreatePaymentCardPayload = z.infer<typeof CreatePaymentCardSchema>;
