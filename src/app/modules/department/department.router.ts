import { Router } from "express";
import { DepartmentController } from "./department.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { DepartmentValidation } from "./department.validation.ts";

const router = Router();

router.post(
  "/",
  validateRequest(DepartmentValidation.createDepartmentZodSchema),
  DepartmentController.createDepartment,
);
router.get("/", DepartmentController.getAllDepartment);
router.get("/:id", DepartmentController.getDepartmentById);
router.put(
  "/:id",
  validateRequest(DepartmentValidation.updateDepartmentZodSchema),
  DepartmentController.updateDepartment,
);
router.delete("/:id", DepartmentController.deleteDepartment);
router.patch("/:id/status", DepartmentController.updateDepartmentStatus);

export const DepartmentRouter = router;
