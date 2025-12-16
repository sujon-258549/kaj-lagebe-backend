export declare const CategoryServices: {
    createCategoryIntoDB: (payload: any) => Promise<{
        name: import("@prisma/client").$Enums.CategoryType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string | null;
        description: string | null;
    }>;
};
//# sourceMappingURL=category.services.d.ts.map