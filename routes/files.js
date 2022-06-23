const FileController = require('../app/Http/Controllers/FileController')
const { upload } = require('../app/Http/Middlewares/upload')
const { authenticated } = require('../app/Http/Middlewares/authentication')

const router = require('express').Router()

router.post('/upload', authenticated, upload, FileController.uploadFile)

module.exports = router
