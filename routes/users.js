const validate = require('../app/Http/Middlewares/validation')
const UserController = require('../app/http/controllers/userController')
const {
  UserRegistrationSchema,
  UserLoginSchema
} = require('../app/Http/RequestSchemas/UserRequestSchema')
const {
  authenticated,
  checkRole
} = require('../app/Http/Middlewares/authentication')

const router = require('express').Router()

router.post(
  '/register',
  validate(UserRegistrationSchema),
  UserController.registerUser
)

router.post('/login', validate(UserLoginSchema), UserController.loginUser)

module.exports = router
