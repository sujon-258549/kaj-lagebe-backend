import express from "express";
import { SubCategoryControllers } from "./subCategory.controller.ts";

const router = express.Router();

router.post("/", SubCategoryControllers.createSubCategory);
router.get("/", SubCategoryControllers.getAllSubCategory);
router.get("/:id", SubCategoryControllers.getSubCategoryById);
router.get("/:slug", SubCategoryControllers.getSubCategoryBySlug);
router.put("/:id", SubCategoryControllers.updateSubCategory);
router.patch("/:id/status", SubCategoryControllers.updateSubCategoryStatus);
router.delete("/:id", SubCategoryControllers.deleteSubCategory);

export const SubCategoryRoutes = router;
