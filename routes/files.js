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

router.get(
  '/pending-requests',
  authenticate,
  checkRole([RolesConstant.ADMIN]),
  FileController.getFilesWithChangeRequests
)

router.post('/upload', optionalAuthenticate, FileController.uploadFile)
router.get(
  '/download/:path',
  optionalAuthenticate,
  checkCanDownload,
  CheckReferrer,
  FileController.downloadFile
)
router.patch(
  '/change-request/:file_id',
  authenticate,
  checkRole([RolesConstant.ADMIN]),
  requestValidator(FileUpdateRequest),
  FileController.acceptChangeRequest
)

router.get(
  '/uploads',
  authenticate,
  checkRole([RolesConstant.USER]),
  FileController.getUploadedFileList
)

router.get('/:file_id/', FileController.getFileDetails)

// Change Requests Endpoints

router.post(
  '/change-request/:file_id',
  authenticate,
  requestValidator(FileChangeRequest),
  FileController.createChangeRequest
)

router.delete(
  '/change-request/:file_id',
  authenticate,
  checkRole([RolesConstant.ADMIN]),
  FileController.deleteChangeRequest
)

module.exports = router
