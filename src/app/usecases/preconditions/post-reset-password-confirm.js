'use strict'

const validate = require('validate.js')

class PostResetPasswordConfirmPrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    // Initial security check on unknown user.
    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }

    // Validate input before additional security check.
    const validationResult = validate(req.body, this.inject.PostResetPasswordConfirmConstraints, { fullMessages: false })
    if (validationResult) {
      usecase.emit('handleFailedValidation', validationResult)
      return false
    }

    // Next perform critical security check on the known user.
    res.locals.user = await this.inject.identifyUserFromTokenStep.execute(req, res)
    res.locals.usecase = 'PostResetPasswordConfirmUseCase'
    this.inject.applyCriticalResourceAuthStep.execute(req, res)

    return true
  }
}

module.exports = PostResetPasswordConfirmPrecondition
