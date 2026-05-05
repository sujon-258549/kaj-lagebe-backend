import express from "express";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";
import { ActivityLogControllers } from "./activityLog.controller.ts";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ActivityLogControllers.getAllActivityLogs,
);

router.get(
  "/summary",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ActivityLogControllers.getActivitySummary,
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ActivityLogControllers.getActivityLogById,
);

export const ActivityLogRoutes = router;
