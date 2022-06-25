const FileController = require('../app/Http/Controllers/FileController')
const { CheckReferrer } = require('../app/Http/Middlewares/CheckReferrer')
const validate = require('../app/Http/Middlewares/RequestValidation')
const {
  FileUpdateRequest
} = require('../app/Http/Requests/FileResourceRequests')

const router = require('express').Router()

router.post('/upload', FileController.uploadFile)
router.get('/download/:path', CheckReferrer, FileController.downloadFile)

router.patch(
  '/update/:id',
  validate(FileUpdateRequest),
  FileController.updateFile
)

module.exports = router
