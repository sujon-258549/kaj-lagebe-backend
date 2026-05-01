import { z } from "zod";
export declare const ReviewValidation: {
    createReviewZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            role: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            content: z.ZodString;
            image: z.ZodOptional<z.ZodString>;
            imageId: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodBoolean>;
            order: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateReviewZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            role: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
            imageId: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodBoolean>;
            order: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=review.validation.d.ts.map