'use strict'

const config = require('config')
const sanitizer = require('sanitizer')
const validate = require('validate.js')

class PostRegisterPrecondition {
  constructor (inject) {
    this.inject = inject
  }

  sanitize (user) {
    user.firstName = sanitizer.escape(user.firstName)
    user.lastName = sanitizer.escape(user.lastName)
    return user
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    // Ensure that the user has completed the Google recaptcha check.
    if (config.get('recaptcha.use') === 'true') {
      const isRecaptchaVerified = await this.inject.verifyRecaptchaStep.execute('register', req.body['g-recaptcha-response'])
      if (!isRecaptchaVerified) {
        usecase.emit('handleFailedRecaptcha')
        return false
      }
    }

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }

    const validationResult = validate(req.body, this.inject.PostRegisterConstraints, { fullMessages: false })
    if (validationResult) {
      this.inject.logService.info({ validationResult: validationResult }, 'User failed registration validation')
      usecase.emit('handleFailedValidation', validationResult)
      return false
    }

    // Create and sanitize
    res.locals.user = this.inject.UserFactory.createUserFromSchema(req.body, this.inject.PostRegisterMapping)
    res.locals.user = this.sanitize(res.locals.user)

    const existingUser = await this.inject.dbService.getUserDataMapper().find(res.locals.user)
    if (existingUser) {
      this.inject.logService.info({ user: existingUser.toJSONWithoutPassword() }, 'User already registered')
      usecase.emit('handleUserAlreadyRegistered')
      return false
    }

    return true
  }
}

module.exports = PostRegisterPrecondition
