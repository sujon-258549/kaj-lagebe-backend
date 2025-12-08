import { Router } from "express";
import { CategoryController } from "./category.controller.js";

const router = Router();

router.post("/create-category", CategoryController.createCategory);

export const CategoryRouter = router;