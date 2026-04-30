import express from "express";
import { SiteSettingController } from "./siteSetting.controller.js";
import auth from "../../utils/auth.js";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

// Public routes (for frontend)
router.get("/map", SiteSettingController.getSettingsMap);
router.get("/group/:group", SiteSettingController.getSettingsByGroup);

// Admin routes
router.get(
  "/all",
  auth(),
  SiteSettingController.getAllSettings
);

router.post(
  "/upsert",
  auth(),
  SiteSettingController.upsertSetting
);

router.post(
  "/bulk-upsert",
  auth(),
  SiteSettingController.bulkUpsertSettings
);

router.delete(
  "/bulk-delete",
  auth(),
  SiteSettingController.bulkDeleteSettings
);

router.delete(
  "/:key",
  auth(),
  SiteSettingController.deleteSetting
);

export const SiteSettingRoutes = router;
