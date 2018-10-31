'use strict'

const validate = require('validate.js')

class DeleteAccountPrecondition {
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

    const validationResult = validate(req.body, this.inject.DeleteAccountConstraints, { fullMessages: false })
    if (validationResult) {
      usecase.emit('handleFailedValidation', validationResult)
      return false
    }

    // Load up the full user from the database, so we can compare passwords with that passed in.
    res.locals.user = await this.inject.dbService.getUserDataMapper().find(res.locals.user)
    const partialUser = this.inject.UserFactory.createUserFromSchema(req.body, this.inject.DeleteAccountMapping)

    const isPasswordCorrect =
      await this.inject.passwordLibrary.isClearPasswordCorrect(
        partialUser.password.clearPassword, res.locals.user.password.encryptedPassword)
    if (!isPasswordCorrect) {
      usecase.emit('handlePasswordIncorrect')
      return false
    }

    return true
  }
}

module.exports = DeleteAccountPrecondition
