import express from "express";
import { BlogControllers } from "./blog.controller.ts";
import auth from "../../utils/auth.ts";


const router = express.Router();

router.post("/", auth(), BlogControllers.createBlog);
router.get("/",  BlogControllers.getAllBlog);
router.get("/:id", BlogControllers.getBlogById);
router.put("/:id", auth(), BlogControllers.updateBlog);
router.delete("/:id", auth(), BlogControllers.deleteBlog);
router.patch("/:id/status", auth(), BlogControllers.updateBlogStatus);

export const BlogRoutes = router;
