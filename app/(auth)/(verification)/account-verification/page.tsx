import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/server/actions/auth/mail";
import {
  deleteVerificationTokenByToken,
  generateVerificationToken,
  getVerificationTokenByToken,
} from "@/server/actions/auth/verificationToken";
import { updateUserByEmail } from "@/server/db/users";
import { Check } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  const filters = await searchParams;
  const token = filters.token ?? "";

  if (!token) {
    redirect("/");
  }

  let isExpired = false;
  let isVerified = false;

  const verificationToken = await getVerificationTokenByToken(token);

  if (verificationToken) {
    const currentTime = new Date();
    const expiryDate = new Date(verificationToken.expires);

    if (expiryDate <= currentTime) {
      const newVerificationToken = await generateVerificationToken(
        verificationToken.identifier,
        verificationToken.emailReplaced
      );
      await sendVerificationEmail(
        newVerificationToken.identifier,
        newVerificationToken.token
      );
      isExpired = true;
    } else {
      if (verificationToken.emailReplaced) {
        await updateUserByEmail(verificationToken.identifier, {
          emailVerified: currentTime,
          email: verificationToken.emailReplaced,
        });
      } else {
        await updateUserByEmail(verificationToken.identifier, {
          emailVerified: currentTime,
        });
      }

      deleteVerificationTokenByToken(verificationToken.token);
      isVerified = true;
    }
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-lg space-y-4">
            <div className="text-2xl font-bold">
              Your Verification Token has Expired
            </div>
            <div className="text-muted-foreground font-serif ">
              Check your inbox folder for our verifcation link
            </div>
            <Button asChild>
              <Link href={"/"}>Back to Home Page</Link>
            </Button>
          </div>
        </div>
        <div className="hidden lg:block lg:w-[60vw] bg-muted">
          <img
            src="/hero-image.jpg"
            alt="Login Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-4 left-4">
          <Logo />
        </div>
      </div>
    );
  }
  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-lg space-y-4">
            <div className="text-2xl font-bold">
              We could'nt find your Verification Token
            </div>
            <div className="text-muted-foreground font-serif ">
              Please try again .
            </div>
            <Button asChild>
              <Link href={"/"}>Back to Home Page</Link>
            </Button>
          </div>
        </div>
        <div className="hidden lg:block lg:w-[60vw] bg-muted">
          <img
            src="/hero-image.jpg"
            alt="Login Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-4 left-4">
          <Logo />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-4">
          <div className="text-2xl font-bold flex items-center gap-2">
            <div className="bg-green-400 w-fit rounded-full p-2">
              <Check size={20} />
            </div>
            Your Account is Verified!
          </div>
          <div className="text-muted-foreground font-serif ">
            You can now sign in through email and password.
          </div>
          <Button asChild>
            <Link href={"/signin"}>Sign In</Link>
          </Button>
        </div>
      </div>
      <div className="hidden lg:block lg:w-[60vw] bg-muted">
        <img
          src="/hero-image.jpg"
          alt="Login Hero"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
    </div>
  );
};

export default page;
