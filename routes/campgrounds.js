import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Joi from "joi";
const router = express.Router({ mergeParams: true });
import { isLoggedIn, isAuthor, validateCampground } from "../middleware.js";
import campgrounds from "../controllers/campgrounds.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

//* campground routes

router.get("/", wrapAsync(campgrounds.index));

// add
router.get("/new", isLoggedIn, campgrounds.addCampForm);

router.post(
  "/",
  validateCampground,
  isLoggedIn,
  wrapAsync(campgrounds.addCamp)
);

router.post("/", upload.array("image"), (req, res) => {});

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
  validateCampground,
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCamp)
);

// delete
router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp));

export default router;
