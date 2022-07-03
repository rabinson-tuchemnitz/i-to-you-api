const {
  requestValidator
} = require('../app/Http/Middlewares/RequestValidation')
const UserController = require('../app/http/controllers/userController')
const {
  UserRegistrationRequest,
  UserLoginRequest
} = require('../app/Http/Requests/UserResourceRequests')
const {
  authenticate,
  checkRole
} = require('../app/Http/Middlewares/Authentication')
const RolesConstant = require('../app/Constants/RolesConstant')

const router = require('express').Router()

router.post(
  '/register',
  requestValidator(UserRegistrationRequest),
  UserController.registerUser
)

router.post(
  '/login',
  requestValidator(UserLoginRequest),
  UserController.loginUser
)

router.post(
  '/add-admin',
  authenticate,
  checkRole([RolesConstant.ADMIN]),
  requestValidator(UserRegistrationRequest),
  UserController.addAdmin
)

module.exports = router
