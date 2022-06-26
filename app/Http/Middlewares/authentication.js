const passport = require('passport')

const authenticated = passport.authenticate('jwt', { session: false })

const checkRole = roles => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next()
  }
  throw new Error('Access denied.')
}

module.exports = {
  authenticated,
  checkRole
}
