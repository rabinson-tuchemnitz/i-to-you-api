const File = require('../../Models/File')
const UniqueStringGenerator = require('unique-string-generator')

module.exports = {
  uploadFile: async (req, res) => {
    const batchString = UniqueStringGenerator.UniqueString()
    const files = req.files
    for (let index = 0; index < req.files.length; index++) {
      const newFile = new File({
        name: files[index].originalname,
        type: files[index].mimetype,
        size: files[index].size,
        file: files[index].buffer,
        batch: batchString
      })

      await newFile.save()
    }
    res.status(200).send('File upload api')
  }
}
