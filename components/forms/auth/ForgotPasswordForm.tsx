"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { MotionDiv } from "@/components/Motion";
import { containerVariants } from "@/lib/variants";
import { Separator } from "@/components/ui/separator";
import {
  ForgetPasswordPayload,
  ForgetPasswordSchema,
} from "@/schemas/auth/forget-password";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  deletePasswordResetTokenById,
  generatePasswordResetToken,
  updatePassword,
} from "@/server/actions/auth/passwordResetToken";
import { sendPasswordResetEmail } from "@/server/actions/auth/mail";
import { useRouter } from "next/navigation";
const ForgetPasswordForm = () => {
  const form = useForm<ForgetPasswordPayload>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [stage, setStage] = useState<number>(0);

  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const onSubmit = async (values: ForgetPasswordPayload) => {
    if (stage === 0) {
      // Send email logic
      startTransition(() => {
        generatePasswordResetToken(values.email).then(async (data) => {
          if (data.error) {
            showErrorToast();
          } else {
            await sendPasswordResetEmail(
              data.success!.identifier,
              data.success!.code
            );
            setVerificationCode(data.success!.code);
            setStage(1);
          }
        });
      });
    } else if (stage === 1) {
      if (values.code?.length !== 6) {
        form.setError("code", { message: "Please enter a valid code" });
        return;
      }
      if (verificationCode === values.code) {
        startTransition(() => {
          deletePasswordResetTokenById(values.email).then(() => {
            setStage(2);
          });
        });
      } else {
        showErrorToast("Incorrect code");
      }
    } else {
      if (values.password.length < 5)
        form.setError("password", {
          message: "Password must be at least 5 characters",
        });
      else if (values.password != values.confirmPassword)
        form.setError("confirmPassword", {
          message: "Passwords do not match",
        });
      else {
        startTransition(() => {
          updatePassword(values.email, values.password).then((data) => {
            if (!data) {
              showErrorToast();
            } else {
              router.push("/signin");
              showSuccessToast("Password Changed");
            }
          });
        });
      }
    }
  };

  return (
    <div className="space-y-7 selection:bg-muted ">
      <div className="space-y-3">
        <div className="font-semibold text-3xl">Reset Your Password</div>
        <div className="font-inter text-muted-foreground font-medium text-sm pl-1">
          Type in your email and we'll send you a link to reset your password
        </div>
      </div>
      <Form {...form}>
        <form
          key={stage}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {stage === 0 ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                  <div className="relative flex items-center">
                    <FormControl>
                      <Input
                        {...field}
                        className="py-5 placeholder:font-semibold px-4"
                        placeholder="you@example.com"
                      />
                    </FormControl>

                    {form.formState.errors.email && (
                      <CircleAlert
                        className="absolute right-3 stroke-destructive"
                        size={20}
                      />
                    )}
                  </div>

                  {form.formState.errors.email && (
                    <MotionDiv
                      className="text-sm text-destructive font-serif"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {form.formState.errors.email.message}
                    </MotionDiv>
                  )}
                </FormItem>
              )}
            />
          ) : stage === 1 ? (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex-col flex items-center justify-center py-4 gap-3">
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <div className="text-sm font-medium">
                      Enter your one time verification code
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      New Password
                    </FormLabel>
                    <div className="relative flex items-center">
                      <FormControl>
                        <Input
                          {...field}
                          className="py-5 placeholder:font-semibold px-4"
                          placeholder="•••••••"
                          type="password"
                        />
                      </FormControl>

                      {form.formState.errors.email && (
                        <CircleAlert
                          className="absolute right-3 stroke-destructive"
                          size={20}
                        />
                      )}
                    </div>

                    {form.formState.errors.password && (
                      <MotionDiv
                        className="text-sm text-destructive font-serif"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {form.formState.errors.password.message}
                      </MotionDiv>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-muted-foreground">
                      Confirm Password
                    </FormLabel>
                    <div className="relative flex items-center">
                      <FormControl>
                        <Input
                          {...field}
                          className="py-5 placeholder:font-semibold px-4"
                          placeholder="•••••••"
                          type="password"
                        />
                      </FormControl>

                      {form.formState.errors.confirmPassword && (
                        <CircleAlert
                          className="absolute right-3 stroke-destructive"
                          size={20}
                        />
                      )}
                    </div>

                    {form.formState.errors.confirmPassword && (
                      <MotionDiv
                        className="text-sm text-destructive font-serif"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {form.formState.errors.confirmPassword.message}
                      </MotionDiv>
                    )}
                  </FormItem>
                )}
              />
            </>
          )}

          <Separator />
          <Button
            className="w-full"
            size={"lg"}
            type="submit"
            disabled={isPending}
          >
            {stage === 0 ? "Send Reset Email" : "Reset Password"}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm font-serif text-muted-foreground pt-4">
        Have an account?{" "}
        <Link
          href={"/signin"}
          className="font-semibold underline text-foreground"
        >
          Sign Up Now
        </Link>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;
