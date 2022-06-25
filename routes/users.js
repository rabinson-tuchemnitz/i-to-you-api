const validate = require('../app/Http/Middlewares/validation')
const UserController = require('../app/http/controllers/userController')
const {
  UserRegistrationRequest,
  UserLoginRequest
} = require('../app/Http/Requests/UserResourceRequests')
const {
  authenticated,
  checkRole
} = require('../app/Http/Middlewares/authentication')

const router = require('express').Router()

router.post(
  '/register',
  validate(UserRegistrationRequest),
  UserController.registerUser
)

router.post('/login', validate(UserLoginRequest), UserController.loginUser)

module.exports = router
