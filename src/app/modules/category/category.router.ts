import { Router } from "express";
import { CategoryController } from "./category.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { CategoryValidation } from "./category.validaction.ts";


const router = Router();

router.post("/", validateRequest(CategoryValidation.createCategoryZodSchema), CategoryController.createCategory);
router.get("/", CategoryController.getAllCategory);
router.get("/:id", CategoryController.getCategoryById);
router.put("/:id", validateRequest(CategoryValidation.updateCategoryZodSchema), CategoryController.updateCategory);
router.patch("/:id/status", CategoryController.updateCategoryStatus);
router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRouter = router;