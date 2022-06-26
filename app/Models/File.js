const { Schema, model } = require('mongoose')
const FileStatusConstant = require('../Constants/FileStatusConstant')
const FileRequestSchema = require('./FileRequests')

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
    size_in_bytes: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: FileStatusConstant.UNBLOCKED,
      enum: []
    },
    file_buffer: {
      type: Buffer,
      required: true
    },
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    download_url_path: {
      type: String,
      required: true
    },
    last_downloaded_at: {
      type: Date
    },
    pending_requests: {
      type: [FileRequestSchema]
    }
  },
  {
    timestamps: true
  }
)

module.exports = model('files', FileSchema)
