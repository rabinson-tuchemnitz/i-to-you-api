const passport = require('passport')

const authenticated = passport.authenticate('jwt', { session: false })

const checkRole = roles => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next()
  }
  return res.status(401).json({
    message: 'Unauthorized',
    success: false
  })
}

module.exports = {
  authenticated,
  checkRole
}
