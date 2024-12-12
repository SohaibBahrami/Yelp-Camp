import express from "express";
const router = express.Router();
import User from "../models/User.js";
import wrapAsync from "../utilities/wrapAsync.js";
import passport from "passport";
import { isLoggedIn } from "../middleware.js";

router.get("/register", (req, res) => {
  res.render("users/register", { title: "Register" });
});

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
});

export default router;
