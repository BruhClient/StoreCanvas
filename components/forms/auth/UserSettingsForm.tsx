import FormTextInput from "@/components/FormTextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useSessionUser from "@/hooks/use-session-user";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  UserSettingsPayload,
  UserSettingsSchema,
} from "@/schemas/auth/user-settings";
import { updateUserSettings } from "@/server/actions/auth/user-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const UserSettingsForm = () => {
  const { data: session, update } = useSession();
  const form = useForm({
    resolver: zodResolver(UserSettingsSchema),
    defaultValues: {
      email: session?.user.email!,
      username: session?.user.name,
      newPassword: "",
      oldPassword: "",
      confirmNewPassword: "",
    },
  });
  const [isPending, setIsPending] = useState(false);
  const onSubmit = (values: UserSettingsPayload) => {
    setIsPending(true);
    updateUserSettings(values).then((data) => {
      if (data.success) {
        showSuccessToast(data.success);
      } else {
        showErrorToast(data.error);
      }
      setIsPending(false);
      update();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormTextInput
          form={form}
          fieldName="email"
          placeholder="janedoe@gmail.com"
          disabled={session?.user?.isOauth}
        />
        <FormTextInput
          form={form}
          fieldName="username"
          placeholder="Jane Doe"
        />
        {!session?.user?.isOauth && (
          <>
            <FormTextInput
              form={form}
              fieldName="oldPassword"
              placeholder="*****"
              label="Old Password"
              type="password"
            />
            <FormTextInput
              form={form}
              fieldName="newPassword"
              placeholder="*****"
              label="New Password"
              type="password"
            />
            <FormTextInput
              form={form}
              fieldName="confirmNewPassword"
              placeholder="*****"
              label="Confirm New Password"
              type="password"
            />
          </>
        )}

        <Button className="w-full" disabled={isPending}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default UserSettingsForm;
