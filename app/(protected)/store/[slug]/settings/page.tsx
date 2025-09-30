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
      storeName: store.name,
      imageFile: store.imageUrl,
      ...store,
    },
  });
  const { startUpload } = useUploadThing("storeImages");

  const queryClient = useQueryClient();

  const router = useRouter();

  const onSubmit = async (values: EditStorePayload) => {
    try {
      // Handle image
      let imageUrl: string | null = values.imageFile as string | null;

      if (values.imageFile instanceof File) {
        if (store.imageUrl) {
          await deleteFileFromUploadthing(extractFileKey(store.imageUrl)!);
        }

        const uploadResult = await startUpload([values.imageFile]);
        if (!uploadResult) throw new Error("Failed to upload image");

        imageUrl = uploadResult[0].ufsUrl;
      } else if (values.imageFile === null) {
        if (store.imageUrl) {
          await deleteFileFromUploadthing(extractFileKey(store.imageUrl)!);
        }
        imageUrl = null;
      } else {
        imageUrl = store.imageUrl;
      }

      // Prepare payload
      const payload: Partial<EditStorePayload> = {
        ...values,
        imageUrl,
      };
      delete payload.imageFile;

      // Map storeName → DB column name
      let newStoreName: string | undefined;
      if (payload.storeName) {
        newStoreName = payload.storeName;
        //@ts-ignore
        payload.name = payload.storeName;
        delete payload.storeName;
      }

      // Update store
      const updatedStore = await editStore(store.id, payload);
      if (!updatedStore) {
        showErrorToast();
        return;
      }

      // Update React Query cache
      queryClient.setQueryData(
        ["userStores", updatedStore.user],
        (oldData: InferSelectModel<typeof stores>[] = []) =>
          oldData.map((userStore) =>
            userStore.id === store.id ? updatedStore.data : userStore
          )
      );

      setStore(updatedStore.data);

      showSuccessToast();
    } catch (error: any) {
      showErrorToast(error.message);
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
