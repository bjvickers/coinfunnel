'use strict'

const EventEmitter = require('events').EventEmitter

class GetResetPasswordConfirmUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetResetPasswordConfirmUseCase'
    this.inject = inject
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.getResetPasswordConfirmPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      await this.inject.identifyUserFromTokenStep.execute(req, res)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetResetPasswordConfirmUseCase
