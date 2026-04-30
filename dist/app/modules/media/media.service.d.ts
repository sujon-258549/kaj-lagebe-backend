export declare const MediaServices: {
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
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            folders: any[];
            images: {
                name: string;
                url: string;
                id: string;
            }[];
        };
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
    createImage: (payload: {
        name: string;
        url: string;
        folderId?: string;
    }, userId?: string) => Promise<{
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
        id: string;
        createdById: string | null;
        updatedById: string | null;
        folderId: string | null;
        slug: string;
        status: boolean;
    }>;
    updateImage: (id: string, payload: {
        name: string;
    }, userId?: string) => Promise<{
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
    }>;
};
//# sourceMappingURL=media.service.d.ts.map