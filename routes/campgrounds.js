import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Joi from "joi";
const router = express.Router({ mergeParams: true });
import { isLoggedIn, isAuthor, validateCampground } from "../middleware.js";
import campgrounds from "../controllers/campgrounds.js";
import multer from "multer";
import { storage } from "../cloudinary/index.js";
const upload = multer({ storage });

//* campground routes

router.get("/", wrapAsync(campgrounds.index));

// add
router.get("/new", isLoggedIn, campgrounds.addCampForm);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  wrapAsync(campgrounds.addCamp)
);

// show
router.get("/:id", wrapAsync(campgrounds.showCamp));

// edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateCampground,
  wrapAsync(campgrounds.editCamp)
);

// delete
router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp));

export default router;
