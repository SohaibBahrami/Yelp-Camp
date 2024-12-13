import ExpressError from "./utilities/expressError.js";
import Campground from "./models/campground.js";

// middleware for authentication
export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

// middleware for JOI error handling
export const validateCampground = (req, res, next) => {
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

// defining middleware for JOI error handling
export const validateReview = (req, res, next) => {
  const reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required(),
    }).required(),
  });
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// middleware for post authorization
export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
