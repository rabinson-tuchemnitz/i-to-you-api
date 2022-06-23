const { Schema, model } = require('mongoose')
const FileStatusConstant = require('../Constants/FileStatusConstant')

const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: FileStatusConstant.UNBLOCKED,
      enum: [FileStatusConstant.BLOCKED, FileStatusConstant.UNBLOCKED]
    },
    file: {
      type: Buffer,
      required: true
    },
    uploaded_by: {},
    last_downloaded_at: {
      type: Date,
      default: null
    },
    batch: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = model('files', FileSchema)
