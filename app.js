//* Dependency Imports
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
// importing ejs-mate
import engine from "ejs-mate";
app.engine("ejs", engine);
// static assets
app.use(express.static(path.join(__dirname, "public")));

//* Project File Imports
// importing seeds
app.use(express.static("/seeds/index.js"));
// importing utilities
import ExpressError from "./utilities/expressError.js";
// importing routers
import campgrounds from "./routes/campgrounds.js";
import reviews from "./routes/reviews.js";

//* App Codes
// home page
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// campground routes
app.use("/campgrounds", campgrounds);

// review routes
app.use("/campgrounds/:id/reviews", reviews);

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
