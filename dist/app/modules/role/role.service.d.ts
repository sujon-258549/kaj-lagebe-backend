export declare const RoleServices: {
    createRole: (payload: any, userId?: string) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
    getAllRole: (query: any) => Promise<{
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
            role: string;
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
    getRoleById: (id: string) => Promise<{
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
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
    updateRole: (id: string, payload: any, userId?: string) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
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
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
};
//# sourceMappingURL=role.service.d.ts.map