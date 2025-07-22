import { z } from "zod";

export const UserSettingsSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Must be a valid email" })
      .toLowerCase()
      .trim(),
    username: z.string().min(1, { message: "Name cannot be empty" }),
    oldPassword: z.string().trim().optional(),
    newPassword: z.string().trim().optional(),
    confirmNewPassword: z.string().trim().optional(),
  })
  // Validate that new and confirm match
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmNewPassword,
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    }
  )
  // Require oldPassword if newPassword is entered
  .refine((data) => !data.newPassword || !!data.oldPassword, {
    message: "Old password is required when setting a new password",
    path: ["oldPassword"],
  })
  // Validate minimum length of newPassword if provided
  .refine((data) => !data.newPassword || data.newPassword.length >= 5, {
    message: "New password must be at least 5 characters",
    path: ["newPassword"],
  })
  // Validate minimum length of oldPassword if provided
  .refine((data) => !data.oldPassword || data.oldPassword.length >= 5, {
    message: "Old password must be at least 5 characters",
    path: ["oldPassword"],
  });

export type UserSettingsPayload = z.infer<typeof UserSettingsSchema>;
