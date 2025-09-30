"use client";
import AdditionalFieldsForm from "@/components/forms/AdditionalFieldsForm";
import { Form } from "@/components/ui/form";
import { useStore } from "@/context/store-context";
import { useDebounce } from "@/hooks/use-debounce";
import { showErrorToast } from "@/lib/toast";
import {
  AdditionalFieldsPayload,
  AdditionalFieldsSchema,
} from "@/schemas/store-steps";
import { editStore } from "@/server/db/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const AdditionalFields = () => {
  const { store, setStore } = useStore();

  const form = useForm<AdditionalFieldsPayload>({
    //@ts-ignore
    resolver: zodResolver(AdditionalFieldsSchema),
    defaultValues: {
      additionalFields: store.additionalFields ?? [],
    },
  });

  // Watch the additionalFields value
  const values = form.watch("additionalFields");

  // Debounce changes by 500ms
  const debouncedValues = useDebounce(values, 500) ?? [];

  useEffect(() => {
    const updateStore = async () => {
      //@ts-ignore
      setStore({ ...store, additionalFields: debouncedValues });
      try {
        const data = await editStore(store.id, {
          //@ts-ignore
          additionalFields: debouncedValues,
        });
        if (!data) showErrorToast();
      } catch {
        showErrorToast();
      }
    };

    if (debouncedValues) {
      updateStore();
    }
  }, [debouncedValues, store.id]);

  return (
    <Form {...form}>
      <form className="max-w-lg w-full">
        {/* @ts-ignore */}
        <AdditionalFieldsForm form={form} />
      </form>
    </Form>
  );
};

export default AdditionalFields;
