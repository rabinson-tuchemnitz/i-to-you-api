const validate = require('../app/Http/Middlewares/validationMiddleware')
const {
  registerUser,
  loginUser
} = require('../app/http/controllers/userController')
const {
  UserRegistrationSchema,
  UserLoginSchema
} = require('../app/Http/RequestSchemas/UserRequestSchema')

const router = require('express').Router()

router.post('/register', validate(UserRegistrationSchema), registerUser)

router.post('/login', validate(UserLoginSchema), loginUser)

router.post('/logout', async (req, res) => {})

module.exports = router
