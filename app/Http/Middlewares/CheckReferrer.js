const CheckReferrer = (req, res, next) => {
  const referrer = req.get('Referrer')
  if (referrer == null) {
    next() // referrer is an optional http header, it may not exist
  } else {
    res.status(403).send('Access denied for the photo')
  }
}

module.exports = {
  CheckReferrer
}
