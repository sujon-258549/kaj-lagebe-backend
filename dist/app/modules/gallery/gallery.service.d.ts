export declare const GalleryServices: {
    createGallery: (payload: any, userId?: string) => Promise<{
        createdBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        imageRel: {
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
        } | null;
    } & {
        number: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string;
        description: string | null;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    getAllGalleries: (query: any) => Promise<{
        data: ({
            createdBy: {
                email: string;
                id: string;
                profile: {
                    name: string | null;
                } | null;
            } | null;
            updatedBy: {
                email: string;
                id: string;
                profile: {
                    name: string | null;
                } | null;
            } | null;
            imageRel: {
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
            } | null;
        } & {
            number: string;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            image: string;
            description: string | null;
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
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        imageRel: {
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
        } | null;
    } & {
        number: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string;
        description: string | null;
        imageId: string | null;
        title: string;
        order: number;
    }) | null>;
    updateGallery: (id: string, payload: Partial<any>, userId?: string) => Promise<{
        createdBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        imageRel: {
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
        } | null;
    } & {
        number: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string;
        description: string | null;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    deleteGallery: (id: string) => Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string;
        description: string | null;
        imageId: string | null;
        title: string;
        order: number;
    }>;
    updateStatus: (id: string, status: boolean, userId?: string) => Promise<{
        createdBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        imageRel: {
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
        } | null;
    } & {
        number: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string;
        description: string | null;
        imageId: string | null;
        title: string;
        order: number;
    }>;
};
//# sourceMappingURL=gallery.service.d.ts.map