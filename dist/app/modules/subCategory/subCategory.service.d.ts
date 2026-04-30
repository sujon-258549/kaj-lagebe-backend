export declare const SubCategoryServices: {
    createSubCategory: (payload: any, userId?: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
        imageId: string | null;
    }>;
    getAllSubCategory: (query: any) => Promise<{
        data: ({
            category: {
                name: string;
                image: {
                    name: string;
                    url: string;
                    createdAt: Date;
                    updatedAt: Date;
                    id: string;
                    createdById: string | null;
                    updatedById: string | null;
                    folderId: string | null;
                    slug: string;
                    status: boolean;
                } | null;
                slug: string;
            };
            image: {
                name: string;
                url: string;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                createdById: string | null;
                updatedById: string | null;
                folderId: string | null;
                slug: string;
                status: boolean;
            } | null;
            createdBy: {
                email: string;
                profile: {
                    name: string | null;
                } | null;
                id: string;
            } | null;
            updatedBy: {
                email: string;
                profile: {
                    name: string | null;
                } | null;
                id: string;
            } | null;
        } & {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            createdById: string | null;
            updatedById: string | null;
            slug: string;
            status: boolean;
            categoryId: string;
            icon: string | null;
            imageId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getSubCategoryById: (id: string) => Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
        };
        image: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            folderId: string | null;
            slug: string;
            status: boolean;
        } | null;
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
        imageId: string | null;
    }>;
    getSubCategoryBySlug: (slug: string) => Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
        };
        image: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            folderId: string | null;
            slug: string;
            status: boolean;
        } | null;
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
        imageId: string | null;
    }>;
    updateSubCategory: (id: string, payload: any, userId?: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
        imageId: string | null;
    }>;
    deleteSubCategory: (id: string) => Promise<{
        message: string;
    }>;
    updateSubCategoryStatus: (id: string, userId?: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
        imageId: string | null;
    }>;
};
//# sourceMappingURL=subCategory.service.d.ts.map