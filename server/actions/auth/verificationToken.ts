"use server";
import { v4 as uuidv4 } from "uuid";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sendVerificationEmail } from "./mail";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.identifier, email))
      .limit(1);

    return verificationToken[0];
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .limit(1);

    return verificationToken[0];
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (
  email: string,
  emailReplaced?: string
) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 10000);
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, existingToken.token));
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({
      identifier: email,
      token,
      emailReplaced,
      expires,
    })
    .returning();

  return verificationToken[0];
};

export const deleteVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .returning();

    return verificationToken[0];
  } catch {
    return null;
  }
};
