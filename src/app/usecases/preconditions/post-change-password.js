'use strict'

const validate = require('validate.js')

class PostChangePasswordPrecondition {
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

    const validationResult = validate(req.body, this.inject.PostChangePasswordConstraints, { fullMessages: false })
    if (validationResult) {
      usecase.emit('handleFailedValidation', validationResult)
      return false
    }

    // Load the full User model to access the the current password
    const user = await this.inject.dbService.getUserDataMapper().find(res.locals.user)

    const isPasswordCorrect =
      await this.inject.passwordLibrary.isClearPasswordCorrect(
        req.body.current_password, user.password.encryptedPassword)

    if (!isPasswordCorrect) {
      usecase.emit('handlePasswordIncorrect')
      return false
    }

    return true
  }
}

module.exports = PostChangePasswordPrecondition
