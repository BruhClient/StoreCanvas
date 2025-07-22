"use server";

import { auth } from "@/lib/auth";
import { UserSettingsPayload } from "@/schemas/auth/user-settings";
import { getUserByEmail, getUserById, updateUserById } from "@/server/db/users";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "./verificationToken";
import { sendVerificationEmail } from "./mail";
export const updateUserSettings = async (values: UserSettingsPayload) => {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  let passwordChanged = false;
  let emailChanged = false;
  let nameChanged = false;

  if (values.username != session.user.name) {
    nameChanged = true;
  }

  if (values.email != session.user.email) {
    const user = await getUserByEmail(values.email);
    if (user) {
      return {
        error: "Email already in use",
      };
    } else {
      emailChanged = true;
    }
  }

  if (values.oldPassword) {
    const user = await getUserById(session.user.id);

    if (user) {
      const isMatched = await bcrypt.compare(
        values.oldPassword,
        user.hashedPassword!
      );
      if (isMatched) {
        passwordChanged = true;
      } else {
        return {
          error: "Old Password incorrect .",
        };
      }
    }
  }

  try {
    if (passwordChanged) {
      const newHashedPassword = await bcrypt.hash(values.newPassword!, 4);

      await updateUserById(session.user.id, {
        hashedPassword: newHashedPassword,
      });
    }

    if (nameChanged) {
      await updateUserById(session.user.id, {
        name: values.username,
      });
    }

    if (emailChanged) {
      const token = await generateVerificationToken(
        session.user.email!,
        values.email
      );
      await sendVerificationEmail(session.user.email!, token.token);
      return {
        success: `Email Verification Sent . ( ${session.user.email} )`,
      };
    }

    return {
      success: "User Settings Updated !",
    };
  } catch (error: any) {
    return {
      error: "Something went wrong",
    };
  }
};
