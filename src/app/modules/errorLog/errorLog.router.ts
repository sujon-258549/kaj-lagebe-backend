import express from "express";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";
import { ErrorLogControllers } from "./errorLog.controller.ts";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ErrorLogControllers.getAllErrorLogs,
);

router.get(
  "/summary",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ErrorLogControllers.getErrorSummary,
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ErrorLogControllers.getErrorLogById,
);

router.patch(
  "/:id/resolve",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ErrorLogControllers.markResolved,
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ErrorLogControllers.deleteErrorLog,
);

export const ErrorLogRoutes = router;
