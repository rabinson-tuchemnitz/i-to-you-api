const File = require('../../Models/File')
const UniqueStringGenerator = require('unique-string-generator')
const { generateDownloadUrl } = require('../../Helpers/helper')
const { upload } = require('../Middlewares/UploadFile')
const { validateFileSize } = require('../../Rules/FileResourceRules')

module.exports = {
  uploadFile: async (req, res) => {
    try {
      upload(req, res, async function (err) {
        if (err) {
          return res.status(422).send({ message: err.message })
        } else {
          const files = req.files
          if (files.length < 1) {
            res.status(422).send({
              error: 'files is required',
              success: false
            })
          }
          if (!validateFileSize(files)) {
            res.status(422).send({
              error: 'files is required',
              success: false
            })
          }
          let fileDocuments = files.map(file => {
            return {
              name: file.originalname,
              type: file.mimetype,
              size_in_bytes: file.size,
              file_buffer: file.buffer,
              download_url_path: UniqueStringGenerator.UniqueString()
            }
          })
          const uploadedFiles = await File.insertMany(fileDocuments)

          const returnFiles = uploadedFiles.map(file => {
            return {
              name: file.name,
              size_in_bytes: file.size_in_bytes,
              type: file.type,
              status: file.status,
              download_url: generateDownloadUrl(req, file.download_url_path)
            }
          })

          res.status(201).send({
            message: 'File uploaded successfully.',
            success: true,
            data: {
              uploaded_files: returnFiles
            }
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        message: 'Failed to upload the file',
        success: false
      })
    }
  },

  downloadFile: async (req, res) => {
    try {
      const filePath = req.params.path
      const file = await File.findOne({ download_url_path: filePath })

      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${file.name}"`,
        'Content-Type': file.type
      })
      const download = Buffer.from(file.file_buffer, 'base64')
      res.end(download)
    } catch (err) {
      res.status(500).send({
        message: 'Failed to upload the file',
        success: false
      })
    }
  }
}
