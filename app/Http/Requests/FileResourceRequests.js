const Joi = require('joi')
const { MAX_FILE_UPLOAD } = require('../../../config/app')

const FileUploadRequest = Joi.object({
  files: Joi.array().min(1).max(MAX_FILE_UPLOAD)
})

module.exports = {
  FileUploadRequest
}
