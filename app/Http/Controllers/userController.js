const bcrypt = require('bcryptjs')
const User = require('./../../Models/User')

module.exports = {
  registerUser: async (req, res) => {
    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 15)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    })

    await newUser.save()

    return res.status(201).json({
      message: 'User registered successfully.'
    })
  },

  loginUser: async (req, res) => {
    res.send('This is login function')
  }
}
