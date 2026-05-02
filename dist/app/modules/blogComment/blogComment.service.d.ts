export declare const BlogCommentServices: {
    createBlogComment: (payload: any, userId?: string) => Promise<{
        user: {
            email: string;
            profile: {
                name: string | null;
                mobile: string;
                id: string;
                gender: import("@prisma/client").$Enums.Gender | null;
                age: number | null;
                dob: Date | null;
                bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
                photoId: string | null;
                photo: string | null;
                nid: string | null;
                nidPhoto: string[];
                emailVerified: boolean;
                phoneVerified: boolean;
                nidVerified: boolean;
                serialId: string | null;
            } | null;
            id: string;
        } | null;
        blog: {
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            id: string;
            description: string | null;
            updatedById: string | null;
            slug: string;
            title: string;
            excerpt: string | null;
            isPublished: boolean;
            authorId: string | null;
            content: string;
            tags: string[];
            authorName: string | null;
            publishedAt: Date | null;
            coverId: string | null;
        };
    } & {
        name: string;
        email: string | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        comment: string;
        id: string;
        status: boolean;
        userId: string | null;
        phone: string;
        blogId: string;
        saveInfo: boolean;
    }>;
    getAllBlogComments: (query: any) => Promise<{
        data: ({
            user: {
                email: string;
                profile: {
                    name: string | null;
                    mobile: string;
                    id: string;
                    gender: import("@prisma/client").$Enums.Gender | null;
                    age: number | null;
                    dob: Date | null;
                    bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
                    photoId: string | null;
                    photo: string | null;
                    nid: string | null;
                    nidPhoto: string[];
                    emailVerified: boolean;
                    phoneVerified: boolean;
                    nidVerified: boolean;
                    serialId: string | null;
                } | null;
                id: string;
            } | null;
            blog: {
                id: string;
                slug: string;
                title: string;
            };
        } & {
            name: string;
            email: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            comment: string;
            id: string;
            status: boolean;
            userId: string | null;
            phone: string;
            blogId: string;
            saveInfo: boolean;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getBlogCommentById: (id: string) => Promise<{
        user: {
            email: string;
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            isVerified: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            password: string;
            roleId: string | null;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            lastLogin: Date | null;
            subscriptionId: string | null;
            departmentId: string | null;
            loginCount: number;
            loginTryCount: number;
            loginTryTime: Date | null;
            lastFollowUp: Date | null;
        } | null;
        blog: {
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            id: string;
            description: string | null;
            updatedById: string | null;
            slug: string;
            title: string;
            excerpt: string | null;
            isPublished: boolean;
            authorId: string | null;
            content: string;
            tags: string[];
            authorName: string | null;
            publishedAt: Date | null;
            coverId: string | null;
        };
    } & {
        name: string;
        email: string | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        comment: string;
        id: string;
        status: boolean;
        userId: string | null;
        phone: string;
        blogId: string;
        saveInfo: boolean;
    }>;
    updateBlogComment: (id: string, payload: any) => Promise<{
        name: string;
        email: string | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        comment: string;
        id: string;
        status: boolean;
        userId: string | null;
        phone: string;
        blogId: string;
        saveInfo: boolean;
    }>;
    deleteBlogComment: (id: string) => Promise<{
        message: string;
    }>;
    getCommentsByBlogId: (blogId: string) => Promise<{
        data: ({
            user: {
                email: string;
                profile: {
                    name: string | null;
                    mobile: string;
                    id: string;
                    gender: import("@prisma/client").$Enums.Gender | null;
                    age: number | null;
                    dob: Date | null;
                    bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
                    photoId: string | null;
                    photo: string | null;
                    nid: string | null;
                    nidPhoto: string[];
                    emailVerified: boolean;
                    phoneVerified: boolean;
                    nidVerified: boolean;
                    serialId: string | null;
                } | null;
                id: string;
            } | null;
            blog: {
                id: string;
                slug: string;
                title: string;
            };
        } & {
            name: string;
            email: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            comment: string;
            id: string;
            status: boolean;
            userId: string | null;
            phone: string;
            blogId: string;
            saveInfo: boolean;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
};
//# sourceMappingURL=blogComment.service.d.ts.map