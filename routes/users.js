const validate = require('../app/Http/Middlewares/validation')
const {
  registerUser,
  loginUser
} = require('../app/http/controllers/userController')
const {
  UserRegistrationSchema,
  UserLoginSchema
} = require('../app/Http/RequestSchemas/UserRequestSchema')
const passport = require('passport')

const router = require('express').Router()

router.post('/register', validate(UserRegistrationSchema), registerUser)

router.post('/login', validate(UserLoginSchema), loginUser)

router.post('/logout', async (req, res) => {
  res.send('hi')
})

module.exports = router
