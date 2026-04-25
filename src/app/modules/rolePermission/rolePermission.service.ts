import prisma from "../../utils/prismaClient.ts";

const getRolePermissions = async (roleId: string) => {
  const result = await prisma.rolePermission.findMany({
    where: {
      roleId,
    },
    select: {
      module: true,
      permissions: true,
    },
  });
  return result;
};

const upsertRolePermissions = async (
  roleId: string,
  payload: { module: string; permissions: string[] }[],
) => {
  // We use a transaction to ensure all permissions are updated correctly
  const result = await prisma.$transaction(async (tx) => {
    const results = [];
    
    for (const item of payload) {
      console.log(`Processing module: ${item.module} for role: ${roleId}`);
      
      const existingPermission = await tx.rolePermission.findFirst({
        where: {
          roleId,
          module: item.module,
        },
      });

      if (existingPermission) {
        console.log(`Updating existing permission for ${item.module}`);
        const updated = await tx.rolePermission.update({
          where: {
            id: existingPermission.id,
          },
          data: {
            permissions: item.permissions,
          },
        });
        results.push(updated);
      } else {
        console.log(`Creating new permission for ${item.module}`);
        const created = await tx.rolePermission.create({
          data: {
            roleId,
            module: item.module,
            permissions: item.permissions,
          },
        });
        results.push(created);
      }
    }

    return results;
  });

  console.log(`Successfully processed ${result.length} permission modules for role ${roleId}`);
  return result;
};

export const RolePermissionService = {
  getRolePermissions,
  upsertRolePermissions,
};
