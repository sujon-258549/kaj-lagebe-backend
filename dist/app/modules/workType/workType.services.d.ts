export declare const WorkTypeServices: {
    createWorkType: (payload: any, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    getAllWorkType: (query: any) => Promise<{
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
        } & {
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            createdById: string | null;
            updatedById: string | null;
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
    } & {
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }) | null>;
    updateWorkType: (id: string, payload: any, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    deleteWorkType: (id: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    updateWorkTypeStatus: (id: string, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
};
//# sourceMappingURL=workType.services.d.ts.map