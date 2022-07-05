const File = require('../Models/File')

const deleteInactiveFilesCommand = async () => {
  await require('../../bootstrap/database')()
  console.log('Deleting files not used for 14 days')

  try {
    var date = new Date()
    date.setDate(date.getDate() - 1)
    date.setHours(0, 0, 0, 0)

    results = await File.deleteMany({
      $or: [
        {
          $and: [
            { last_downloaded_at: { $exists: true, $ne: null } },
            { last_downloaded_at: { $lt: date } }
          ]
        },
        {
          $and: [
            { last_downloaded_at: { $exists: false } },
            { createdAt: { $lt: date } }
          ]
        }
      ]
    }).select({ _id: 1 })

    console.log(results)

    console.log('Operation Completed')
  } catch (err) {
    console.log('Operation Failed.')
    console.log(err)
  }
}

deleteInactiveFilesCommand()
