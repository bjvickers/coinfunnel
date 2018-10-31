'use strict'

const EventEmitter = require('events').EventEmitter

/**
 * Handles password changes for logged-in users.
 */
class PostChangePasswordUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostChangePasswordUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async updateUser (req, res) {
    const newDetailsUser = this.inject.UserFactory.createUserFromSchema(req.body, this.inject.PostChangePasswordMapping)
    newDetailsUser.password.encryptedPassword = await this.inject.passwordLibrary.getEncPasswordFromClearPassword(newDetailsUser.password.clearPassword)
    newDetailsUser.passwordState = this.inject.UserPasswordStates.confirmed
    res.locals.user.merge(newDetailsUser)
    return res.locals.user
  }

  async updateDatabase (user) {
    await this.inject.dbService.getUserDataMapper().persist(user)
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.postChangePasswordPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      await this.updateDatabase(await this.updateUser(req, res))

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostChangePasswordUseCase
