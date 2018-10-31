'use strict'

const EventEmitter = require('events').EventEmitter

class GetShowcaseUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetShowcaseUseCase'
    this.inject = inject
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.getShowcasePrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      res.locals.currentWallet = await this.inject.dbService.getWalletDataMapper().findCurrentByUserId(res.locals.cause.userId)
      res.locals.causeImages = await this.inject.dbService.getCauseImageDataMapper().findByCauseId(res.locals.cause.id)

      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetShowcaseUseCase
