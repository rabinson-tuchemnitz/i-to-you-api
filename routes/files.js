const FileController = require('../app/Http/Controllers/FileController')
const { CheckReferrer } = require('../app/Http/Middlewares/CheckReferrer')

const router = require('express').Router()

router.post('/upload', FileController.uploadFile)
router.get('/download/:path', CheckReferrer, FileController.downloadFile)

module.exports = router
