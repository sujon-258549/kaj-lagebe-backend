import express from "express";
import { ApplicationControllers } from "./application.controller.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  auth(),
  ApplicationControllers.createApplication,
);

router.get(
  "/",
  auth(),
  ApplicationControllers.getAllApplications,
);

router.get(
  "/:id",
  auth(),
  ApplicationControllers.getApplicationById,
);

router.patch(
  "/:id",
  auth(),
  ApplicationControllers.updateApplication,
);

router.delete(
  "/:id",
  auth(),
  ApplicationControllers.deleteApplication,
);

export const ApplicationRoutes = router;
