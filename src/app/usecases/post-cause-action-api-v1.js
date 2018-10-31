'use strict'

const EventEmitter = require('events').EventEmitter

class PostCauseActionAPIV1UseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostCauseActionAPIV1UseCase'
    this.inject = inject
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.postCauseActionAPIV1Precondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      let sumAllMiners = await this.inject.dbService.getTotalsDataMapper().getSumAllMiners()

      if (res.locals.causeAction === 'add') {
        res.locals.cause.totalMiners++
        sumAllMiners++
      } else {
        res.locals.cause.totalMiners--
        sumAllMiners--
      }

      await this.inject.dbService.getCauseDataMapper().persist(res.locals.cause)
      await this.inject.dbService.getTotalsDataMapper().persistSumAllMiners(sumAllMiners)

      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostCauseActionAPIV1UseCase
