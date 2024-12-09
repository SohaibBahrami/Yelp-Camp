import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import ExpressError from "../utilities/expressError.js";
import Campground from "../models/campground.js";
import Joi from "joi";
const router = express.Router({ mergeParams: true });
import isLoggedIn from "../middleware.js";

// defining middleware for JOI error handling
const validateCampground = (req, res, next) => {
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required().min(0),
    }).required(),
  });
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
  wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
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
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
  })
);

export default router;
