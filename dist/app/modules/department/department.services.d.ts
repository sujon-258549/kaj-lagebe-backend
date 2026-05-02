export declare const DepartmentServices: {
    createDepartment: (payload: any, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
    getAllDepartment: (query: any) => Promise<{
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
            users: {
                email: string;
                mobile: string;
                id: string;
                roleId: string | null;
            }[];
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
    getDepartmentById: (id: string) => Promise<({
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
        users: {
            email: string;
            mobile: string;
            id: string;
            roleId: string | null;
        }[];
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
    updateDepartment: (id: string, payload: any, userId?: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
    deleteDepartment: (id: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
    }>;
    updateDepartmentStatus: (id: string, userId?: string) => Promise<{
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
//# sourceMappingURL=department.services.d.ts.map