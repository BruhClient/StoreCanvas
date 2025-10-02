import { useMutation } from "@tanstack/react-query";
import type { InferSelectModel } from "drizzle-orm";
import { products } from "@/db/schema";
import { CreateProductPayload } from "@/schemas/create-product";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/server/db/products";
import { showErrorToast, showLoadingToast } from "@/lib/toast";
import { useStore } from "@/context/store-context";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import { extractFileKey } from "@/lib/utils";

type Product = InferSelectModel<typeof products>;

export function useProducts(storeId: string) {
  const { products: storeProducts, setProducts } = useStore();
  const { startUpload } = useUploadThing("productImages");

  const mutation = useMutation({
    mutationFn: async (action: {
      type: "create" | "update" | "delete";
      payload: any;
    }) => {
      switch (action.type) {
        case "create": {
          const product = await createProduct(action.payload, storeId);
          if (!product) throw new Error("Failed to create product");
          return product;
        }

        case "update": {
          const product = await updateProduct(
            action.payload.productId,
            action.payload.data
          );
          if (!product) throw new Error("Failed to update product");
          return product;
        }

        case "delete": {
          const deleted = await deleteProduct(action.payload.productId);
          if (!deleted) throw new Error("Failed to delete product");
          return { id: action.payload.productId };
        }

        default:
          throw new Error("Invalid mutation type");
      }
    },

    onMutate: async (action) => {
      const prevProducts = [...storeProducts];

      switch (action.type) {
        case "create": {
          let uploadedUrls: string[] = [];
          let toastId: string | number | null = null;

          if (action.payload.images?.length > 0) {
            toastId = showLoadingToast("Uploading images...", "Please wait...");
            try {
              const uploaded = await startUpload(action.payload.images);
              if (!uploaded) throw new Error("Failed to upload files");
              uploadedUrls = uploaded.map((f) => f.ufsUrl);
            } catch (err) {
              toast.dismiss(toastId);
              throw err;
            } finally {
              toast.dismiss(toastId);
            }
          }

          action.payload = { ...action.payload, images: uploadedUrls };

          const tempId = `temp-${Date.now()}`;
          const optimisticProduct = {
            id: tempId,
            ...action.payload,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          setProducts((prev) => [...prev, optimisticProduct]);

          return { prevProducts, tempId };
        }

        case "update": {
          const { productId, data } = action.payload;

          const existingProduct = storeProducts.find((p) => p.id === productId);
          if (!existingProduct) return { prevProducts };

          const newFiles =
            data.images?.filter((i: any) => i instanceof File) || [];
          const existingUrls =
            data.images?.filter((i: any) => typeof i === "string") || [];

          let uploadedUrls: string[] = [];
          let toastId: string | number | null = null;

          if (newFiles.length > 0) {
            toastId = showLoadingToast("Uploading images...", "Please wait...");
            try {
              const uploaded = await startUpload(newFiles);
              if (!uploaded) throw new Error("Failed to upload files");
              uploadedUrls = uploaded.map((f) => f.ufsUrl);
            } catch (err) {
              toast.dismiss(toastId);
              throw err;
            } finally {
              toast.dismiss(toastId);
            }
          }

          const removedImages = (existingProduct.images || []).filter(
            (url: string) => !existingUrls.includes(url)
          );

          if (removedImages.length > 0) {
            await Promise.allSettled(
              removedImages.map((url) => deleteFileFromUploadthing(url))
            );
          }

          const finalImages = [...existingUrls, ...uploadedUrls];
          const optimisticUpdate = {
            ...existingProduct,
            ...data,
            images: finalImages,
            updatedAt: new Date(),
          };

          setProducts((prev) =>
            prev.map((p) => (p.id === productId ? optimisticUpdate : p))
          );

          return { prevProducts, productId };
        }

        case "delete": {
          const { productId } = action.payload;

          // Find the product being deleted to know which images to remove later
          const productToDelete = storeProducts.find((p) => p.id === productId);

          // Optimistically remove the product from UI
          setProducts((prev) => prev.filter((p) => p.id !== productId));

          // Return previous state + images for rollback + later deletion
          return {
            prevProducts,
            productId,
            images: productToDelete?.images || [],
          };
        }

        default:
          return { prevProducts };
      }
    },

    onSuccess: async (data, action, context) => {
      if (!data) return;

      switch (action.type) {
        case "create":
          setProducts((prev) =>
            prev.map((p) => (p.id === context?.tempId ? data : p))
          );

          break;

        case "update":
          setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));

          break;

        case "delete":
          // Delete images after DB confirms deletion
          if (context?.images?.length) {
            await Promise.allSettled(
              context.images.map((url) =>
                deleteFileFromUploadthing(extractFileKey(url)!)
              )
            );
          }
          break;
      }
    },

    onError: (err, _action, context) => {
      if (context?.prevProducts) setProducts(context.prevProducts);
      showErrorToast(err?.message || "Something went wrong");
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
