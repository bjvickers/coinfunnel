'use strict'

// @todo implement domin in cookies
// const config = require('config')

// Asks the browser to create a cookie called 'token', responsible
// for encapsulating the jwt on each request.
const setCookie = (res, token) => {
  res.cookie(
    'token',
    token,
    {
      // domain: config.get('cookie.domain')
      // secure: config.get('cookie.secure')
    }
  )
}

// Asks the browser to clear the cookie containing the jwt.
const unsetCookie = (res) => {
  // The cookie options in clearCookie() must be the same as those
  // given when the cookie was created.
  res.clearCookie(
    'token',
    {
      // domain: config.get('cookie.domain')
      // secure: config.get('cookie.secure')
    }
  )
}

module.exports = {
  setCookie,
  unsetCookie
}
