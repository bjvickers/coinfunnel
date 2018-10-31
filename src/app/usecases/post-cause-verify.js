'use strict'

const EventEmitter = require('events').EventEmitter

class PostCauseVerifyUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostCauseVerifyUseCase'
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
      this.inject.logService.debug({}, 'Begin cause verification...')
      const preconditionSatisfied = await this.inject.postCauseVerifyPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      res.locals.cause.verificationState = 'Pending'
      res.locals.cause.verificationOutcome = 'Pending'
      res.locals.cause.verificationOutcomeReason = null
      await this.inject.dbService.getCauseDataMapper().persist(res.locals.cause)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostCauseVerifyUseCase
