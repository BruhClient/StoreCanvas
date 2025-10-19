// schemas/variant.ts
import { z } from "zod";

export const VariantOptionSchema = z.object({
  name: z.string().min(1, "Option name is required").trim(),
  price: z.coerce.number().nonnegative("Price must be >= 0"),
});

export const VariantSchema = z.object({
  optionPrompt: z.string().min(1, "Prompt is required").trim(),
  required: z.boolean(),
  maxSelections: z.number().int().positive(),
  options: z.array(VariantOptionSchema).min(1, "At least one option required"),
});

export type VariantPayload = z.infer<typeof VariantSchema>;
export type VariantOptionPayload = z.infer<typeof VariantOptionSchema>;
