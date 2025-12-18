export declare const CategoryServices: {
    createCategoryIntoDB: (payload: any) => Promise<{
        name: import("@prisma/client").$Enums.CategoryType;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        icon: string | null;
        description: string | null;
    }>;
};
//# sourceMappingURL=category.services.d.ts.map