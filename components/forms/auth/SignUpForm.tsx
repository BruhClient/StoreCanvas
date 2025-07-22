"use client";

import React, { useState } from "react";
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
import FormTextInput from "@/components/FormTextInput";

const SignUpForm = () => {
  const form = useForm<SignUpPayload>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",

      name: "",
    },
  });

  const [isPending, setIsPending] = useState(false);
  const onSubmit = (values: SignUpPayload) => {
    setIsPending(true);
    signUpWithEmailAndPassword(values).then((data) => {
      if (data.error) {
        showErrorToast(data.error);
      } else {
        showSuccessToast(data.success);
        form.reset();
      }
      setIsPending(false);
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
          <FormTextInput
            form={form}
            fieldName="email"
            placeholder="janedoe@gmail.com"
          />
          <FormTextInput form={form} fieldName="name" placeholder="Jane Doe" />

          <FormTextInput
            form={form}
            fieldName="password"
            type="password"
            placeholder="*****"
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
