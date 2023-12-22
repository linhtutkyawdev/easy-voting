exports.voteAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/campaign-list");
  }
};
