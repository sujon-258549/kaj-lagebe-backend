export declare const BlogCommentServices: {
    createBlogComment: (payload: any, userId?: string) => Promise<{
        user: {
            email: string;
            id: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        } | null;
        blog: {
            slug: string;
            id: string;
            title: string;
        };
    } & {
        name: string;
        email: string | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        comment: string;
        userId: string | null;
        phone: string;
        blogId: string;
        saveInfo: boolean;
    }>;
    getAllBlogComments: (query: any) => Promise<{
        data: ({
            user: {
                email: string;
                id: string;
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
            } | null;
            blog: {
                slug: string;
                id: string;
                title: string;
            };
        } & {
            name: string;
            email: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
            id: string;
            comment: string;
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
            id: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        } | null;
        blog: {
            slug: string;
            id: string;
            title: string;
        };
    } & {
        name: string;
        email: string | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        comment: string;
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
        status: boolean;
        id: string;
        comment: string;
        userId: string | null;
        phone: string;
        blogId: string;
        saveInfo: boolean;
    }>;
    deleteBlogComment: (id: string) => Promise<{
        message: string;
    }>;
    getCommentsByBlogIdentifier: (identifier: string, query: any) => Promise<{
        data: ({
            user: {
                email: string;
                id: string;
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
            } | null;
            blog: {
                slug: string;
                id: string;
                title: string;
            };
        } & {
            name: string;
            email: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
            id: string;
            comment: string;
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