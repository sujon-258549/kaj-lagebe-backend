import express from "express";
import { SubCategoryControllers } from "./subCategory.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { SubCategoryValidation } from "./subCategory.validation.ts";

const router = express.Router();

router.post(
  "/",
  validateRequest(SubCategoryValidation.createSubCategoryZodSchema),
  SubCategoryControllers.createSubCategory,
);
router.get("/", SubCategoryControllers.getAllSubCategory);
router.get("/:id", SubCategoryControllers.getSubCategoryById);
router.get("/:slug", SubCategoryControllers.getSubCategoryBySlug);
router.put(
  "/:id",
  validateRequest(SubCategoryValidation.updateSubCategoryZodSchema),
  SubCategoryControllers.updateSubCategory,
);
router.patch("/:id/status", SubCategoryControllers.updateSubCategoryStatus);
router.delete("/:id", SubCategoryControllers.deleteSubCategory);

export const SubCategoryRoutes = router;
