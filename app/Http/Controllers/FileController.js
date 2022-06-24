const File = require('../../Models/File')
const UniqueStringGenerator = require('unique-string-generator')
const { generateDownloadUrl } = require('../../Helpers/helper')

module.exports = {
  uploadFile: async (req, res) => {
    try {
      const files = req.files
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
    } catch (err) {
      throw new Error(err)
    }
  }
}
