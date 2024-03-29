const File = require('../Models/File')
const { MAX_FILE_SIZE } = require('../../config/app')

const fileExistenceFromDownloadPath = async path => {
  let file = File.findOne({ download_url_path: path })
  return !file
}

const validateFileSize = files => {
  let isValid = true
  files.forEach(file => {
    if (file.size > MAX_FILE_SIZE) {
      isValid = false
    }
  })
  return isValid
}
module.exports = {
  fileExistenceFromDownloadPath,
  validateFileSize
}
