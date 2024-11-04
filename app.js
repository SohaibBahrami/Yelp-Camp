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
import expressError from "./utilities/expressError.js";
// importing ejs-mate
import engine from "ejs-mate";
import ExpressError from "./utilities/expressError.js";
app.engine("ejs", engine);

//* App Codes

// home pages
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get(
  "/campgrounds",
  wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  })
);

// add
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});

app.post(
  "/campgrounds",
  wrapAsync(async (req, res, next) => {
    if (!req.body.campground)
      throw new ExpressError("Invalid Campground Data!", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// show
app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show.ejs", { campground });
  })
);

// edit
app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit.ejs", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// delete
app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// 404 error
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

// error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).send(message);
});

// server start
app.listen(3000, () => {
  console.log("Port 3000 Open");
});
