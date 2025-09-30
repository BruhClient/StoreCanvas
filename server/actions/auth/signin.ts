"use server";

import { signIn } from "@/lib/auth";
import { SignInPayload, SignInSchema } from "@/schemas/auth/signin";
import { getUserByEmail } from "@/server/db/users";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "./verificationToken";
import { sendVerificationEmail } from "./mail";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { stores } from "@/db/schema";

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
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token
    );
    return {
      error: `Email is not verified . Sending new verification link to ${verificationToken.identifier}`,
    };
  }

  if (existingUser.isOauth) {
    return { error: "User is registered under another provider" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const userStores = await db.query.stores.findMany({
      where: eq(stores.ownerId, existingUser.id),
      orderBy: [desc(stores.createdAt)],
      limit: 1,
    });

    // Redirect depending on store existence
    if (userStores.length === 0) {
      return {
        success: `Hi ${existingUser.name} 👋`,
        description: "Lets get you started right away...",
        url: "/store/new",
      };
    }

    return {
      success: `Welcome back ${existingUser.name} 👋`,
      description: `Fetching you towards ${userStores[0].name}`,
      url: `/store/${userStores[0].name}`,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Your credentials are invalid",
          };
        default:
          return {
            error: "Please try again",
          };
      }
    }
    return {
      error: "Please try again",
    };
  }
};
