'use strict'

class IdentifyUserFromJWTTokenStep {
  constructor (inject) {
    this.jwtLibrary = inject.jwtLibrary
    this.cookieLibrary = inject.cookieLibrary
    this.UserFactory = inject.UserFactory
  }

  async execute (req, res) {
    let user = this.UserFactory.createGuestUser()
    const token = this.jwtLibrary.getJWToken(req)
    if (token) {
      const userFromToken = await this.jwtLibrary.getUserByJWToken(token)
      if (userFromToken) {
        user = userFromToken
      } else {
        this.cookieLibrary.unsetCookie(res)
      }
    }
    return user
  }
}

module.exports = IdentifyUserFromJWTTokenStep
