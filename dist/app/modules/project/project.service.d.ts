export declare const ProjectServices: {
    createProject: (payload: any) => Promise<{
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
        slug: string;
        status: boolean;
        imageId: string | null;
        title: string;
        content: string | null;
        order: number;
    }>;
    getAllProjects: (query: any) => Promise<{
        data: ({
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
            slug: string;
            status: boolean;
            imageId: string | null;
            title: string;
            content: string | null;
            order: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getSingleProject: (id: string) => Promise<({
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
        slug: string;
        status: boolean;
        imageId: string | null;
        title: string;
        content: string | null;
        order: number;
    }) | null>;
    getProjectBySlug: (idOrSlug: string) => Promise<({
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
        slug: string;
        status: boolean;
        imageId: string | null;
        title: string;
        content: string | null;
        order: number;
    }) | null>;
    updateProject: (id: string, payload: Partial<any>) => Promise<{
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
        slug: string;
        status: boolean;
        imageId: string | null;
        title: string;
        content: string | null;
        order: number;
    }>;
    deleteProject: (id: string) => Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        image: string;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        imageId: string | null;
        title: string;
        content: string | null;
        order: number;
    }>;
    updateStatus: (id: string, status: boolean) => Promise<{
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
        slug: string;
        status: boolean;
        imageId: string | null;
        title: string;
        content: string | null;
        order: number;
    }>;
};
//# sourceMappingURL=project.service.d.ts.map