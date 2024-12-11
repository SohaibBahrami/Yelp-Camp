export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // store the requested url and return to it after login
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return req.redirect("/login");
  }
  next();
};
