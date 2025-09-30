import { z } from "zod";
import { CreateProductSchema } from "./create-product";
import { CreateAdditionalFieldsSchema } from "./create-addtional-fields";

export const CreateStoreSchema = z.object({
  storeName: z.string().min(1, "Store name is required").trim(),
  currency: z.enum(["USD", "SGD", "MYR"]),
  imageFile: z.any().nullable(), // file or null
  description: z.string().trim().nullable().default(null),
  allowComments: z.boolean(),
  instagram: z.string().trim().nullable().default(null),
  whatsapp: z.string().trim().nullable().default(null),
  tiktok: z.string().trim().nullable().default(null),
  telegram: z.string().trim().nullable().default(null),
  phoneNumber: z.string().trim().nullable().default(null),
  address: z.string().trim().nullable().default(null),

  categories: z.array(z.string().trim()).default([]), // safe default
  products: z.array(CreateProductSchema).default([]),
  additionalFields: z.array(CreateAdditionalFieldsSchema).default([]),
});

export type CreateStorePayload = z.infer<typeof CreateStoreSchema>;
