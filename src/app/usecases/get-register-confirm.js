'use strict'

const EventEmitter = require('events').EventEmitter

class GetRegisterConfirmUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetRegisterConfirmUseCase'
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
      const preconditionSatisfied = await this.inject.getRegisterConfirmPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      // Retrieve the user via the req.query.token.
      const newUser = await this.inject.identifyUserFromTokenStep.execute(req, res)

      // Update the new user account to indicate a confirmed registration state.
      newUser.registrationState = this.inject.UserRegistrationStates.confirmed
      await this.inject.dbService.getUserDataMapper().persist(newUser)

      // Reset the User object to Guest, to force the user to log in.
      res.locals.user = this.inject.UserFactory.createGuestUser()

      // Delete all tokens for this user relating to this action
      await this.inject.dbService.getTokenDataMapper().remove(res.locals.token)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetRegisterConfirmUseCase
