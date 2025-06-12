"use server";
import { db } from "@/db";
import { codeVerificationTokens } from "@/db/schema";
import { getUserByEmail, updateUserByEmail } from "@/server/db/users";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const codeVerificationToken = await db
      .select()
      .from(codeVerificationTokens)
      .where(eq(codeVerificationTokens.identifier, email))
      .limit(1);
    return codeVerificationToken[0];
  } catch {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: "User does not exist",
    };
  }
  if (existingUser.isOauth) {
    return {
      error: "User is signed in with a Oauth Provider",
    };
  }
  const code = crypto.randomInt(100_000, 999_999).toString();

  const expires = new Date(new Date().getTime() + 3600 * 10000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(codeVerificationTokens)
      .where(eq(codeVerificationTokens.identifier, existingToken.identifier));
  }

  const codeVerificationToken = await db
    .insert(codeVerificationTokens)
    .values({
      code,
      expires,
      identifier: email,
    })
    .returning();

  return {
    success: codeVerificationToken[0],
  };
};

export const deletePasswordResetTokenById = async (id: string) => {
  try {
    const codeVerificationToken = await db
      .delete(codeVerificationTokens)
      .where(eq(codeVerificationTokens.identifier, id))
      .returning();

    return codeVerificationToken[0];
  } catch {
    return null;
  }
};

export const updatePassword = async (email: string, password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 4);

    const user = updateUserByEmail(email, {
      hashedPassword,
    });

    return user;
  } catch {
    return null;
  }
};
