const User = require('../Models/User')

const uniqueEmail = async email => {
  let user = User.findOne({ email })
  return !user
}

module.exports = {
  uniqueEmail
}
