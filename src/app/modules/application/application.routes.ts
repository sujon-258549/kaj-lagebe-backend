import express from "express";
import { ApplicationControllers } from "./application.controller.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.WORKER, USER_ROLE.EMPLOYEE),
  ApplicationControllers.createApplication,
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ApplicationControllers.getAllApplications,
);

router.get(
  "/:id",
  auth(
    USER_ROLE.USER,
    USER_ROLE.WORKER,
    USER_ROLE.EMPLOYEE,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ),
  ApplicationControllers.getApplicationById,
);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ApplicationControllers.updateApplication,
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ApplicationControllers.deleteApplication,
);

export const ApplicationRoutes = router;
