import express from "express";
import { JobControllers } from "./job.controller.ts";
import auth from "../../utils/auth.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { JobValidation } from "./job.validation.ts";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(JobValidation.createJobZodSchema),
  JobControllers.createJob,
);

router.get("/", JobControllers.getAllJobs);

router.get("/:id", JobControllers.getJobByIdentifier);

router.patch(
  "/:id",
  auth(),
  validateRequest(JobValidation.updateJobZodSchema),
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

