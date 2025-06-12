import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  name: z
    .string()
    .min(1, { message: "Username is required" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .trim(),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
});

export type SignUpPayload = z.infer<typeof SignUpSchema>;
