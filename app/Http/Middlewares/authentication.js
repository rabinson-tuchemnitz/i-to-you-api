const passport = require('passport')

const authenticate = passport.authenticate('jwt', { session: false })

const checkRole = roles => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next()
  }
  return res.status(401).send({
    message: 'Unauthorized'
  })
}

const optionalAuthenticate = (req, res, next) => {
  const auth = req.header('Authorization')
  if (auth) {
    authenticate(req, res, next)
  } else {
    next()
  }
}

module.exports = {
  authenticate,
  optionalAuthenticate,
  checkRole
}
