const RolesConstant = require('../app/Constants/RolesConstant')
const FileController = require('../app/Http/Controllers/FileController')
const {
  authenticated,
  checkRole
} = require('../app/Http/Middlewares/Authentication')
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
  authenticated,
  checkRole([RolesConstant.ADMIN]),
  validate(FileUpdateRequest),
  FileController.updateFile
)

// Change Requests Endpoints

router.post(
  '/change-request/:file_id',
  authenticated,
  validate(FileChangeRequest),
  FileController.createChangeRequest
)
router.get(
  '/change-request',
  authenticated,
  checkRole([RolesConstant.ADMIN]),
  FileController.getFilesWithChangeRequests
)
router.delete(
  '/change-request/:file_id',
  authenticated,
  checkRole([RolesConstant.ADMIN]),
  FileController.deleteChangeRequest
)

module.exports = router
