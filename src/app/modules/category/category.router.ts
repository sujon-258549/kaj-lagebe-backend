import { Router } from "express";
import { CategoryController } from "./category.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { CategoryValidation } from "./category.validaction.ts";


import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = Router();

router.post("/", auth(), validateRequest(CategoryValidation.createCategoryZodSchema), CategoryController.createCategory);
router.get("/", CategoryController.getAllCategory);
router.get("/:id", CategoryController.getCategoryByIdentifier);
router.put("/:id", auth(), validateRequest(CategoryValidation.updateCategoryZodSchema), CategoryController.updateCategory);
router.patch("/:id/status", auth(), CategoryController.updateCategoryStatus);
router.delete("/:id", auth(), CategoryController.deleteCategory);

export const CategoryRouter = router;
