const { FRONTEND_URL } = require('../../../config/app')

const CheckReferrer = (req, res, next) => {
  const referrer = req.get('Referrer')
  if (referrer == null || referrer == FRONTEND_URL) {
    next() // referrer is an optional http header, it may not exist
  } else {
    res.status(403).send('Access denied.')
  }
}

module.exports = {
  CheckReferrer
}
