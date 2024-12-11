import express from "express";
const router = express.Router();
import User from "../models/User.js";
import wrapAsync from "../utilities/wrapAsync.js";

router.get("/register", (req, res) => {
  res.render("users/register", { title: "Register" });
});

router.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

export default router;
