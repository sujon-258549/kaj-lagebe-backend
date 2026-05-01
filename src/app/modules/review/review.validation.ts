import { z } from "zod";

const createReviewZodSchema = z.object({
  body: z.object({
    name: z.string({
      message: "Name is required",
    }),
    role: z.string().optional(),
    title: z.string().optional(),
    content: z.string({
      message: "Content is required",
    }),
    image: z.string().optional(),
    imageId: z.string().optional(),
    status: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    image: z.string().optional(),
    imageId: z.string().optional(),
    status: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
