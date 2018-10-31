'use strict'

const EventEmitter = require('events').EventEmitter

class PostCauseOnlineStatusUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostCauseOnlineStatusUseCase'
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
      this.inject.logService.debug({}, 'Toggling online status...')
      const preconditionSatisfied = await this.inject.postCauseOnlineStatusPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      await this.inject.toggleCauseOnlineStatusStep.execute(res.locals.cause)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostCauseOnlineStatusUseCase
