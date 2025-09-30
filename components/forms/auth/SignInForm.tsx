"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInPayload, SignInSchema } from "@/schemas/auth/signin";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import OauthButtons from "@/components/auth/OauthButtons";
import { Separator } from "@/components/ui/separator";
import { signInWithEmailAndPassword } from "@/server/actions/auth/signin";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import FormTextInput from "@/components/FormTextInput";

const SignInForm = () => {
  const form = useForm<SignInPayload>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();
  const onSubmit = (values: SignInPayload) => {
    setIsPending(true);

    signInWithEmailAndPassword(values).then((data) => {
      if (data.error) {
        showErrorToast(data.error);
      } else if (data.success) {
        showSuccessToast(data.success, data.description);
        update();
        router.push(data.url);
      }
      setIsPending(false);
    });
  };

  return (
    <div className="space-y-6 selection:bg-muted ">
      <div className="space-y-3">
        <div className="font-semibold text-3xl">Welcome back</div>
        <div className="font-inter text-muted-foreground font-medium text-sm pl-1">
          Sign in to your account
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
          <div>
            <FormTextInput
              form={form}
              fieldName="password"
              placeholder="*****"
              type="password"
            />
            <Link
              href={"/forget-password"}
              className="text-sm text-muted-foreground"
            >
              Forget Password ?
            </Link>
          </div>

          {searchParams.get("error") && (
            <div className="text-sm flex items-center gap-2 font-semibold">
              <TriangleAlert size={20} />
              Account is linked to another provider
            </div>
          )}
          <Button className="w-full" size={"lg"} disabled={isPending}>
            Sign In
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm font-serif text-muted-foreground pt-4">
        Don't have an account?{" "}
        <Link
          href={"/signup"}
          className="font-semibold underline text-foreground"
        >
          Sign Up Now
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
