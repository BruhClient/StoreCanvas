"use server";

import { signIn } from "@/lib/auth";
import { SignInPayload, SignInSchema } from "@/schemas/auth/signin";
import { getUserByEmail } from "@/server/db/users";
import { AuthError } from "next-auth";

export const signInWithEmailAndPassword = async (data: SignInPayload) => {
  const validatedFields = SignInSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid Login Request",
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: "Email is not linked to any account",
    };
  }

  if (!existingUser.emailVerified) {
  }

  if (existingUser.isOauth) {
    return { error: "User is registered under another provider" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return {
      success: "Successfully logged in",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return {
            error: "Something went wrong",
          };
      }
    }
    return {
      error: "Something went wrong",
    };
  }
};
