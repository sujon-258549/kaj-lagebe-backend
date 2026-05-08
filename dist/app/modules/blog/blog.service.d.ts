export declare const BlogServices: {
    createBlog: (payload: any, userId?: string) => Promise<{
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        cover: {
            url: string;
            id: string;
        } | null;
        author: {
            mobile: string;
            id: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        id: string;
        updatedById: string | null;
        category: string | null;
        description: string | null;
        title: string;
        excerpt: string | null;
        isPublished: boolean;
        authorId: string | null;
        content: string;
        tags: string[];
        authorName: string | null;
        publishedAt: Date | null;
        coverId: string | null;
    }>;
    getAllBlog: (query: any) => Promise<{
        data: ({
            updatedBy: {
                email: string;
                id: string;
                profile: {
                    name: string | null;
                } | null;
            } | null;
            cover: {
                url: string;
                id: string;
            } | null;
            author: {
                mobile: string;
                id: string;
                profile: {
                    name: string | null;
                    photo: string | null;
                } | null;
            } | null;
        } & {
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            id: string;
            updatedById: string | null;
            category: string | null;
            description: string | null;
            title: string;
            excerpt: string | null;
            isPublished: boolean;
            authorId: string | null;
            content: string;
            tags: string[];
            authorName: string | null;
            publishedAt: Date | null;
            coverId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getBlogById: (id: string) => Promise<{
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        cover: {
            url: string;
            id: string;
        } | null;
        author: {
            mobile: string;
            id: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        id: string;
        updatedById: string | null;
        category: string | null;
        description: string | null;
        title: string;
        excerpt: string | null;
        isPublished: boolean;
        authorId: string | null;
        content: string;
        tags: string[];
        authorName: string | null;
        publishedAt: Date | null;
        coverId: string | null;
    }>;
    updateBlog: (id: string, payload: any, userId?: string) => Promise<{
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        cover: {
            url: string;
            id: string;
        } | null;
        author: {
            mobile: string;
            id: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        id: string;
        updatedById: string | null;
        category: string | null;
        description: string | null;
        title: string;
        excerpt: string | null;
        isPublished: boolean;
        authorId: string | null;
        content: string;
        tags: string[];
        authorName: string | null;
        publishedAt: Date | null;
        coverId: string | null;
    }>;
    deleteBlog: (id: string, userId?: string, userRole?: string) => Promise<{
        message: string;
    }>;
    updateBlogStatus: (id: string, userId?: string) => Promise<{
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        cover: {
            url: string;
            id: string;
        } | null;
        author: {
            mobile: string;
            id: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        id: string;
        updatedById: string | null;
        category: string | null;
        description: string | null;
        title: string;
        excerpt: string | null;
        isPublished: boolean;
        authorId: string | null;
        content: string;
        tags: string[];
        authorName: string | null;
        publishedAt: Date | null;
        coverId: string | null;
    }>;
};
//# sourceMappingURL=blog.service.d.ts.map