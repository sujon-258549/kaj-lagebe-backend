import type { Prisma } from "@prisma/client";
export declare const CategoryServices: {
    createCategoryIntoDB: (payload: any, userId?: string) => Promise<{
        image: string | null;
        url: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
        imageId: string | null;
    }>;
    getAllCategory: (query: any) => Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getCategoryByIdentifier: (identifier: string) => Promise<{
        image: string | null;
        url: string | null;
        subCategories: any[];
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
        histories: ({
            updatedBy: {
                email: string;
                id: string;
            } | null;
        } & {
            createdAt: Date;
            id: string;
            updatedById: string | null;
            categoryId: string;
            oldData: Prisma.JsonValue | null;
            newData: Prisma.JsonValue | null;
        })[];
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
        imageId: string | null;
    }>;
    updateCategory: (id: string, payload: any, userId?: string) => Promise<{
        image: string | null;
        url: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
        imageId: string | null;
    }>;
    deleteCategory: (id: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
        imageId: string | null;
    }>;
    updateCategoryStatus: (id: string, userId?: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
        imageId: string | null;
    }>;
};
//# sourceMappingURL=category.services.d.ts.map