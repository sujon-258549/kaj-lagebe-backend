export declare const MediaServices: {
    createFolder: (payload: any, userId?: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        parentId: string | null;
        id: string;
        createdById: string | null;
        updatedById: string | null;
    }>;
    getAllFolders: (query: any) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: any[];
    }>;
    getFolderById: (id: string) => Promise<{
        children: any[];
        images: {
            name: string;
            url: string;
            id: string;
        }[];
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        parentId: string | null;
        id: string;
        createdById: string | null;
        updatedById: string | null;
    }>;
    deleteFolder: (id: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        parentId: string | null;
        id: string;
        createdById: string | null;
        updatedById: string | null;
    }>;
    updateFolder: (id: string, payload: any, userId?: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        parentId: string | null;
        id: string;
        createdById: string | null;
        updatedById: string | null;
    }>;
    createImage: (payload: {
        name: string;
        url: string;
        folderId?: string;
    }, userId?: string) => Promise<{
        name: string;
        url: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        folderId: string | null;
    }>;
    getImagesByFolder: (folderId?: string | null) => Promise<{
        name: string;
        url: string;
        id: string;
    }[]>;
    deleteImage: (id: string) => Promise<{
        name: string;
        url: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        folderId: string | null;
    }>;
    updateImage: (id: string, payload: {
        name: string;
    }, userId?: string) => Promise<{
        name: string;
        url: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        folderId: string | null;
    }>;
};
//# sourceMappingURL=media.service.d.ts.map