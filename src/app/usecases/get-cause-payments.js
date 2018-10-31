'use strict'

const EventEmitter = require('events').EventEmitter

class GetCausePaymentsUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetCausePaymentsUseCase'
    this.inject = inject
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.getCausePaymentsPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      console.log('here in the payments thing2')
      res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByUserId(res.locals.user.id)
      res.locals.causePayouts = await this.inject.dbService.getCausePayoutDataMapper().getAllPayoutsForCause(res.locals.cause)

      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetCausePaymentsUseCase
