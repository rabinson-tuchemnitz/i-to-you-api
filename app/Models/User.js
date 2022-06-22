const { Schema, model } = require('mongoose')
const RolesConstant = require('../Constants/RolesConstant')

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: RolesConstant.USER,
      enum: [RolesConstant.ADMIN, RolesConstant.USER]
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = model('users', UserSchema)
