const FileController = require('../app/Http/Controllers/FileController')
const { authenticated } = require('../app/Http/Middlewares/Authentication')
const { CheckReferrer } = require('../app/Http/Middlewares/CheckReferrer')
const validate = require('../app/Http/Middlewares/RequestValidation')
const {
  FileUpdateRequest,
  FileChangeRequest
} = require('../app/Http/Requests/FileResourceRequests')

const router = require('express').Router()

router.post('/upload', FileController.uploadFile)
router.get('/download/:path', CheckReferrer, FileController.downloadFile)
router.patch(
  '/update/:file_id',
  validate(FileUpdateRequest),
  FileController.updateFile
)
router.post(
  '/change-request/:file_id',
  authenticated,
  validate(FileChangeRequest),
  FileController.createChangeRequest
)
router.delete(
  '/change-request/:file_id',
  authenticated,
  FileController.deleteChangeRequest
)

module.exports = router
