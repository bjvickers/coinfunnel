'use strict'

class PostVerifyCausePrecondition {
  constructor (inject) {
    this.name = 'PostVerifyCausePrecondition'
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }
    this.inject.logService.debug({}, 'User is authorised to request Cause verification')

    res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByUserId(res.locals.user.id)
    if (!res.locals.cause.getIsVerifiable()) {
      usecase.emit('handleCauseNotVerifiable', 'Cause cannot be verified')
      return false
    }

    if (res.locals.cause.getIsVerificationComplete()) {
      usecase.emit('handleCauseVerificationComplete', 'Cause verification is already complete')
      return false
    }

    if (res.locals.cause.getIsVerificationPending()) {
      usecase.emit('handleCauseVerificationPending', 'Cause verification is pending')
      return false
    }

    this.inject.logService.debug({}, 'Cause can be verified')
    return true
  }
}

module.exports = PostVerifyCausePrecondition
