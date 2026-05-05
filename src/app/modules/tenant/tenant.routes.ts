import { Router } from "express";
import { TenantController } from "./tenant.controller.ts";
import auth from "../../middleware/auth.ts";
import { ENUM_USER_ROLE } from "../../../enums/user.tsx";

const router = Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  TenantController.createTenant
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  TenantController.getAllTenants
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  TenantController.getTenantById
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  TenantController.updateTenant
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  TenantController.deleteTenant
);

export const TenantRoutes = router;
