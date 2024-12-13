import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Campground from "../models/campground.js";
import Joi from "joi";
const router = express.Router({ mergeParams: true });
import { isLoggedIn, isAuthor, validateCampground } from "../middleware.js";


//* campground routes

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  })
);

// add
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new.ejs");
});

router.post(
  "/",
  validateCampground,
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully Made a New Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// show
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campground });
  })
);

// edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit.ejs", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// delete
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
  })
);

export default router;
