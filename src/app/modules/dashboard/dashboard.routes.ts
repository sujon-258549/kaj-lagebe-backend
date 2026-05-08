import express from "express";
import { DashboardControllers } from "./dashboard.controller.ts";
import auth from "../../utils/auth.ts";
import { ALL_ROLES, USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();
const adminOnly = auth(
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.MAINTAINER,
);

router.get("/overview", auth(...ALL_ROLES), DashboardControllers.getOverview);

router.get("/admin/kpis", adminOnly, DashboardControllers.getAdminKpis);
router.get(
  "/admin/growth",
  adminOnly,
  DashboardControllers.getGrowthTimeseries,
);
router.get(
  "/admin/funnel",
  adminOnly,
  DashboardControllers.getConversionFunnel,
);
router.get(
  "/admin/recent",
  adminOnly,
  DashboardControllers.getRecentSignals,
);
router.get("/online", adminOnly, DashboardControllers.getOnlineUsers);
router.get(
  "/live-feed",
  adminOnly,
  DashboardControllers.getLiveActivityFeed,
);

export const DashboardRoutes = router;
