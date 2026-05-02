export declare const SubCategoryServices: {
    createSubCategory: (payload: any, userId?: string) => Promise<{
        image: string | null;
        url: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
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
            slug: string;
            id: string;
        };
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
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
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
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
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
        categoryId: string;
        icon: string | null;
        imageId: string | null;
    }>;
};
//# sourceMappingURL=subCategory.service.d.ts.map