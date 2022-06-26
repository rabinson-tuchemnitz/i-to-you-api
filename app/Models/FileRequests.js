const { Schema } = require('mongoose')

const FileRequestReasonSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    by_owner: {
      type: Boolean,
      default: false
    },
    reason: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = FileRequestReasonSchema
