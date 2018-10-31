'use strict'

const EventEmitter = require('events').EventEmitter

/**
 * Handles password changes for logged-out users.
 */
class PostResetPasswordConfirmUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostResetPasswordConfirmUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async updateUser (req, res) {
    const newDetailsUser = this.inject.UserFactory.createUserFromSchema(req.body, this.inject.PostResetPasswordConfirmMapping)
    newDetailsUser.password.encryptedPassword = await this.inject.passwordLibrary.getEncPasswordFromClearPassword(newDetailsUser.password.clearPassword)
    newDetailsUser.passwordState = this.inject.UserPasswordStates.confirmed
    res.locals.user.merge(newDetailsUser)
    return res.locals.user
  }

  async updateDatabase (user, token) {
    await this.inject.dbService.getUserDataMapper().persist(user)
    // Delete all tokens for this user relating to this action
    await this.inject.dbService.getTokenDataMapper().remove(token)
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.postResetPasswordConfirmPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      // Update the user account to indicate a confirmed password state.
      res.locals.user = await this.updateUser(req, res)
      await this.updateDatabase(res.locals.user, res.locals.token)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostResetPasswordConfirmUseCase
