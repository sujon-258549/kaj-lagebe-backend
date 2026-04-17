import express from "express";
import { RoleControllers } from "./role.controller.ts";


const router = express.Router();

router.post("/", RoleControllers.createRole);
router.get("/", RoleControllers.getAllRole);
router.get("/:id", RoleControllers.getRoleById);
router.put("/:id", RoleControllers.updateRole);
router.delete("/:id", RoleControllers.deleteRole);
router.patch("/:id/status", RoleControllers.updateRoleStatus);

export const RoleRoutes = router;
