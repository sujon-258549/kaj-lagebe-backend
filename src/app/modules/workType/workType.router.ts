import { Router } from "express";
import { WorkTypeController } from "./workType.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { WorkTypeValidation } from "./workType.validaction.ts";

const router = Router();

router.post(
  "/",
  validateRequest(WorkTypeValidation.createWorkTypeZodSchema),
  WorkTypeController.createWorkType
);
router.get("/", WorkTypeController.getAllWorkType);
router.get("/:id", WorkTypeController.getWorkTypeById);
router.put(
  "/:id",
  validateRequest(WorkTypeValidation.updateWorkTypeZodSchema),
  WorkTypeController.updateWorkType
);
router.patch("/:id/status", WorkTypeController.updateWorkTypeStatus);
router.delete("/:id", WorkTypeController.deleteWorkType);

export const WorkTypeRouter = router;
