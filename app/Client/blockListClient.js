const { default: axios } = require('axios')
const FileStatusConstant = require('../Constants/FileStatusConstant')
const { requestForCookies } = require('./getBLSToken')

const blockListServiceURL =
  'https://www.tu-chemnitz.de/informatik/DVS/blocklist/'

module.exports = {
  checkBlockStatus: async fileHash => {
    const cookies = await requestForCookies()

    var shibsession
    for (shibsession in cookies);

    var status = FileStatusConstant.UNBLOCKED

    await axios({
      method: 'GET',
      url: blockListServiceURL + fileHash,
      headers: {
        Cookie: shibsession + '=' + cookies[shibsession]
      }
    })
      .then(response => {
        if (response.status == 210) {
          status = FileStatusConstant.BLOCKED
        }
      })
      .catch(error => {
        throw new Error('Something went wrong in BlockList Service')
      })

    return status
  },

  blockFile: async fileHash => {
    const cookies = await requestForCookies()

    var shibsession
    for (shibsession in cookies);

    var requestSuccessful = false

    await axios({
      method: 'PUT',
      url: blockListServiceURL + fileHash,
      headers: {
        Cookie: shibsession + '=' + cookies[shibsession]
      }
    })
      .then(response => {
        if (response.status == 200) {
          requestSuccessful = true
        }
      })
      .catch(error => {
        requestSuccessful = false
        throw new Error('Something went wrong in BlockList Service')
      })

    return requestSuccessful
  },

  unblockFile: async fileHash => {
    const cookies = await requestForCookies()

    var shibsession
    for (shibsession in cookies);

    var requestSuccessful = false

    await axios({
      method: 'DELETE',
      url: blockListServiceURL + fileHash,
      headers: {
        Cookie: shibsession + '=' + cookies[shibsession]
      }
    })
      .then(response => {
        if (response.status == 204) {
          requestSuccessful = true
        }
      })
      .catch(error => {
        requestSuccessful = false
        throw new Error('Something went wrong in BlockList Service')
      })

    return requestSuccessful
  }
}
