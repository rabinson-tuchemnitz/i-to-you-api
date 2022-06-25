const multer = require('multer')
const { MAX_FILE_UPLOAD, MAX_FILE_SIZE } = require('../../../config/app')

const fileStorage = multer.memoryStorage()

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: MAX_FILE_SIZE }
}).array('files', MAX_FILE_UPLOAD)

module.exports = {
  upload
}
