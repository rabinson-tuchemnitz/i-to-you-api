const FileController = require('../app/Http/Controllers/FileController')
const validate = require('../app/Http/Middlewares/validation')

const {
  FileUploadRequest
} = require('../app/Http/Requests/FileResourceRequests')

const router = require('express').Router()

router.post('/upload', validate(FileUploadRequest), FileController.uploadFile)
router.get('/download/:path', FileController.downloadFile)

module.exports = router
