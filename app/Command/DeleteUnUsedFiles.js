const File = require('../Models/File')

export const deleteInactiveFilesCommand = async () => {
  try {
    var date = new Date()
    date.setDate(date.getDate() - 1)
    date.setHours(0, 0, 0, 0)
    results = await File.find({
      $and: [
        { download_url_path: { $exists: true, $ne: null } },
        { createdAt: { $lt: date } }
      ]
    })

    results.forEach(file => {
        await File.findOneAndDelete({_id: file.id})
    })
  } catch (err) {
    console.log(err)
  }
}