import { z } from "zod";
import { VariantSchema } from "./create-variant";

export const CreateProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }).trim(),
  price: z.coerce.number().gt(0, { message: "Price mut be greater than 0" }),
  images: z
    .array(z.any())
    .max(5, { message: "Each product can only have a maximum of 5 images" }),
  categories: z.array(z.string()),
  description: z.string().trim(),

  variants: z.array(VariantSchema),
});
export type CreateProductPayload = z.infer<typeof CreateProductSchema>;
