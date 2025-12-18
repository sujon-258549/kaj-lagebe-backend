import { Router } from "express";
import { CategoryController } from "./category.controller.js";

const router = Router();

router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getAllCategory);
router.get("/:id", CategoryController.getCategoryById);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRouter = router;