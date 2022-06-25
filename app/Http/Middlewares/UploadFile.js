const multer = require('multer')
const { MAX_FILE_UPLOAD, MAX_FILE_SIZE } = require('../../../config/app')

const fileStorage = multer.memoryStorage()

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.size <= MAX_FILE_SIZE) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Invalid file size'))
    }
  }
}).array('files', MAX_FILE_UPLOAD)

module.exports = {
  upload
}
