import { z } from "zod";
export declare const BlogCommentValidation: {
    createBlogCommentZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            blogId: z.ZodString;
            comment: z.ZodString;
            name: z.ZodString;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodString;
            saveInfo: z.ZodOptional<z.ZodBoolean>;
            userId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateBlogCommentZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            comment: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodBoolean>;
            isDeleted: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=blogComment.validation.d.ts.map