export declare const SubCategoryServices: {
    createSubCategory: (payload: any, userId?: string) => Promise<{
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
        categoryId: string;
        icon: string | null;
        imageId: string | null;
    }>;
    getAllSubCategory: (query: any) => Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getSubCategoryByIdentifier: (identifier: string) => Promise<{
        image: string | null;
        url: string | null;
        category: {
            name: string;
            id: string;
            slug: string;
        };
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