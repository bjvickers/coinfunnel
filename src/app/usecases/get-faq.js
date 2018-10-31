'use strict'

const EventEmitter = require('events').EventEmitter

class GetFAQUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetFAQUseCase'
    this.inject = inject
  }

  async execute (req, res) {
    try {
      await this.inject.getFAQPrecondition.execute(req, res, this)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetFAQUseCase
