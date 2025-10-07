//@ts-nocheck
"use client";
import DeleteStoreButton from "@/components/DeleteStoreButton";
import StoreDescriptionForm from "@/components/forms/StoreDescriptionForm";
import StoreInformationForm from "@/components/forms/StoreInformationForm";
import StoreSocialsForm from "@/components/forms/StoreSocialsForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useStore } from "@/context/store-context";
import { stores } from "@/db/schema";
import { toSlug } from "@/lib/slug";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useUploadThing } from "@/lib/uploadthing";
import { extractFileKey } from "@/lib/utils";
import { EditStorePayload, EditStoreSchema } from "@/schemas/edit-store";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import { editStore } from "@/server/db/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const StoreSettingsPage = () => {
  const { store, setStore } = useStore();
  const form = useForm<EditStorePayload>({
    resolver: zodResolver(EditStoreSchema),
    defaultValues: {
      storeName: store?.name,
      imageFile: store?.imageUrl,
      ...store,
    },
  });
  const { startUpload } = useUploadThing("storeImages");

  const queryClient = useQueryClient();

  const router = useRouter();

  const onSubmit = async (values: EditStorePayload) => {
    try {
      const payload: Partial<EditStorePayload> = {};

      // --- Handle store name ---
      if (values.storeName && values.storeName.trim() !== store.name) {
        payload.name = values.storeName.trim();
      }

      // --- Handle image ---
      if (values.imageFile instanceof File) {
        // User uploaded a new image → replace existing
        if (store.imageUrl)
          await deleteFileFromUploadthing(extractFileKey(store.imageUrl)!);

        const uploadResult = await startUpload([values.imageFile]);
        if (!uploadResult) throw new Error("Failed to upload image");

        payload.imageUrl = uploadResult[0].ufsUrl;
      } else if (values.imageFile === null && store.imageUrl) {
        // User wants to delete existing image
        await deleteFileFromUploadthing(extractFileKey(store.imageUrl)!);
        payload.imageUrl = null;
      }
      // If imageFile is undefined, we leave it unchanged

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

      // --- Skip update if nothing changed ---
      if (Object.keys(payload).length === 0) {
        showSuccessToast("No changes detected");
        return;
      }

      // --- Update store ---
      const updatedStore = await editStore(store.id, payload);
      if (!updatedStore) {
        showErrorToast("Failed to update store");
        return;
      }

      // --- Update context and React Query ---
      setStore(updatedStore.data);
      queryClient.setQueryData(
        ["userStores", updatedStore.user],
        (oldData: any) =>
          oldData.map((s: any) => (s.id === store.id ? updatedStore.data : s))
      );

      router.push(`/store/${toSlug(updatedStore.data.name)}/settings`);

      showSuccessToast("Store updated successfully");
    } catch (err: any) {
      showErrorToast(err.message);
    }
  };

  return (
    <div className="flex justify-center w-full py-3 ">
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
            variant={"outline"}
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
