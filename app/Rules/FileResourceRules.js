const File = require('../Models/File')
const { MAX_FILE_SIZE } = require('../../config/app')

const fileExistenceFromDownloadPath = async path => {
  let file = File.findOne({ download_url_path: path })
  return !file
}

module.exports = {
  fileExistenceFromDownloadPath,
  fileSizeValidation,
  maxFileValidation
}
