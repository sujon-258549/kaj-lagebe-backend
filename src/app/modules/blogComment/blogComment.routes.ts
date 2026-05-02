import express from "express";
import { BlogCommentControllers } from "./blogComment.controller.ts";
import auth from "../../utils/auth.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { BlogCommentValidation } from "./blogComment.validation.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

// Public can post comments
router.post(
  "/",
  validateRequest(BlogCommentValidation.createBlogCommentZodSchema),
  BlogCommentControllers.createBlogComment,
);

// Get all comments (maybe for admin dashboard)
router.get("/", auth(), BlogCommentControllers.getAllBlogComments);

// Get comments for a specific blog (Public)
router.get("/blog/:blogId", BlogCommentControllers.getCommentsByBlogId);

// Get comment by ID
router.get("/:id", BlogCommentControllers.getBlogCommentById);

// Update comment (admin only)
router.patch(
  "/:id",
  auth(),
  validateRequest(BlogCommentValidation.updateBlogCommentZodSchema),
  BlogCommentControllers.updateBlogComment,
);

// Delete comment (admin only)
router.delete("/:id", auth(), BlogCommentControllers.deleteBlogComment);

export const BlogCommentRoutes = router;
