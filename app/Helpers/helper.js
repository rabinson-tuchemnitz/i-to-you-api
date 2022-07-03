module.exports = {
  generateDownloadUrl: (req, path) => {
    return (
      req.protocol + '://' + req.get('host') + '/api/files/download/' + path
    )
  },
  millisToMinutesAndSeconds: millis => {
    var minutes = Math.floor(millis / 60000)
    var seconds = (millis % 60000 / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }
}
