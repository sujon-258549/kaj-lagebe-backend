import { z } from "zod";

const createSubCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().min(1, "Category ID is required"),
    description: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    slug: z.string().optional(),
    status: z.boolean().optional(),
    imageId: z.string().optional().nullable(),
  }),
});

const updateSubCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    categoryId: z.string().optional(),
    description: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    slug: z.string().optional(),
    status: z.boolean().optional(),
    imageId: z.string().optional().nullable(),
  }),
});

export const SubCategoryValidation = {
  createSubCategoryZodSchema,
  updateSubCategoryZodSchema,
};
