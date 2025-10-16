//@ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useStore } from "@/context/store-context";
import { toSlug } from "@/lib/slug";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";
import { useUploadThing } from "@/lib/uploadthing";
import { extractFileKey } from "@/lib/utils";
import { EditStorePayload, EditStoreSchema } from "@/schemas/edit-store";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import { editStore, getStoreByName } from "@/server/db/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// Lazy-load the child form components
const StoreInformationForm = dynamic(
  () => import("@/components/forms/StoreInformationForm"),
  { ssr: false }
);
const StoreDescriptionForm = dynamic(
  () => import("@/components/forms/StoreDescriptionForm"),
  { ssr: false }
);
const StoreSocialsForm = dynamic(
  () => import("@/components/forms/StoreSocialsForm"),
  { ssr: false }
);
const DeleteStoreButton = dynamic(
  () => import("@/components/DeleteStoreButton"),
  { ssr: false }
);

const StoreSettingsPage = () => {
  const { store, setStore } = useStore();

  // Memoize default values to avoid recalculating on every render
  const defaultValues = useMemo(
    () => ({
      storeName: store?.name,
      imageFile: store?.imageUrl,
      ...store,
    }),
    [store]
  );

  const form = useForm<EditStorePayload>({
    resolver: zodResolver(EditStoreSchema),
    defaultValues,
  });

  const { startUpload } = useUploadThing("storeImages");

  const router = useRouter();

  const onSubmit = async (values: EditStorePayload) => {
    const toastId = showLoadingToast("Saving changes");
    try {
      const payload: Partial<EditStorePayload> = {};

      // --- Handle store name ---
      if (values.storeName && values.storeName.trim() !== store.name) {
        const existingStore = await getStoreByName(values.storeName.trim());

        if (existingStore) {
          throw Error("Store name already exist");
        }
        payload.name = values.storeName.trim();
      }

      // --- Handle image ---
      if (values.imageFile instanceof File) {
        if (store.imageUrl)
          await deleteFileFromUploadthing(extractFileKey(store.imageUrl)!);

        const uploadResult = await startUpload([values.imageFile]);
        if (!uploadResult) throw new Error("Failed to upload image");

        payload.imageUrl = uploadResult[0].ufsUrl;
      } else if (values.imageFile === null && store.imageUrl) {
        await deleteFileFromUploadthing(extractFileKey(store.imageUrl)!);
        payload.imageUrl = null;
      }

      // --- Handle other fields ---
      for (const key in values) {
        if (key !== "storeName" && key !== "imageFile") {
          const value = values[key as keyof EditStorePayload];
          if (
            value !== undefined &&
            value !== store[key as keyof typeof store]
          ) {
            payload[key as keyof EditStorePayload] = value;
          }
        }
      }

      if (Object.keys(payload).length === 0) {
        showSuccessToast("No changes detected");
        return;
      }

      const updatedStore = await editStore(store.id, payload);
      if (!updatedStore) {
        showErrorToast("Failed to update store");
        return;
      }

      setStore(updatedStore.data);

      showSuccessToast("Store updated successfully");

      if (payload.name) {
        router.replace(`/store/${toSlug(updatedStore.data.name)}/settings`);
      }
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex justify-center w-full py-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-3xl w-full space-y-3"
        >
          <StoreInformationForm form={form} />
          <StoreDescriptionForm form={form} />
          <StoreSocialsForm form={form} />

          <Button
            className="w-full"
            variant="outline"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            <Edit />
            Save Changes
          </Button>

          <DeleteStoreButton store={store} />
        </form>
      </Form>
    </div>
  );
};

export default StoreSettingsPage;
