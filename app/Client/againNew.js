const parse = require('node-html-parser').parse
var axios = require('axios')
axios.defaults.withCredentials = true
const { USERNAME, PASSWORD } = require('../../config/app')
const qs = require('qs')

var FormData = require('form-data')

const requestForCookies = async () => {
  var cookies = {}
  var redirectUrl = ''
  var authState = ''
  var SAMLResponse = ''
  var RelayState = ''

  await requestLogin().then(response => {
    cookies = appendCookie(cookies, response.headers['set-cookie'])
    redirectUrl = response.request._redirectable._currentUrl
  })

  await requestWAYF(redirectUrl, cookies).catch(error => {
    cookies = appendCookie(cookies, error.response.headers['set-cookie'])
    redirectUrl = error.response.headers.location
  })

  await requestLoginWithSAMLDS(redirectUrl).catch(error => {
    cookies = appendCookie(cookies, error.response.headers['set-cookie'])
    const root = parse(error.response.data)
    redirectUrl = root.querySelector('a').getAttribute('href')
  })

  await requestSSOService(redirectUrl, cookies).catch(error => {
    cookies = appendCookie(cookies, error.response.headers['set-cookie'])
    const root = parse(error.response.data)
    redirectUrl = root.querySelector('#redirect')._attrs.href
  })

  await requestToAddUsername(redirectUrl, cookies).then(response => {
    const root = parse(response.data)
    authState = root.querySelector("form input[name='AuthState']")._attrs.value
  })

  await addUsername(
    'https://wtc.tu-chemnitz.de/krb/module.php/TUC/username.php',
    cookies,
    authState
  ).catch(error => {
    console.log(error)
    cookies = appendCookie(cookies, error.response.headers['set-cookie'])
    redirectUrl = error.response.headers.location
  })

  await addPassword(
    'https://wtc.tu-chemnitz.de/krb/module.php/core/loginuserpass.php',
    cookies,
    authState
  ).then(response => {
    cookies = appendCookie(cookies, response.headers['set-cookie'])
    const root = parse(response.data)
    SAMLResponse = root.querySelector("form input[name='SAMLResponse']")._attrs
      .value
    RelayState = root.querySelector("form input[name='RelayState']")._attrs
      .value
  })

  await getSession(
    'https://www.tu-chemnitz.de/Shibboleth.sso/SAML2/POST',
    cookies,
    SAMLResponse,
    RelayState
  )
    .then(response => {})
    .catch(error => {
      cookies = appendCookie(cookies, error.response.headers['set-cookie'])
    })

  return cookies
}

const requestLogin = async () => {
  return await axios({
    method: 'GET',
    url: 'https://www.tu-chemnitz.de/Shibboleth.sso/Login',
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  })
}

const requestWAYF = async (url, cookieObj) => {
  var data = new FormData()
  data.append('session', 'true')
  data.append('user_idp', 'https://wtc.tu-chemnitz.de/shibboleth')

  return await axios(
    {
      method: 'POST',
      url: url,
      data: data,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        Cookie: '_saml_sp=' + cookieObj['_saml_sp']
      },
      maxRedirects: 0
    },
    {
      withCredentials: true
    }
  )
}

const requestLoginWithSAMLDS = async url => {
  return await axios({
    method: 'GET',
    url: url,
    maxRedirects: 0,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  })
}

const requestSSOService = async (url, cookies) => {
  return await axios(
    {
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        Cookie:
          '_saml_sp=' +
          cookies['_saml_sp'] +
          ';_saml_idp=' +
          cookies['_saml_idp'] +
          ';_redirect_user_idp=' +
          cookies['_redirect_user_idp'] +
          ';_redirection_state=' +
          cookies['_redirection_state']
      },
      maxRedirects: 0
    },
    {
      withCredentials: true
    }
  )
}

const requestToAddUsername = async (url, cookies) => {
  return await axios(
    {
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        Cookie:
          'ShibSessionID=' +
          cookies['ShibSessionID'] +
          ';_saml_sp=' +
          cookies['_saml_sp'] +
          ';_saml_idp=' +
          cookies['_saml_idp'] +
          ';_redirect_user_idp=' +
          cookies['_redirect_user_idp'] +
          ';_redirection_state=' +
          cookies['_redirection_state']
      },
      maxRedirects: 1
    },
    {
      withCredentials: true
    }
  )
}

const addUsername = async (url, cookies, authState) => {
  var data = new FormData()
  data.append('username', USERNAME)
  data.append('AuthState', authState)

  return await axios(
    {
      method: 'POST',
      url: url,
      data: data,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        Cookie:
          'ShibSessionID=' +
          cookies['ShibSessionID'] +
          ';_saml_sp=' +
          cookies['_saml_sp'] +
          ';_saml_idp=' +
          cookies['_saml_idp'] +
          ';_redirect_user_idp=' +
          cookies['_redirect_user_idp'] +
          ';_redirection_state=' +
          cookies['_redirection_state']
      }
    },
    {
      withCredentials: true
    }
  )
}

const addPassword = async (url, cookies, authState) => {
  var data = new FormData()
  data.append('password', PASSWORD)
  data.append('AuthState', authState)

  return await axios(
    {
      method: 'POST',
      url: url,
      data: data,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        Cookie:
          'ShibSessionID=' +
          cookies['ShibSessionID'] +
          ';_saml_sp=' +
          cookies['_saml_sp'] +
          ';_saml_idp=' +
          cookies['_saml_idp'] +
          ';_redirect_user_idp=' +
          cookies['_redirect_user_idp'] +
          ';_redirection_state=' +
          cookies['_redirection_state']
      },
      maxRedirects: 0
    },
    {
      withCredentials: true
    }
  )
}

const getSession = async (url, cookies, SAMLResponse, RelayState) => {
  var data = {
    RelayState: RelayState,
    SAMLResponse: SAMLResponse
  }

  return await axios(
    {
      method: 'POST',
      url: url,
      data: qs.stringify(data),
      headers: {
        Cookie:
          'ShibSessionID=' +
          encodeURI(cookies['ShibSessionID']) +
          ';_saml_sp=' +
          encodeURI(cookies['_saml_sp']) +
          ';_saml_idp=' +
          encodeURI(cookies['_saml_idp']) +
          ';_redirect_user_idp=' +
          encodeURI(cookies['_redirect_user_idp']) +
          ';_redirection_state=' +
          encodeURI(cookies['_redirection_state']) +
          `;_opensaml_req_${RelayState}=` +
          encodeURI(cookies['_opensaml_req_' + RelayState]) +
          ';WTC_AUTHENTICATED=' +
          cookies['WTC_AUTHENTICATED']
      },
      maxRedirects: 0
    },
    {
      withCredentials: true
    }
  )
}

const cookieParser = (cookies, cookieString) => {
  if (cookieString === '') return { ...cookies }

  let pairs = cookieString.split(';')

  let splittedPairs = pairs.map(cookie => cookie.split('='))

  const cookieObj = splittedPairs.reduce(function (obj, cookie) {
    obj[decodeURIComponent(cookie[0].trim())] = cookie[1]
      ? decodeURIComponent(cookie[1].trim())
      : ''

    return {
      ...cookies,
      ...obj
    }
  }, {})

  return cookieObj
}

const appendCookie = (cookies, cookieArray) => {
  cookieArray.forEach(ck => {
    cookies = cookieParser(cookies, ck)
  })
  return cookies
}

module.exports = {
  requestForCookies
}
