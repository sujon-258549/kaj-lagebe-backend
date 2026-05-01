import { z } from "zod";

const createContactZodSchema = z.object({
  body: z.object({
    firstName: z.string({
      message: "First name is required",
    }),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    message: z.string({
      message: "Message is required",
    }),
    subject: z.string().optional(),
    userId: z.string().optional(),
  }),
});

const feedbackZodSchema = z.object({
  body: z.object({
    message: z.string({
      message: "Feedback message is required",
    }),
  }),
});

export const ContactValidation = {
  createContactZodSchema,
  feedbackZodSchema,
};
