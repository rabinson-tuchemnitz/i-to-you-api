const RolesConstant = require('../app/Constants/RolesConstant')
const FileController = require('../app/Http/Controllers/FileController')
const {
  authenticate,
  optionalAuthenticate,
  checkRole
} = require('../app/Http/Middlewares/Authentication')
const { CheckReferrer } = require('../app/Http/Middlewares/CheckReferrer')
const {
  requestValidator,
  checkCanDownload
} = require('../app/Http/Middlewares/RequestValidation')
const {
  FileUpdateRequest,
  FileChangeRequest
} = require('../app/Http/Requests/FileResourceRequests')

const router = require('express').Router()

router.post('/upload', optionalAuthenticate, FileController.uploadFile)
router.get(
  '/download/:path',
  optionalAuthenticate,
  checkCanDownload,
  CheckReferrer,
  FileController.downloadFile
)
router.patch(
  '/update/:file_id',
  authenticate,
  checkRole([RolesConstant.ADMIN]),
  requestValidator(FileUpdateRequest),
  FileController.updateFile
)

// Change Requests Endpoints

router.post(
  '/change-request/:file_id',
  authenticate,
  requestValidator(FileChangeRequest),
  FileController.createChangeRequest
)
router.get(
  '/change-request',
  authenticate,
  checkRole([RolesConstant.ADMIN]),
  FileController.getFilesWithChangeRequests
)
router.delete(
  '/change-request/:file_id',
  authenticate,
  checkRole([RolesConstant.ADMIN]),
  FileController.deleteChangeRequest
)

module.exports = router
