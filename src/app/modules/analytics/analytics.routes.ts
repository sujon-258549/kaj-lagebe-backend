import express from "express";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";
import { AnalyticsControllers } from "./analytics.controller.ts";

const router = express.Router();

// Public — page view ingestion. Auth is optional and decoded inside the service.
router.post("/track", AnalyticsControllers.track);

// Live visitors is light enough to leave open to any authenticated admin/user.
router.get(
  "/live",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.MAINTAINER),
  AnalyticsControllers.getLiveVisitors,
);

const adminOnly = auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.MAINTAINER);

router.get("/traffic", adminOnly, AnalyticsControllers.getTrafficStats);
router.get("/timeseries", adminOnly, AnalyticsControllers.getTrafficTimeseries);
router.get("/top-pages", adminOnly, AnalyticsControllers.getTopPages);
router.get("/geo", adminOnly, AnalyticsControllers.getGeoBreakdown);
router.get("/devices", adminOnly, AnalyticsControllers.getDeviceBreakdown);
router.get("/browsers", adminOnly, AnalyticsControllers.getBrowserBreakdown);
router.get("/os", adminOnly, AnalyticsControllers.getOsBreakdown);
router.get("/referrers", adminOnly, AnalyticsControllers.getReferrers);

export const AnalyticsRoutes = router;
