export declare const DepartmentServices: {
    createDepartment: (payload: any, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    getAllDepartment: (query: any) => Promise<{
        data: ({
            users: {
                email: string;
                mobile: string;
                id: string;
                roleId: string | null;
            }[];
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
    getDepartmentById: (id: string) => Promise<({
        users: {
            email: string;
            mobile: string;
            id: string;
            roleId: string | null;
        }[];
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
    updateDepartment: (id: string, payload: any, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    deleteDepartment: (id: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        createdById: string | null;
        updatedById: string | null;
    }>;
    updateDepartmentStatus: (id: string, userId?: string) => Promise<{
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
//# sourceMappingURL=department.services.d.ts.map