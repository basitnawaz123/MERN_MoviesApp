const requireAuth = (req, res, next) => {
  // const token = req.header("token");
  const isLoggedIn = req.oidc.isAuthenticated();

  if (isLoggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = {
  requireAuth,
};
