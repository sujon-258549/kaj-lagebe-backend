import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import status from "http-status";
import { RolePermissionService } from "./rolePermission.service.ts";

const getRolePermissions = catchAsync(async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const result = await RolePermissionService.getRolePermissions(roleId as string);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Role permissions fetched successfully",
    data: result,
  });
});

const upsertRolePermissions = catchAsync(async (req: Request, res: Response) => {
  const { roleId } = req.params;
  // Handle both cases: body is an array or body contains a 'permissions' array
  const payload = Array.isArray(req.body) ? req.body : req.body.permissions;

  console.log(`Incoming request to update permissions for Role ID: ${roleId}`);
  console.log("Payload data:", JSON.stringify(payload, null, 2));

  if (!Array.isArray(payload)) {
    throw new Error("Permissions must be an array");
  }

  const result = await RolePermissionService.upsertRolePermissions(roleId as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Role permissions updated successfully",
    data: result,
  });
});

export const RolePermissionController = {
  getRolePermissions,
  upsertRolePermissions,
};
