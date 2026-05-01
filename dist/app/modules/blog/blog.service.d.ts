export declare const BlogServices: {
    createBlog: (payload: any, userId?: string) => Promise<{
        updatedBy: {
            email: string;
            profile: {
                name: string | null;
            } | null;
            id: string;
        } | null;
        cover: {
            url: string;
            id: string;
        } | null;
        author: {
            mobile: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
            id: string;
        } | null;
    } & {
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
    }>;
    getAllBlog: (query: any) => Promise<{
        data: ({
            updatedBy: {
                email: string;
                profile: {
                    name: string | null;
                } | null;
                id: string;
            } | null;
            cover: {
                url: string;
                id: string;
            } | null;
            author: {
                mobile: string;
                profile: {
                    name: string | null;
                    photo: string | null;
                } | null;
                id: string;
            } | null;
        } & {
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
            profile: {
                name: string | null;
            } | null;
            id: string;
        } | null;
        cover: {
            url: string;
            id: string;
        } | null;
        author: {
            mobile: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
            id: string;
        } | null;
    } & {
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
    }>;
    updateBlog: (id: string, payload: any, userId?: string) => Promise<{
        updatedBy: {
            email: string;
            profile: {
                name: string | null;
            } | null;
            id: string;
        } | null;
        cover: {
            url: string;
            id: string;
        } | null;
        author: {
            mobile: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
            id: string;
        } | null;
    } & {
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
    }>;
    deleteBlog: (id: string) => Promise<{
        message: string;
    }>;
    updateBlogStatus: (id: string, userId?: string) => Promise<{
        updatedBy: {
            email: string;
            profile: {
                name: string | null;
            } | null;
            id: string;
        } | null;
        cover: {
            url: string;
            id: string;
        } | null;
        author: {
            mobile: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
            id: string;
        } | null;
    } & {
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
    }>;
};
//# sourceMappingURL=blog.service.d.ts.map