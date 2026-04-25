import express from "express";
import { RolePermissionController } from "./rolePermission.controller.ts";
import auth from "../../utils/auth.ts";

const router = express.Router();

router.get("/:roleId", auth(), RolePermissionController.getRolePermissions);
router.post("/:roleId", auth(), RolePermissionController.upsertRolePermissions);

export const RolePermissionRoutes = router;
