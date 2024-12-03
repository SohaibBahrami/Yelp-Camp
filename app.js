//* Imports

// importing express
import express from "express";
const app = express();
app.use(express.urlencoded({ extended: true }));
// importing mongoose
import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
// importing JOI
import Joi from "joi";
// importing method-override
import methodOverride from "method-override";
app.use(methodOverride("_method"));
// importing ejs
import ejs from "ejs";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// importing project files
import Campground from "./models/campground.js";
app.use(express.static("/seeds/index.js"));
import wrapAsync from "./utilities/wrapAsync.js";
import ExpressError from "./utilities/expressError.js";
import Review from "./models/review.js";
import campgrounds from "./routes/campgrounds.js";
// importing ejs-mate
import engine from "ejs-mate";
app.engine("ejs", engine);

//* App Codes

// defining middleware for JOI error handling
const validateReview = (req, res, next) => {
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

// home page
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// campground routes
app.use("/campgrounds", campgrounds);

// add reviews
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// delete reviews
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

// 404 error
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// port start
app.listen(3000, () => {
  console.log("Port 3000 Open");
});