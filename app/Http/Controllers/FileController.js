const File = require('../../Models/File')
const UniqueStringGenerator = require('unique-string-generator')
const { generateDownloadUrl } = require('../../Helpers/helper')
const { upload } = require('../Middlewares/UploadFile')
const { validateFileSize } = require('../../Rules/FileResourceRules')
const FileStatusConstant = require('../../Constants/FileStatusConstant')
const { unblockFile, blockFile } = require('../../Client/blockListClient')
const { hashBinaryData } = require('../../Helpers/hash')
const UnRegisteredUserModel = require('../../Models/UnRegisteredUser')
var rate = require('transfer-rate')()

module.exports = {
  uploadFile: async (req, res) => {
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
            id: file._id,
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
  },

  downloadFile: async (req, res) => {
    var start = process.hrtime()

    const filePath = req.params.path

    if (!req.user) {
      await UnRegisteredUserModel.create({
        ip: req.ip
      })
    }
    const file = await File.findOne({ download_url_path: filePath })

    await file.updateOne({
      last_downloaded_at: Date.now()
    })

    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${file.name}"`,
      'Content-Type': file.type
    })

    const download = Buffer.from(file.file_buffer, 'base64')
    res.end(download)
    rate(req, res, start)

    console.log(res.transferRate) // show transferRate to console
  },

  updateFile: async (req, res) => {
    const fileId = req.params.file_id
    const updateStatus = req.body.status

    const file = await File.findOne({ _id: fileId })
    if (!file) {
      return res.status(404).send({
        message: 'File not found',
        success: false
      })
    }

    if (file.status == updateStatus) {
      return res.status(422).send({
        message: 'File already in given state',
        success: false
      })
    }

    // Update in database
    await File.updateOne(
      {
        _id: fileId
      },
      {
        status: updateStatus
      }
    )

    // // Generate hash of file
    // var hashString = await hashBinaryData(file.file_buffer)

    // // Update in blocklist webservice
    // if (updateStatus == FileStatusConstant.BLOCKED) {
    //   await blockFile(hashString)
    // } else if (updateStatus == FileStatusConstant.UNBLOCKED) {
    //   await unblockFile(hashString)
    // }

    res.status(200).send({
      message: 'File updated successfully',
      success: true
    })
  },

  getFilesWithChangeRequests: async (req, res) => {
    const files = await File.find({ 'pending_requests.1': { $exists: true } })
    const resultFiles = files.map(file => {
      return {
        _id: file._id,
        name: file.name,
        type: file.type,
        size: file.type,
        status: file.status
      }
    })
    return res.status(200).send({
      message: 'Pending requests fetched successfully.',
      success: true,
      data: resultFiles
    })
  },

  createChangeRequest: async (req, res) => {
    const fileId = req.params.file_id
    const { name, email, action, reason } = req.body
    // Check if file exists
    const file = await File.findOne({ _id: fileId })
    if (!file) {
      return res.status(404).send({
        message: 'File not found',
        success: false
      })
    }

    // Check previous request action and validate the request
    if (file.status === action) {
      return res.status(409).send({
        message: 'File already on the requested status',
        success: false
      })
    }

    await File.updateOne(
      { _id: fileId },
      {
        $push: {
          pending_requests: {
            name,
            email,
            reason
          }
        }
      }
    )
    return res.status(200).send({
      message: 'Change reqeusted successfully',
      sucess: false
    })
  },

  deleteChangeRequest: async (req, res) => {
    const fileId = req.params.file_id

    // Check if file exists
    const file = await File.findOne({ _id: fileId })
    if (!file) {
      return res.status(404).send({
        message: 'File not found',
        success: false
      })
    }

    await File.updateOne(
      { _id: fileId },
      {
        $set: {
          pending_requests: []
        }
      }
    )

    return res.status(200).send({
      message: 'Request removed successfully',
      success: true
    })
  }
}
