export declare const BlogServices: {
    createBlog: (payload: any) => Promise<{
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
        slug: string;
        title: string;
        tags: string[];
        isPublished: boolean;
        authorId: string | null;
        excerpt: string | null;
        content: string;
        publishedAt: Date | null;
        coverId: string | null;
    }>;
    getAllBlog: (query: any) => Promise<{
        data: ({
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
            slug: string;
            title: string;
            tags: string[];
            isPublished: boolean;
            authorId: string | null;
            excerpt: string | null;
            content: string;
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
        slug: string;
        title: string;
        tags: string[];
        isPublished: boolean;
        authorId: string | null;
        excerpt: string | null;
        content: string;
        publishedAt: Date | null;
        coverId: string | null;
    }>;
    updateBlog: (id: string, payload: any) => Promise<{
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
        slug: string;
        title: string;
        tags: string[];
        isPublished: boolean;
        authorId: string | null;
        excerpt: string | null;
        content: string;
        publishedAt: Date | null;
        coverId: string | null;
    }>;
    deleteBlog: (id: string) => Promise<{
        message: string;
    }>;
    updateBlogStatus: (id: string) => Promise<{
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
        slug: string;
        title: string;
        tags: string[];
        isPublished: boolean;
        authorId: string | null;
        excerpt: string | null;
        content: string;
        publishedAt: Date | null;
        coverId: string | null;
    }>;
};
//# sourceMappingURL=blog.service.d.ts.map