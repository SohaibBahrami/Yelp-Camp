import Campground from "../models/campground.js";

const index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

const addCampForm = (req, res) => {
  res.render("campgrounds/new.ejs");
};

const addCamp = async (req, res, next) => {
  try {
    console.log("Uploaded files:", req.files); // Log uploaded files
    const campground = new Campground(req.body.campground);
    campground.image = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully Made a New Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    console.error("Error creating campground:", error); // Log error details
    req.flash("error", "Failed to create campground. Please try again.");
    res.redirect("/campgrounds/new");
  }
};

const showCamp = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show.ejs", { campground });
};

const editCampForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit.ejs", { campground });
};

const editCamp = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = (f) => ({
    url: f.path,
    filename: f.filename,
  });
  campground.image.push(req.files.map(...imgs));
  await campground.save();
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

const deleteCamp = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
};

export default {
  deleteCamp,
  editCamp,
  editCampForm,
  showCamp,
  addCamp,
  addCampForm,
  index,
};
