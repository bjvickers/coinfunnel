'use strict'

const EventEmitter = require('events').EventEmitter

class GetIndexUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetIndexUseCase'
    this.inject = inject
  }

  async execute (req, res) {
    try {
      await this.inject.getIndexPrecondition.execute(req, res, this)

      res.locals.noOfCausesOnline = await this.inject.dbService.getCauseDataMapper().getNoOfCausesOnline()
      res.locals.recentCauses = await this.inject.dbService.getCauseDataMapper().getLatest()

      const totals = await this.inject.dbService.getTotalsDataMapper().getTotals()
      res.locals.sumTotalMiners = totals.sum_all_miners || 0
      res.locals.sumTotalPayouts = totals.sum_all_payouts || 0

      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetIndexUseCase
