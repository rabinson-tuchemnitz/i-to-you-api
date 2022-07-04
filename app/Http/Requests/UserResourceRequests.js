const Joi = require('joi')
const { uniqueEmail } = require('../../Rules/UserResourceRules')

const UserRegistrationRequest = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required().custom((value, helpers) => {
    if (!uniqueEmail) {
      return helpers.message('Email already taken')
    }
  }),
  password: Joi.string().min(3).max(10).required(),
  confirm_password: Joi.any().valid(Joi.ref('password')).required()
})

const UserLoginRequest = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).required()
})

module.exports = {
  UserRegistrationRequest,
  UserLoginRequest
}
