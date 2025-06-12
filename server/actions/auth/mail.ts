"use server";
import { env } from "@/data/env/server";
import { PasswordResetEmail } from "@/email_templates/PasswordResetTemplate";
import { VerificationEmail } from "@/email_templates/VerificationTemplate";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_VERCEL_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/account-verification?token=${token}`;

  console.log(confirmLink);
  try {
    await resend.emails.send({
      from: "mail@quizpdf.net",
      to: email,
      subject: "Confirm your email",
      react: VerificationEmail({ verificationUrl: confirmLink }),
    });
    return {
      success: "Email Sent",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong",
    };
  }
};

export const sendPasswordResetEmail = async (email: string, code: string) => {
  try {
    await resend.emails.send({
      from: "mail@quizpdf.net",
      to: email,
      subject: "Password Reset Code",
      react: PasswordResetEmail({ code }),
    });
    return {
      success: "Email Sent",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong",
    };
  }
};
