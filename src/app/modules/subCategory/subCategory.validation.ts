import { z } from "zod";

export const subCategoryValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required"),
    }),
  }),
  update: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required").optional(),
    }),
  }),
};
