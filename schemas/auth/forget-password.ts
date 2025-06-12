import { z } from "zod";

export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Must be a valid email" })
    .toLowerCase()
    .trim(),
  code: z.string().trim(),
});

export type ForgetPasswordPayload = z.infer<typeof ForgetPasswordSchema>;
