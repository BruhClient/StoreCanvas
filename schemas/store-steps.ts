// schemas/store-steps.ts
import { z } from "zod";
import { CreateStoreSchema } from "./create-store";

// Step 1: Store Information
export const StoreInformationSchema = CreateStoreSchema.pick({
  storeName: true,
  currency: true,
  imageFile: true,
});
export type StoreInformationPayload = z.infer<typeof StoreInformationSchema>;

// Step 2: Store Description
export const StoreDescriptionSchema = CreateStoreSchema.pick({
  description: true,
  allowComments: true,
});
export type StoreDescriptionPayload = z.infer<typeof StoreDescriptionSchema>;

// Step 3: Social Media
export const StoreSocialsSchema = CreateStoreSchema.pick({
  instagram: true,
  tiktok: true,
  whatsapp: true,
  telegram: true,
  phoneNumber: true,
  address: true,
});
export type StoreSocialsPayload = z.infer<typeof StoreSocialsSchema>;

// Step 4: Product Categories
export const ProductCategoriesSchema = CreateStoreSchema.pick({
  categories: true,
});
export type ProductCategoriesPayload = z.infer<typeof ProductCategoriesSchema>;

// Step 5: Add Products
export const AddProductsSchema = CreateStoreSchema.pick({
  products: true,
});
export type AddProductsPayload = z.infer<typeof AddProductsSchema>;

// Step 6: Additional Fields
export const AdditionalFieldsSchema = CreateStoreSchema.pick({
  additionalFields: true,
});
export type AdditionalFieldsPayload = z.infer<typeof AdditionalFieldsSchema>;
