import { z } from "zod";

export const UpdateUsernameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Username is required" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .trim(),
});

export type UpdateUsernamePayload = z.infer<typeof UpdateUsernameSchema>;
