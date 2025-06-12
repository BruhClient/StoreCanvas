"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { MotionDiv } from "@/components/Motion";
import { containerVariants } from "@/lib/variants";
import OauthButtons from "@/components/auth/OauthButtons";
import { Separator } from "@/components/ui/separator";
import { SignUpPayload, SignUpSchema } from "@/schemas/auth/signup";
import { signUpWithEmailAndPassword } from "@/server/actions/auth/signup";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

const SignUpForm = () => {
  const form = useForm<SignUpPayload>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",

      name: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const onSubmit = (values: SignUpPayload) => {
    startTransition(() => {
      signUpWithEmailAndPassword(values).then((data) => {
        if (data.error) {
          showErrorToast(data.error);
        } else {
          showSuccessToast(data.success);
          form.reset();
        }
      });
    });
  };

  return (
    <div className="space-y-6 selection:bg-muted ">
      <div className="space-y-3">
        <div className="font-semibold text-3xl">Get Started</div>
        <div className="font-inter text-muted-foreground font-medium text-sm pl-1">
          Create a new account
        </div>
      </div>

      <OauthButtons />

      <div className="relative flex items-center justify-center">
        <Separator />
        <div className="font-semibold absolute text-sm bg-background px-3">
          or
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground">
                  Username
                </FormLabel>
                <div className="relative flex items-center">
                  <FormControl>
                    <Input
                      {...field}
                      className="py-5 placeholder:font-semibold px-4"
                      placeholder="John Smith"
                    />
                  </FormControl>

                  {form.formState.errors.email && (
                    <CircleAlert
                      className="absolute right-3 stroke-destructive"
                      size={20}
                    />
                  )}
                </div>

                {form.formState.errors.name && (
                  <MotionDiv
                    className="text-sm text-destructive font-serif"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {form.formState.errors.name.message}
                  </MotionDiv>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground">
                  Password
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

                  {form.formState.errors.password && (
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

          <Button className="w-full" size={"lg"} disabled={isPending}>
            Sign Up
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm font-serif text-muted-foreground pt-4">
        Have an account?{" "}
        <Link
          href={"/signin"}
          className="font-semibold underline text-foreground"
        >
          Sign In Now
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
