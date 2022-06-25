const FileController = require('../app/Http/Controllers/FileController')
const { CheckReferrer } = require('../app/Http/Middlewares/CheckReferrer')
const validate = require('../app/Http/Middlewares/RequestValidation')

const {
  FileUploadRequest
} = require('../app/Http/Requests/FileResourceRequests')

const router = require('express').Router()

router.post('/upload', validate(FileUploadRequest), FileController.uploadFile)
router.get('/download/:path', CheckReferrer, FileController.downloadFile)

module.exports = router
