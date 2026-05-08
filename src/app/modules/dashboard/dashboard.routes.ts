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
router.get("/admin/growth", adminOnly, DashboardControllers.getGrowthTimeseries);
router.get("/admin/funnel", adminOnly, DashboardControllers.getConversionFunnel);
router.get("/admin/recent", adminOnly, DashboardControllers.getRecentSignals);

router.get(
  "/charts/jobs-by-category",
  adminOnly,
  DashboardControllers.getJobsByCategory,
);
router.get(
  "/charts/application-status",
  adminOnly,
  DashboardControllers.getApplicationStatus,
);
router.get(
  "/charts/hiring-rate",
  adminOnly,
  DashboardControllers.getHiringRate,
);
router.get(
  "/charts/recruitment-funnel",
  adminOnly,
  DashboardControllers.getRecruitmentFunnel,
);
router.get(
  "/charts/salary-benchmarks",
  adminOnly,
  DashboardControllers.getSalaryBenchmarks,
);

router.get(
  "/tables/recent-jobs",
  adminOnly,
  DashboardControllers.getRecentJobs,
);
router.get(
  "/tables/top-candidates",
  adminOnly,
  DashboardControllers.getTopCandidates,
);
router.get(
  "/tables/jobs-with-applicants",
  adminOnly,
  DashboardControllers.getJobsWithApplicants,
);

router.get("/online", adminOnly, DashboardControllers.getOnlineUsers);
router.get("/live-feed", adminOnly, DashboardControllers.getLiveActivityFeed);

export const DashboardRoutes = router;
