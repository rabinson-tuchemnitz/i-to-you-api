const Joi = require('joi')
const { MAX_FILE_UPLOAD } = require('../../../config/app')
const FileStatusConstant = require('../../Constants/FileStatusConstant')

const FileUploadRequest = Joi.object({
  files: Joi.array().min(1).max(MAX_FILE_UPLOAD)
})

const FileUpdateRequest = Joi.object({
  status: Joi.string()
    .valid(FileStatusConstant.BLOCKED, FileStatusConstant.UNBLOCKED)
    .required()
})

const FileChangeRequest = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  reason: Joi.string().required(),
  action: Joi.valid(FileStatusConstant.BLOCKED, FileStatusConstant.UNBLOCKED)
})

module.exports = {
  FileUploadRequest,
  FileUpdateRequest,
  FileChangeRequest
}
