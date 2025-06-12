import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .email({ message: "Must be a valid email" })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
});

export type SignInPayload = z.infer<typeof SignInSchema>;
