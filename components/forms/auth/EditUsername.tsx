"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import { MotionDiv } from "@/components/Motion";
import { containerVariants } from "@/lib/variants";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  UpdateUsernamePayload,
  UpdateUsernameSchema,
} from "@/schemas/auth/update-username";
import { updateUserById } from "@/server/db/users";
import { useSession } from "next-auth/react";

const UpdateUsernameButton = ({
  initialUsername,
  userId,
}: {
  initialUsername: string;
  userId: string;
}) => {
  const form = useForm<UpdateUsernamePayload>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      name: initialUsername,
    },
  });

  const { update } = useSession();

  const [isPending, setIsPending] = useState(false);
  const onSubmit = (values: UpdateUsernamePayload) => {
    setIsPending(true);
    updateUserById(userId, values).then((data) => {
      if (!data) {
        showErrorToast();
      } else {
        showSuccessToast("Username updated");
        update();
      }
      setIsPending(false);
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 max-w-[500px] w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="relative flex items-center">
                <FormControl>
                  <Input
                    {...field}
                    className="py-5 placeholder:font-semibold px-4"
                    placeholder="you@example.com"
                  />
                </FormControl>

                {form.formState.errors.name && (
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

        <Button className="h-full" disabled={isPending}>
          Update
        </Button>
      </form>
    </Form>
  );
};

export default UpdateUsernameButton;
