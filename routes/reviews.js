import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Joi from "joi";
const router = express.Router({ mergeParams: true });
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware.js";
import reviews from "../controllers/reviews.js";

// create reviews
router.post("/", validateReview, isLoggedIn, wrapAsync(reviews.createReview));

// delete reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

export default router;
