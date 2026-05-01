import express from "express";
import validateRequest from "../../middleware/validateRequest.ts";
import { ReviewController } from "./review.controller.ts";
import { ReviewValidation } from "./review.validation.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);

router.get("/:id", ReviewController.getReviewById);

router.patch(
  "/:id",
  auth(),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  ReviewController.updateReview
);

router.delete(
  "/:id",
  auth(),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
