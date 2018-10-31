'use strict'

const config = require('config')
const validate = require('validate.js')

class PostLoginPrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    if (config.get('recaptcha.use') === 'true') {
      const isRecaptchaVerified = await this.inject.verifyRecaptchaStep.execute('login', req.body['g-recaptcha-response'])
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

    const validationResult = validate(req.body, this.inject.PostLoginConstraints, { fullMessages: false })
    if (validationResult) {
      usecase.emit('handleFailedValidation', validationResult)
      return false
    }

    let partialUser = this.inject.UserFactory.createUserFromSchema(req.body, this.inject.PostLoginMapping)
    const user = await this.inject.dbService.getUserDataMapper().find(partialUser)
    if (!user) {
      usecase.emit('handleUserNotFound')
      return false
    }

    if (user.registrationState !== this.inject.UserRegistrationStates.confirmed) {
      await this.inject.applyTokenRequestStep.execute(user, this.inject.TokenTypes.registration)
      usecase.emit('handleUserNotConfirmed')
      return false
    }

    if (user.passwordState !== this.inject.UserPasswordStates.confirmed) {
      await this.inject.applyTokenRequestStep.execute(user, this.inject.TokenTypes.reset_password)
      usecase.emit('handleUserPasswordNotConfirmed')
      return false
    }

    const isPasswordCorrect =
      await this.inject.passwordLibrary.isClearPasswordCorrect(
        partialUser.password.clearPassword, user.password.encryptedPassword)

    if (!isPasswordCorrect) {
      usecase.emit('handlePasswordIncorrect')
      return false
    }

    user.merge(partialUser)
    res.locals.user = user
    return true
  }
}

module.exports = PostLoginPrecondition
