import express from "express";
const router = express.Router();
import wrapAsync from "../utilities/wrapAsync.js";
import passport from "passport";
import users from "../controllers/users.js";

router.get("/register", users.registerForm);

router.post("/register", wrapAsync(users.register));

router.get("/login", users.loginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(users.login)
);

router.get("/logout", users.logout);

export default router;
