"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { NullableInput } from "../NullableInput";
import { StoreSocialsPayload } from "@/schemas/store-steps";

const StoreSocialsForm = ({
  form,
}: {
  form: UseFormReturn<StoreSocialsPayload>;
}) => {
  return (
    <div className="space-y-5 ">
      <NullableInput control={form.control} name="address" label="Address" />
      <NullableInput
        control={form.control}
        name="instagram"
        label="Instagram"
      />
      <NullableInput control={form.control} name="whatsapp" label="Whatsapp" />
      <NullableInput
        control={form.control}
        name="phoneNumber"
        label="Phone Number"
      />
      <NullableInput control={form.control} name="telegram" label="Telegram" />
      <NullableInput control={form.control} name="tiktok" label="Tiktok" />
    </div>
  );
};

export default StoreSocialsForm;
