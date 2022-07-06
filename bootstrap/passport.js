const { Strategy, ExtractJwt } = require('passport-jwt')
const User = require('../app/Models/User')
const { APP_SECRET } = require('../config/app')

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: APP_SECRET
}

module.exports = passport => {
  passport.use(
    new Strategy(opts, function (jwt_payload, done) {
      User.findOne({ _id: jwt_payload.user_id }, function (err, user) {
        if (err) {
          return done(err, false)
        }
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
          // or you could create a new account
        }
      })
    })
  )
}
