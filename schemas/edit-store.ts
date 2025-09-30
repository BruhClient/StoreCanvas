import { CreateStoreSchema } from "@/schemas/create-store";
import { z } from "zod";

export const EditStoreSchema = CreateStoreSchema.pick({
  storeName: true,
  currency: true,
  imageFile: true,
  description: true,
  allowComments: true,
  instagram: true,
  whatsapp: true,
  tiktok: true,
  telegram: true,
  address: true,
  phoneNumber: true,
});

export type EditStorePayload = z.infer<typeof EditStoreSchema>;
