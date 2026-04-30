export declare const FolderServices: {
    createFolder: (payload: any, userId?: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        parentId: string | null;
    }>;
    getAllFolders: (query: any) => Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getFolderById: (id: string) => Promise<{
        children: any[];
        images: {
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
        }[];
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        parentId: string | null;
    }>;
    updateFolder: (id: string, payload: any, userId?: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        parentId: string | null;
    }>;
    deleteFolder: (id: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        slug: string;
        status: boolean;
        parentId: string | null;
    }>;
};
//# sourceMappingURL=folder.services.d.ts.map