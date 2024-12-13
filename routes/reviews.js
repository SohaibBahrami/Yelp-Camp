import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Review from "../models/review.js";
import Campground from "../models/campground.js";
import Joi from "joi";
const router = express.Router({ mergeParams: true });
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware.js";

// add reviews
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// delete reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

export default router;
