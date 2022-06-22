const mongoose = require('mongoose')
const { success } = require('consola')

const { DB_CONNECTION } = require('../config/app')

module.exports = async () => {
  await mongoose.connect(DB_CONNECTION)

  success({
    message: `Database connected successfully: ${DB_CONNECTION}`,
    badge: true
  })
}
