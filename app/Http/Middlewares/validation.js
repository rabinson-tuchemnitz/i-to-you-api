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

module.exports = requestValidator
