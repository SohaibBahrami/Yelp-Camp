// dotenv
if (process.env.NODE_ENV !== "production") {
  import("dotenv").config();
}

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
// importing express-session
import session from "express-session";
// importing connect-flash
import flash from "connect-flash";
// importing method-override
import methodOverride from "method-override";
app.use(methodOverride("_method"));
// importing passport
import passport from "passport";
import LocalStrategy from "passport-local";
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
import campgroundRoutes from "./routes/campgrounds.js";
import reviewRoutes from "./routes/reviews.js";
import userRoutes from "./routes/users.js";
// importing models
import User from "./models/User.js";

//* App Codes

// HTTP sessions
const sessionConfig = {
  secret: "thisIsMySecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // this cookie expires in a week in milliseconds
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));

// using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// using flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// home page
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// campground routes
app.use("/campgrounds", campgroundRoutes);

// review routes
app.use("/campgrounds/:id/reviews", reviewRoutes);

// user routes
app.use("/", userRoutes);

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
