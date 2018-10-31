'use strict'

const EventEmitter = require('events').EventEmitter

class PostResetPasswordUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostResetPasswordUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.postResetPasswordPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      // Update user status to indicate a password reset is in effect.
      res.locals.user.passwordState = this.inject.UserPasswordStates.pre_confirmed
      res.locals.user = await this.inject.dbService.getUserDataMapper().persist(res.locals.user)

      // Build token and send email
      await this.inject.applyTokenRequestStep.execute(res.locals.user, this.inject.TokenTypes.reset_password)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostResetPasswordUseCase
