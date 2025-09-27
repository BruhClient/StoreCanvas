import { z } from "zod";

export const CreateAdditionalFieldsSchema = z
  .object({
    prompt: z.string().min(1, { message: "Please enter your prompt" }),
    type: z.enum(["text", "options"]),
    options: z.array(z.string().min(1, "Option cannot be empty")).optional(),
    allowMulitpleOptions: z.boolean().default(false),
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
        // Check for empty strings
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
