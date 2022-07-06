const File = require('../../Models/File')
const UniqueStringGenerator = require('unique-string-generator')
const { generateDownloadUrl } = require('../../Helpers/helper')
const { upload } = require('../Middlewares/UploadFile')
const { validateFileSize } = require('../../Rules/FileResourceRules')
const FileStatusConstant = require('../../Constants/FileStatusConstant')
const { unblockFile, blockFile } = require('../../Client/blockListClient')
const { hashBinaryData } = require('../../Helpers/hash')
const UnRegisteredUserModel = require('../../Models/UnRegisteredUser')
const { isObjectIdOrHexString } = require('mongoose')
const User = require('../../Models/User')
var rate = require('transfer-rate')()

module.exports = {
  uploadFile: async (req, res) => {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(422).send({ message: err.message })
      } else {
        const files = req.files
        if (files.length < 1) {
          return res.status(422).send({
            error: 'files is required',
            success: false
          })
        }
        if (!validateFileSize(files)) {
          return res.status(422).send({
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
            download_url_path: UniqueStringGenerator.UniqueString(),
            uploaded_by: req.user ? req.user._id : null
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

        return res.status(201).send({
          message: 'File uploaded successfully.',
          status: true,
          payload: {
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

    if (!file) {
      return res.status(404).send({
        message: 'File not found',
        success: false
      })
    }
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

  getFileDetails: async (req, res) => {
    const fileId = req.params.file_id

    if (!isObjectIdOrHexString(fileId)) {
      return res.sendStatus(404).send({
        message: 'File not found.',
        success: false
      })
    }
    const file = await File.findOne({ _id: fileId })

    if (!file) {
      return res.status(404).send({
        message: 'File not found.',
        success: false
      })
    }

    const returnFile = {
      id: file.id,
      name: file.name,
      size_in_bytes: file.size_in_bytes,
      type: file.type,
      status: file.status,
      uploaded_at: file.createdAt,
      download_path: file.download_url_path
    }

    res.status(200).send({
      message: 'File fetched successfully.',
      success: true,
      data: returnFile
    })
  },

  deleteFile: async (req, res) => {
    const fileId = req.params.file_id
    console.log(req.user)
    if (!isObjectIdOrHexString(fileId)) {
      return res.sendStatus(404).send({
        message: 'File not found.',
        success: false
      })
    }
    const file = await File.findOne({ _id: fileId, uploaded_by: req.user._id })

    if (!file) {
      return res.status(404).send({
        message: 'File not found.',
        success: false
      })
    }

    await File.deleteOne({ _id: fileId })

    return res.status(204).send({
      message: 'File deleted successfully.',
      success: true
    })
  },

  getUploadedFileList: async (req, res) => {
    const files = await File.find({ uploaded_by: req.user._id })

    const returnFiles = files.map(file => {
      return {
        id: file._id,
        name: file.name,
        size_in_bytes: file.size_in_bytes,
        type: file.type,
        status: file.status,
        download_url: file.download_url_path,
        uploaded_at: file.createdAt
      }
    })

    res.status(200).send({
      message: 'Uploaded files fetched successfully',
      success: true,
      data: returnFiles
    })
  },

  acceptChangeRequest: async (req, res) => {
    const fileId = req.params.file_id
    const updateStatus = req.body.status

    if (!isObjectIdOrHexString(fileId)) {
      return res.status(404).send({
        message: 'File not found.',
        success: false
      })
    }
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

    // Generate hash of file
    var hashString = await hashBinaryData(file.file_buffer)

    console.log('calling blocking service')
    // Update in blocklist webservice
    if (updateStatus == FileStatusConstant.BLOCKED) {
      const response = await blockFile(hashString)
      console.log(response)
    } else if (updateStatus == FileStatusConstant.UNBLOCKED) {
      const response = await unblockFile(hashString)
      console.log(response)
    }

    await File.updateOne(
      { _id: fileId },
      {
        $set: {
          pending_requests: []
        }
      }
    )
    // Update in database
    await File.updateOne(
      {
        _id: fileId
      },
      {
        $set: {
          status: updateStatus,

          pending_requests: []
        }
      }
    )

    res.status(200).send({
      message: 'File updated successfully',
      success: true
    })
  },

  getFilesWithChangeRequests: async (req, res) => {
    const files = await File.find({ 'pending_requests.0': { $exists: true } })

    const resultFiles = files.map(file => {
      var ownerRequest = {}
      var userRequests = []
      var returnFile = {
        _id: file._id,
        name: file.name,
        type: file.type,
        size_in_bytes: file.size_in_bytes,
        status: file.status
      }

      file.pending_requests.map(reason => {
        if (reason.by_owner) {
          ownerRequest = reason
        } else {
          userRequests.push(reason)
        }
      })

      returnFile['reasons'] = {
        owner: ownerRequest,
        users: userRequests
      }
      return returnFile
    })
    return res.status(200).send({
      message: 'Pending requests fetched successfully.',
      success: true,
      data: resultFiles
    })
  },

  createChangeRequest: async (req, res) => {
    const fileId = req.params.file_id
    var { name, email, reason, action } = req.body

    if (req.user) {
      name = req.user.reason
      email = req.user.email
    }
    // Check if file exists
    const file = await File.findOne({ _id: fileId })
    if (!file) {
      return res.status(404).send({
        message: 'File not found',
        success: false
      })
    }

    var isAlreadyRequested = false

    // Check if the request already done by the user
    file.pending_requests.forEach(request => {
      if (request.email == email) {
        isAlreadyRequested = true
      }
    })

    if (isAlreadyRequested) {
      return res.status(409).send({
        message: 'You have already requested.',
        success: false
      })
    }

    // Check if invalid or already in
    if (file.status === action) {
      return res.status(409).send({
        message: 'File already on the requested status',
        success: false
      })
    }

    const user = await User.findOne({ email: email })

    await File.updateOne(
      { _id: fileId },
      {
        $push: {
          pending_requests: {
            name,
            email,
            reason,
            by_owner: user.id == file.uploaded_by
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
