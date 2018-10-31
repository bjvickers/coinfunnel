'use strict'

class UpdateJWTUserStep {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res) {
    const token = await this.inject.jwtLibrary.createJWToken(res.locals.user)
    this.inject.cookieLibrary.setCookie(res, token)
  }
}

module.exports = UpdateJWTUserStep
