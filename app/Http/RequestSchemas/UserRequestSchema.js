const Joi = require('joi')
const { uniqueEmail } = require('../../rules/validateEmail')

const UserRegistrationSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string()
    .email()
    .required()
    .custom(uniqueEmail, 'The email is already taken'),
  password: Joi.string().min(3).max(10).required(),
  confirm_password: Joi.any().valid(Joi.ref('password')).required()
})

const UserLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).required()
})

module.exports = {
  UserRegistrationSchema,
  UserLoginSchema
}
