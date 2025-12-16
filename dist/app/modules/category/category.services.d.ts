export declare const CategoryServices: {
    createCategoryIntoDB: (payload: any) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: import("@prisma/client").$Enums.CategoryType;
        icon: string | null;
        description: string | null;
    }>;
};
//# sourceMappingURL=category.services.d.ts.map