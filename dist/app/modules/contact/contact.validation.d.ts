import { z } from "zod";
export declare const ContactValidation: {
    createContactZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            message: z.ZodString;
            subject: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    feedbackZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            message: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=contact.validation.d.ts.map