'use strict'

const EventEmitter = require('events').EventEmitter

class GetRegisterUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetRegisterUseCase'
    this.inject = inject
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.getRegisterPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      this.emit('handleRedirect', this.inject.redirectToAuthorisedRouteStep.execute(req, res))
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetRegisterUseCase
