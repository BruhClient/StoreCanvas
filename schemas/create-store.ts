import { z } from "zod";
import { CreateProductSchema } from "./create-product";
import { CreateAdditionalFieldsSchema } from "./create-addtional-fields";

export const CreateStoreSchema = z.object({
  storeName: z.string().min(1, "Store name is required").trim(),
  currency: z.enum(["USD", "SGD", "MYR"]),
  imageFile: z.any().nullable(),
  description: z.string().trim(),
  allowComments: z.boolean().default(false),
  instagram: z.string().trim(),
  whatsapp: z.string().trim(),
  tiktok: z.string().trim(),
  telegram: z.string(),
  phoneNumber: z.string().trim(),
  address: z.string().trim(),
  categories: z
    .array(z.string().trim())
    .min(1, "At least one category is required"),
  products: z
    .array(CreateProductSchema)
    .min(1, "At least one product is required"),
  additionalFields: z.array(CreateAdditionalFieldsSchema),
});
export type CreateStorePayload = z.infer<typeof CreateStoreSchema>;
