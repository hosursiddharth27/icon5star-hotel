module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error', 'Please login to continue');
  res.redirect('/auth/login');
};

module.exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Admin access required');
  res.redirect('/');
};

module.exports.isGuest = (req, res, next) => {
  if (!req.session.user) return next();
  res.redirect('/');
};
