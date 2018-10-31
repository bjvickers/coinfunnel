'use strict'

class DeleteCauseImagePrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)
    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }

    res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByUserId(res.locals.user.id)
    return true
  }
}

module.exports = DeleteCauseImagePrecondition
