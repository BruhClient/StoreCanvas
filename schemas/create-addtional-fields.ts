// schemas/create-additional-fields.ts
import { z } from "zod";

export const CreateAdditionalFieldsSchema = z
  .object({
    prompt: z.string().min(1, { message: "Please enter your prompt" }),
    type: z.enum(["text", "options"]),
    options: z.array(z.string().min(1, "Option cannot be empty")).default([]), // no .optional() needed if you default to []
    required: z.boolean().default(true),
    maxSelections: z.number().default(1),
  })
  .superRefine((data, ctx) => {
    if (data.type === "options") {
      if (!data.options || data.options.length === 0) {
        ctx.addIssue({
          path: ["options"],
          code: "custom",
          message: "Please add at least one option",
        });
      } else {
        data.options.forEach((opt, i) => {
          if (!opt || opt.trim() === "") {
            ctx.addIssue({
              path: ["options", i],
              code: "custom",
              message: "Option cannot be empty",
            });
          }
        });
      }
    }
  });

export type CreateAdditionalFieldsPayload = z.infer<
  typeof CreateAdditionalFieldsSchema
>;
