const { Schema, model } = require('mongoose')

const UnRegisteredUserSchema = new Schema({
  ip: {
    type: String,
    required: true
  },
  last_downloaded: {
    type: Date,
    default: new Date()
  }
})

module.exports = model('unregistered_users', UnRegisteredUserSchema)
