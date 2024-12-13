import User from "../models/User.js";

const registerForm = (req, res) => {
  res.render("users/register", { title: "Register" });
};

const register = async (req, res, next) => {
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
};

const loginForm = (req, res) => {
  res.render("users/login", { title: "Login", referer: req.headers.referer });
};

const login = async (req, res) => {
  // return to previous url after login
  if (
    req.body.referer &&
    req.body.referer !== undefined &&
    req.body.referer.slice(-6) !== "/login"
  ) {
    res.redirect(req.body.referer);
    req.flash("success", "Welcome back!");
  }
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
};

export default { registerForm, register, loginForm, login, logout };
