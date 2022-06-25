module.exports = {
  generateDownloadUrl: (req, path) => {
    return (
      req.protocol + '://' + req.get('host') + '/api/files/download/' + path
    )
  }
}
