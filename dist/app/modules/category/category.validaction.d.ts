import { z } from "zod";
export declare const CategoryValidation: {
    createCategoryZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            icon: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            status: z.ZodOptional<z.ZodBoolean>;
            imageId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateCategoryZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            icon: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            slug: z.ZodOptional<z.ZodString>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            status: z.ZodOptional<z.ZodBoolean>;
            imageId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=category.validaction.d.ts.map