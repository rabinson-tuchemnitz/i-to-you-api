module.exports = {
  generateDownloadUrl: (req, path) => {
    return req.protocol + '://' + req.get('host') + '/api/download/' + path
  }
}
