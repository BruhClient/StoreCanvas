"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, InferModel } from "drizzle-orm";

export const getUserById = async (id: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id));

    return user[0];
  } catch {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user[0];
  } catch {
    return null;
  }
};

type User = Partial<InferModel<typeof users>>;
export const updateUserById = async (id: string, options: User) => {
  try {
    await db
      .update(users)
      .set({
        ...options,
      })
      .where(eq(users.id, id));

    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return user[0];
  } catch {
    return null;
  }
};

export const updateUserByEmail = async (email: string, options: User) => {
  try {
    await db
      .update(users)
      .set({
        ...options,
      })
      .where(eq(users.email, email));

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user[0];
  } catch {
    return null;
  }
};

export const createUser = async (email: string, options: User) => {
  try {
    const user = await db.insert(users).values({
      email,
      ...options,
    });

    return user;
  } catch {
    return null;
  }
};
