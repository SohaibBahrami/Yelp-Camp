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
// importing ejs-mate
import engine from "ejs-mate";
app.engine("ejs", engine);

//* App Codes

// home pages
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
});

// add
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// show
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show.ejs", { campground });
});

// edit
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit.ejs", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

// delete
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

// server start
app.listen(3000, () => {
  console.log("Port 3000 Open");
});
