import express from "express";
import { JobControllers } from "./job.controller.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  auth(),
  JobControllers.createJob,
);

router.get("/", JobControllers.getAllJobs);

router.get("/:id", JobControllers.getJobByIdentifier);

router.patch(
  "/:id",
  auth(),
  JobControllers.updateJob,
);

router.patch(
  "/:id/status",
  auth(),
  JobControllers.updateJobStatus,
);

router.delete(
  "/:id",
  auth(),
  JobControllers.deleteJob,
);

export const JobRoutes = router;
