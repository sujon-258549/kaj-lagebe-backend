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
    userId: z.string().optional(),
  }),
});

export const ContactValidation = {
  createContactZodSchema,
};
