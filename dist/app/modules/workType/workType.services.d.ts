export declare const WorkTypeServices: {
    createWorkType: (payload: any, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
    getAllWorkType: (query: any) => Promise<{
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
        } & {
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            description: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getWorkTypeById: (id: string) => Promise<({
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
    } & {
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }) | null>;
    updateWorkType: (id: string, payload: any, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
    deleteWorkType: (id: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
    updateWorkTypeStatus: (id: string, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
};
//# sourceMappingURL=workType.services.d.ts.map