const { millisToMinutesAndSeconds } = require('../../Helpers/helper')
const UnRegisteredUser = require('../../Models/UnRegisteredUser')

const requestValidator = requestSchema => async (req, res, next) => {
  const body = req.body
  const { error, value } = await requestSchema.validate(body, {
    abortEarly: false
  })
  if (error) {
    return res.status(422).send(error.details)
  }
  next()
}

const checkCanDownload = async (req, res, next) => {
  if (!req.user) {
    const ipUser = await UnRegisteredUser.findOne({ ip: req.ip })

    if (!ipUser) {
      return next()
    }

    const lastDownloadedTime = Date.parse(ipUser.last_downloaded)
    const currentTime = new Date()

    var diffMs = currentTime - lastDownloadedTime

    if (Math.round(diffMs % 86400000 % 3600000 / 60000) < 10) {
      return res.status(403).send({
        message: `You can download in ${millisToMinutesAndSeconds(
          600000 - diffMs
        )} minutes. Please register to revoke this limitation.`
      })
    }
  }
  next()
}

module.exports = {
  requestValidator,
  checkCanDownload
}
