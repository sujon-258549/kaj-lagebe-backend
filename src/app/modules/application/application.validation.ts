import { z } from "zod";

const createApplicationZodSchema = z.object({
  body: z.object({
    jobId: z.string({
      message: "Job ID is required",
    }),
    resume: z.string().optional(),
    coverLetter: z.string().optional(),
    applyNote: z.string().optional(),
    applyComment: z.string().optional(),
  }),
});

const updateApplicationZodSchema = z.object({
  body: z.object({
    applyStatus: z.string().optional(),
    isRead: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    status: z.boolean().optional(),
  }),
});

export const ApplicationValidation = {
  createApplicationZodSchema,
  updateApplicationZodSchema,
};
