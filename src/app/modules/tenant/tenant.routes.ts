import { Router } from "express";
import { TenantController } from "./tenant.controller.ts";
import auth from "../../utils/auth.ts";

const router = Router();

router.post(
  "/create",
  auth(),
  TenantController.createTenant
);

router.get(
  "/",
  auth(),
  TenantController.getAllTenants
);

router.get(
  "/:id",
  auth(),
  TenantController.getTenantById
);

router.patch(
  "/:id",
  auth(),
  TenantController.updateTenant
);

router.delete(
  "/:id",
  auth(),
  TenantController.deleteTenant
);

export const TenantRoutes = router;
