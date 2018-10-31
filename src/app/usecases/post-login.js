'use strict'

const EventEmitter = require('events').EventEmitter

class PostLoginUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostLoginUseCase'
    this.inject = inject
  }

  async recordLogin (user) {
    // Make a note of the Users current value for lastLoggedIn. Then
    // update this value in the database to reflect the current login date.
    // Then reassign the old value for display purposes.
    const lastLoggedIn = user.lastLoggedIn
    user.lastLoggedIn = new Date()
    await this.inject.dbService.getUserDataMapper().persist(user)
    user.lastLoggedIn = lastLoggedIn
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.postLoginPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      await this.recordLogin(res.locals.user)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostLoginUseCase
