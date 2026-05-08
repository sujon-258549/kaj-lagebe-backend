import express from "express";
import { DashboardControllers } from "./dashboard.controller.ts";
import auth from "../../utils/auth.ts";
import { ALL_ROLES } from "../users/user.constant.ts";

const router = express.Router();

router.get(
  "/overview",
  auth(...ALL_ROLES),
  DashboardControllers.getOverview,
);

export const DashboardRoutes = router;
