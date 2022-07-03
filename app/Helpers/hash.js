const { createHmac } = require('node:crypto')
const { APP_SECRET } = require('../../config/app')

module.exports = {
  hashBinaryData: async binaryData => {
    return createHmac('sha256', APP_SECRET).update(binaryData).digest('hex')
  }
}
