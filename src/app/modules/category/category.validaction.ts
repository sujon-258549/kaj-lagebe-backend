import { z } from "zod";

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    icon: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    status: z.boolean().optional(),
    imageId: z.string().optional().nullable(),
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    icon: z.string().optional().nullable(),
    slug: z.string().optional(),
    description: z.string().optional().nullable(),
    status: z.boolean().optional(),
    imageId: z.string().optional().nullable(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
