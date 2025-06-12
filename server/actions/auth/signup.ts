"use server";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { createUser, getUserByEmail } from "@/server/db/users";
import { SignUpPayload, SignUpSchema } from "@/schemas/auth/signup";
import { generateVerificationToken } from "./verificationToken";
import { sendVerificationEmail } from "./mail";

export const signUpWithEmailAndPassword = async (values: SignUpPayload) => {
  try {
    const { name, password, email } = SignUpSchema.parse(values);

    const accountExists = await getUserByEmail(email);

    if (accountExists)
      return {
        error: "Account already exists",
      };

    const hashedPassword = await bcryptjs.hash(password, 4);

    const data = await createUser(email, {
      hashedPassword,
      name,
    });

    if (!data) {
      return {
        error: "Failed to create user",
      };
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token
    );

    return {
      success: `Verification email sent to ${verificationToken.identifier}`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: "Payload format invalid",
      };
    }
    return {
      error: "Something went wrong",
    };
  }
};
