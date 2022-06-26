const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./../../Models/User')
const { APP_SECRET } = require('../../../config/app')
const RolesConstant = require('../../Constants/RolesConstant')

module.exports = {
  registerUser: async (req, res) => {
    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 15)

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: RolesConstant.USER
    })

    return res.status(201).json({
      message: 'User registered successfully.'
    })
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'Invalid login credentials.',
        success: false
      })
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          email: user.email
        },
        APP_SECRET,
        { expiresIn: '10 days' }
      )

      return res.status(200).json({
        message: 'User logged in successfully.',
        token: `Bearer ${token}`
      })
    } else {
      return res.status(422).json({
        message: 'Invalid login credentials',
        success: false
      })
    }
  },

  addAdmin: async (req, res) => {
    const { name, email, password, role } = req.body

    const hashedPassword = await bcrypt.hash(password, 15)

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: RolesConstant.ADMIN
    })

    return res.status(201).json({
      message: 'User registered successfully.'
    })
  }
}
