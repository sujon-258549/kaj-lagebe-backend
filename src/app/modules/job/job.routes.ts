import express from "express";
import { JobControllers } from "./job.controller.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.EMPLOYEE),
  JobControllers.createJob,
);

router.get("/", JobControllers.getAllJobs);

router.get("/:id", JobControllers.getJobById);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.EMPLOYEE),
  JobControllers.updateJob,
);

router.patch(
  "/:id/status",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.EMPLOYEE),
  JobControllers.updateJobStatus,
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  JobControllers.deleteJob,
);

export const JobRoutes = router;
