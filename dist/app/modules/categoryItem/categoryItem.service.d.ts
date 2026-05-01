export declare const CategoryItemServices: {
    createCategoryItem: (payload: any) => Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        image: string;
        id: string;
        description: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    getAllCategoryItems: () => Promise<({
        imageRel: {
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
        number: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        image: string;
        id: string;
        description: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    })[]>;
    getSingleCategoryItem: (id: string) => Promise<({
        imageRel: {
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
        number: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        image: string;
        id: string;
        description: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }) | null>;
    updateCategoryItem: (id: string, payload: Partial<any>) => Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        image: string;
        id: string;
        description: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    deleteCategoryItem: (id: string) => Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        image: string;
        id: string;
        description: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    updateStatus: (id: string, status: boolean) => Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        image: string;
        id: string;
        description: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }>;
};
//# sourceMappingURL=categoryItem.service.d.ts.map