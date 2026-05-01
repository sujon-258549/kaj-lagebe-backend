export declare const GalleryServices: {
    createGallery: (payload: any, userId?: string) => Promise<{
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
        image: string;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    getAllGalleries: (query: any) => Promise<{
        data: ({
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
            image: string;
            id: string;
            description: string | null;
            createdById: string | null;
            updatedById: string | null;
            status: boolean;
            imageId: string | null;
            title: string;
            order: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getSingleGallery: (id: string) => Promise<({
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
        image: string;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }) | null>;
    updateGallery: (id: string, payload: Partial<any>, userId?: string) => Promise<{
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
        image: string;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    deleteGallery: (id: string) => Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        image: string;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    updateStatus: (id: string, status: boolean, userId?: string) => Promise<{
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
        image: string;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
        status: boolean;
        imageId: string | null;
        title: string;
        order: number;
    }>;
};
//# sourceMappingURL=gallery.service.d.ts.map