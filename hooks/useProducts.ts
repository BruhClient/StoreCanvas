import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferSelectModel } from "drizzle-orm";
import { products } from "@/db/schema";
import { CreateProductPayload } from "@/schemas/create-product";
import { useUploadThing } from "@/lib/uploadthing";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/server/db/products";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import {
  showLoadingToast,
  showErrorToast,
  showSuccessToast,
} from "@/lib/toast";
import { toast } from "sonner";

type Product = InferSelectModel<typeof products>;

export function useProducts(storeId: string) {
  const queryClient = useQueryClient();
  const { startUpload } = useUploadThing("productImages");

  const mutation = useMutation({
    mutationFn: async (action: {
      type: "create" | "update" | "delete";
      payload: any;
    }) => {
      let toastId: string | number | null = null;
      try {
        toastId = showLoadingToast(
          action.type === "delete" ? "Deleting..." : "Saving product..."
        );

        if (action.type === "create") {
          let imageUrls = action.payload.images;
          let uploadedKeys: string[] = [];

          if (imageUrls?.some((i: any) => i instanceof File)) {
            const uploaded = await startUpload(imageUrls);
            if (!uploaded) throw new Error("Failed to upload images");

            uploadedKeys = uploaded.map((i) => i.key);
            imageUrls = uploaded.map((i) => i.ufsUrl);
          }

          const product = await createProduct(
            { ...action.payload, images: imageUrls },
            storeId
          );

          if (!product && uploadedKeys.length) {
            await Promise.allSettled(
              uploadedKeys.map((k) => deleteFileFromUploadthing(k))
            );
          }

          return product;
        }

        if (action.type === "update") {
          let imageUrls = action.payload.data.images;
          let uploadedKeys: string[] = [];

          if (imageUrls?.some((i: any) => i instanceof File)) {
            const uploaded = await startUpload(imageUrls);
            if (!uploaded) throw new Error("Failed to upload images");

            uploadedKeys = uploaded.map((i) => i.key);
            imageUrls = uploaded.map((i) => i.ufsUrl);
          }

          const product = await updateProduct(action.payload.productId, {
            ...action.payload.data,
            images: imageUrls,
          });

          if (!product && uploadedKeys.length) {
            await Promise.allSettled(
              uploadedKeys.map((k) => deleteFileFromUploadthing(k))
            );
          }

          return product;
        }

        if (action.type === "delete") {
          return await deleteProduct(action.payload.productId);
        }

        throw new Error("Invalid mutation type");
      } finally {
        if (toastId) toast.dismiss(toastId);
      }
    },

    onMutate: async (action) => {
      // Optimistic updates only for update and delete
      if (action.type === "update" || action.type === "delete") {
        await queryClient.cancelQueries({ queryKey: ["products", storeId] });

        const previous = queryClient.getQueryData<Product[]>([
          "products",
          storeId,
        ]);

        queryClient.setQueryData<Product[]>(
          ["products", storeId],
          (old = []) => {
            switch (action.type) {
              case "update":
                return old.map((p) =>
                  p.id === action.payload.productId
                    ? { ...p, ...action.payload.data }
                    : p
                );
              case "delete":
                return old.filter((p) => p.id !== action.payload.productId);
              default:
                return old;
            }
          }
        );

        return { previous };
      }
    },

    onError: (_err, action, ctx: any) => {
      if (
        (action.type === "update" || action.type === "delete") &&
        ctx?.previous
      ) {
        queryClient.setQueryData(["products", storeId], ctx.previous);
      }
      showErrorToast(_err?.message || "Something went wrong");
    },

    onSuccess: async (_data, action) => {
      showSuccessToast(
        action.type === "delete"
          ? "Product deleted!"
          : action.type === "update"
            ? "Product updated!"
            : "Product created!"
      );
      await queryClient.invalidateQueries({ queryKey: ["products", storeId] });
    },
  });

  return {
    ...mutation,
    create: (data: CreateProductPayload) =>
      mutation.mutate({ type: "create", payload: data }),
    update: (productId: string, data: CreateProductPayload) =>
      mutation.mutate({ type: "update", payload: { productId, data } }),
    remove: (productId: string) =>
      mutation.mutate({ type: "delete", payload: { productId } }),
  };
}
