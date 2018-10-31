'use strict'

class GetLoginPrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (isUserAuthorised) {
      usecase.emit('handleSuccess')
      return false
    }

    return true
  }
}

module.exports = GetLoginPrecondition
