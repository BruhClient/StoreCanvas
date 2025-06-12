"use client";

import React from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  ForgetPasswordPayload,
  ForgetPasswordSchema,
} from "@/schemas/auth/forget-password";

const ForgetPasswordForm = () => {
  const form = useForm<ForgetPasswordPayload>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgetPasswordPayload) => {};

  return (
    <div className="space-y-7 selection:bg-muted ">
      <div className="space-y-3">
        <div className="font-semibold text-3xl">Reset Your Password</div>
        <div className="font-inter text-muted-foreground font-medium text-sm pl-1">
          Type in your email and we'll send you a link to reset your password
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
          <Separator />
          <Button className="w-full" size={"lg"}>
            Send Reset Email
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
