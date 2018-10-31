'use strict'

class IdentifyUserFromTokenStep {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res) {
    res.locals.token = await this.inject.dbService.getTokenDataMapper().find(req.query.token)
    if (!res.locals.token) {
      throw new Error('Password reset token is invalid.')
    }

    const user = await this.inject.dbService.getUserDataMapper().find(this.inject.UserFactory.createUserById(res.locals.token.userId))
    if (!user) {
      throw new Error('User not found from password reset token')
    }
    return user
  }
}

module.exports = IdentifyUserFromTokenStep
