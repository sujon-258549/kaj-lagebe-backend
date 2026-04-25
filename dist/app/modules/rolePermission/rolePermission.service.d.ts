export declare const RolePermissionService: {
    getRolePermissions: (roleId: string) => Promise<{
        permissions: string[];
        module: string;
    }[]>;
    upsertRolePermissions: (roleId: string, payload: {
        module: string;
        permissions: string[];
    }[]) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        roleId: string;
        permissions: string[];
        module: string;
    }[]>;
};
//# sourceMappingURL=rolePermission.service.d.ts.map