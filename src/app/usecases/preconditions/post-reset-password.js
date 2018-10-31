'use strict'

const config = require('config')
const validate = require('validate.js')

class PostResetPasswordPrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    // Ensure that the user has completed the Google recaptcha check.
    if (config.get('recaptcha.use') === 'true') {
      const isRecaptchaVerified = await this.inject.verifyRecaptchaStep.execute('reset_password', req.body['g-recaptcha-response'])
      if (!isRecaptchaVerified) {
        usecase.emit('handleFailedRecaptcha')
        return false
      }
    }

    // Initial security check on unknown user.
    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }

    // Validate input before additional security check
    const validationResult = validate(req.body, this.inject.PostResetPasswordConstraints, { fullMessages: false })
    if (validationResult) {
      usecase.emit('handleFailedValidation', validationResult)
      return false
    }

    // Identify the user in the database
    const partialUser = this.inject.UserFactory.createUserFromSchema(req.body, this.inject.PostResetPasswordMapping)
    res.locals.user = await this.inject.dbService.getUserDataMapper().find(partialUser)
    if (!res.locals.user) {
      usecase.emit('handleUserNotFound')
      return false
    }

    // Additional security check on the known user.
    res.locals.usecase = 'PostResetPasswordUseCase'
    this.inject.applyCriticalResourceAuthStep.execute(req, res)

    // Final checks on suitability to access this resource.
    if (res.locals.user.registrationState !== this.inject.UserRegistrationStates.confirmed) {
      await this.inject.applyTokenRequestStep.execute(res.locals.user, this.inject.TokenTypes.registration)
      usecase.emit('handleUserNotConfirmed')
      return false
    }

    if (res.locals.user.passwordState !== this.inject.UserPasswordStates.confirmed) {
      await this.inject.applyTokenRequestStep.execute(res.locals.user, this.inject.TokenTypes.reset_password)
      usecase.emit('handleUserPasswordNotConfirmed')
      return false
    }

    return true
  }
}

module.exports = PostResetPasswordPrecondition
