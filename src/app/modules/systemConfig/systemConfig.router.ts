import { Router } from "express";
import { SystemConfigController } from "./systemConfig.controller.js";
import auth from "../../utils/auth.ts";

const router = Router();

router.get("/", auth(), SystemConfigController.getAllConfigs);
router.post("/update", auth(), SystemConfigController.updateConfig);

export const SystemConfigRoutes = router;
