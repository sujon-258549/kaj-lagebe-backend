export declare const RoleServices: {
    createRole: (payload: any, userId?: string) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    getAllRole: (query: any) => Promise<{
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
            role: string;
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
    getRoleById: (id: string) => Promise<{
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
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    updateRole: (id: string, payload: any, userId?: string) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    deleteRole: (id: string) => Promise<{
        message: string;
    }>;
    updateRoleStatus: (id: string, userId?: string) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
};
//# sourceMappingURL=role.service.d.ts.map