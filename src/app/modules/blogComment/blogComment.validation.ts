import { z } from "zod";

const createBlogCommentZodSchema = z.object({
  body: z.object({
    blogId: z.string({
      message: "Blog ID is required",
    }),
    comment: z.string({
      message: "Comment is required",
    }),
    name: z.string({
      message: "Name is required",
    }),
    email: z
      .string()
      .email({
        message: "Invalid email address",
      })
      .optional(),
    phone: z.string({
      message: "Phone number is required",
    }),
    saveInfo: z.boolean().optional(),
    userId: z.string().optional(),
  }),
});

const updateBlogCommentZodSchema = z.object({
  body: z.object({
    comment: z.string().optional(),
    status: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const BlogCommentValidation = {
  createBlogCommentZodSchema,
  updateBlogCommentZodSchema,
};
